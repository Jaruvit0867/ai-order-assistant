from fastapi import APIRouter, HTTPException

from ..models import ChatRequest, ChatResponse, ChatMessage
from ..routers.menu import load_menu
from ..services.azure_foundry import call_azure_agent

router = APIRouter(prefix="/api", tags=["chat"])

# In-memory chat history keyed by session_id
_sessions: dict[str, list[ChatMessage]] = {}
# Track dish context per session (so we only set it once)
_session_dish: dict[str, dict] = {}


def _lookup_dish(menu_item_id: str) -> dict:
    menu = load_menu()
    item = next((i for i in menu["items"] if i["id"] == menu_item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item '{menu_item_id}' not found")
    return item


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    history = _sessions.get(req.session_id, [])

    # First message in session: inject lightweight dish reference
    # Agent will use its Azure index to search for details
    if req.session_id not in _session_dish:
        dish = _lookup_dish(req.menu_item_id)
        _session_dish[req.session_id] = dish

        # Tell the agent which dish the customer is asking about
        history.append(ChatMessage(
            role="user",
            content=f"The customer is asking about: {dish['name_en']} ({dish['name_th']}). Please use your knowledge base to answer their questions about this dish.",
        ))
        history.append(ChatMessage(
            role="assistant",
            content=f"Got it! I'll help with questions about {dish['name_th']}. What would you like to know?",
        ))

    # Add user's actual question
    history.append(ChatMessage(role="user", content=req.prompt))

    # Call Azure agent - it will use index search to find dish details
    answer = await call_azure_agent(messages=history)

    history.append(ChatMessage(role="assistant", content=answer))
    _sessions[req.session_id] = history

    return ChatResponse(answer=answer, history=history)
