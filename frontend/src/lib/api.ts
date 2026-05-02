import type { MenuResponse, ChatRequest, ChatResponse, OrderRequest, OrderResponse } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function fetchMenu(): Promise<MenuResponse> {
  const res = await fetch(`${API_BASE}/api/menu`);
  if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
  return res.json();
}

export async function submitOrder(req: OrderRequest): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Order request failed: ${res.status}`);
  }
  return res.json();
}

export async function sendChat(req: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Chat request failed: ${res.status}`);
  }
  return res.json();
}
