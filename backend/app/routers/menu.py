import json
from pathlib import Path

from fastapi import APIRouter

from ..models import MenuResponse

router = APIRouter(prefix="/api", tags=["menu"])

DATA_PATH = Path(__file__).parent.parent / "data" / "menu.json"


def _load_menu() -> dict:
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)


_menu_cache: dict | None = None


def load_menu() -> dict:
    global _menu_cache
    if _menu_cache is None:
        _menu_cache = _load_menu()
    return _menu_cache


@router.get("/menu", response_model=MenuResponse)
async def get_menu():
    return load_menu()
