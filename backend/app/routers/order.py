import httpx
import asyncio
from fastapi import APIRouter, HTTPException

from ..config import settings
from ..models import OrderRequest, OrderResponse, ChatMessage
from ..services.azure_foundry import call_azure_agent

router = APIRouter(prefix="/api", tags=["order"])


async def _translate_note(note: str) -> str:
    """Translate a single note to Thai via Azure AI agent."""
    if not note.strip():
        return ""
    try:
        messages = [
            ChatMessage(
                role="user",
                content=(
                    "Translate the following text to Thai. "
                    "Reply with ONLY the Thai translation, nothing else:\n\n"
                    f"{note}"
                ),
            ),
        ]
        return await call_azure_agent(messages=messages)
    except Exception:
        return note


async def _translate_notes(items: list) -> dict[str, str]:
    """Translate all unique notes and return {original: translated} map."""
    notes = set()
    for item in items:
        if item.get("note", "").strip():
            notes.add(item["note"])
    if not notes:
        return {}
    translations = {}
    for note in notes:
        translations[note] = await _translate_note(note)
    return translations


def _format_line_message(req: OrderRequest, note_translations: dict[str, str]) -> str:
    """Format order as Thai text for LINE notification."""
    lines = ["📦 ออเดอร์ใหม่!"]
    for item in req.items:
        addon_str = f" ({', '.join(item.addons)})" if item.addons else ""
        line = f"• {item.name} x{item.qty}{addon_str} → {item.price * item.qty} บาท"
        if item.note:
            translated = note_translations.get(item.note, item.note)
            line += f"\n  📝 {translated}"
        lines.append(line)
    lines.append(f"💰 รวมทั้งหมด: {req.total} บาท")
    return "\n".join(lines)


async def _send_to_logic_app(payload: dict, req: OrderRequest) -> None:
    """Background: translate notes + send to Logic App."""
    logic_app_url = settings.logic_app_order_url
    if not logic_app_url:
        print("[ORDER] No LOGIC_APP_ORDER_URL configured.")
        return

    # Translate all notes
    note_translations = await _translate_notes(payload.get("items", []))

    # Format message with translated notes
    payload["message"] = _format_line_message(req, note_translations)

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(logic_app_url, json=payload)
            resp.raise_for_status()
            print(f"[ORDER] Sent to Logic App. Status: {resp.status_code}")
        except Exception as e:
            print(f"[ORDER] Failed to send to Logic App: {e}")


@router.post("/order", response_model=OrderResponse)
async def place_order(req: OrderRequest):
    if not req.items:
        raise HTTPException(status_code=400, detail="No items in order")

    # Initial message (notes not yet translated)
    message = _format_line_message(req, {})

    payload = {
        "table": req.table,
        "items": [
            {
                "name": item.name,
                "qty": item.qty,
                "price": item.price,
                "addons": item.addons,
                "note": item.note,
            }
            for item in req.items
        ],
        "total": req.total,
        "note": req.note,
        "message": message,
    }

    # Fire and forget — translate + send in background
    asyncio.create_task(_send_to_logic_app(payload, req))

    return OrderResponse(success=True, message="Order sent successfully")
