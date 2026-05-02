from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import menu, chat, order

app = FastAPI(title="AI Order Assistant", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu.router)
app.include_router(chat.router)
app.include_router(order.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
