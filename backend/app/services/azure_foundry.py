import httpx
from fastapi import HTTPException

from ..config import settings
from ..models import ChatMessage

SCOPE = "https://ai.azure.com/.default"


def _parse_agent_id(raw: str) -> dict:
    """Parse agent ID in 'name' or 'name:version' format."""
    value = raw.strip().strip("'\"")
    if ":" in value:
        name, version = value.rsplit(":", 1)
        return {"type": "agent_reference", "name": name, "version": version}
    return {"type": "agent_reference", "name": value}


def _get_token() -> str:
    """Acquire Azure access token via DefaultAzureCredential."""
    try:
        from azure.identity import DefaultAzureCredential
        credential = DefaultAzureCredential()
        token = credential.get_token(SCOPE)
        return token.token
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Azure authentication failed: {e}",
        )


def _extract_answer(response: dict) -> str:
    """Extract text answer from Azure AI Foundry response envelope."""
    # Try output_text first (convenience field)
    output_text = response.get("output_text")
    if output_text and output_text.strip():
        return output_text.strip()

    # Fall back to output[].content[].text
    for item in response.get("output", []):
        contents = item.get("content", [])
        parts = []
        for c in contents:
            text = c.get("text")
            if text and text.strip():
                parts.append(text.strip())
        if parts:
            return "\n".join(parts)

    raise HTTPException(
        status_code=502,
        detail="Azure AI Foundry agent returned no text answer.",
    )


async def call_azure_agent(
    messages: list[ChatMessage],
) -> str:
    """Call Azure AI Foundry agent and return the answer text."""
    endpoint = settings.azure_existing_aiproject_endpoint.rstrip("/")
    agent_id = settings.azure_existing_agent_id

    if not endpoint or not agent_id:
        raise HTTPException(
            status_code=503,
            detail="Azure AI Foundry is not configured. Set AZURE_EXISTING_AIPROJECT_ENDPOINT and AZURE_EXISTING_AGENT_ID.",
        )

    token = _get_token()
    agent_ref = _parse_agent_id(agent_id)

    # Build input from conversation history (context is embedded in user messages by chat router)
    input_messages = []
    for m in messages:
        if m.content and m.content.strip():
            input_messages.append({"role": m.role, "content": m.content})

    # Note: no "instructions" field - agents don't allow it
    body: dict = {
        "agent_reference": agent_ref,
        "input": input_messages,
    }

    url = f"{endpoint}/openai/v1/responses"

    async with httpx.AsyncClient(timeout=60) as client:
        try:
            resp = await client.post(
                url,
                json=body,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            detail = e.response.text[:500] if e.response else str(e)
            raise HTTPException(
                status_code=502,
                detail=f"Azure AI Foundry request failed: HTTP {e.response.status_code}, {detail}",
            )
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=502,
                detail=f"Azure AI Foundry request failed: {e}",
            )

    return _extract_answer(resp.json())
