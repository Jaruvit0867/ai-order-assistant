# Architecture

## System Overview

```
[Customer Phone]
     |
     | QR Code scan (HTTPS)
     v
[Frontend - React SPA]     <--->   [Backend - FastAPI]
                                     |        |        |
                                     |        |        |
                                     v        v        v
                              [menu.json] [Azure AI] [Logic App]
                                                    |
                                                    v
                                              [LINE OA]
                                                    |
                                                    v
                                           [Restaurant Owner]
```

## Data Flow

### 1. Menu Browsing

1. Customer scans QR code, opens web app
2. Frontend calls `GET /api/menu`
3. Backend loads `menu.json`, returns categories + items
4. If backend unavailable, frontend uses hardcoded fallback menu

### 2. AI Chat (Per Dish)

1. Customer taps "Ask AI" on a dish card
2. ChatPopup opens with dish thumbnail and suggested questions
3. Frontend sends `POST /api/chat` with `{ prompt, menu_item_id, session_id }`
4. Backend looks up dish name from menu.json
5. First message in session: injects lightweight dish reference into history
6. Backend calls Azure AI Foundry agent (`POST {endpoint}/openai/v1/responses`)
7. Agent uses its built-in Azure index to search for dish details
8. Response returned to frontend, displayed in chat bubble
9. Session history maintained in-memory (keyed by session_id)

Key constraint: Azure AI Foundry agent does not accept `instructions` or `system` role when using `agent_reference`. Context is embedded in user messages instead.

### 3. Order Placement

1. Customer taps "+" on a dish card
2. AddonsPopup opens with add-ons, quantity selector, and note field
3. Customer selects addons/qty/note, taps "Add to Cart"
4. CartButton (floating badge) shows item count and total
5. Customer taps CartButton, opens CartDrawer
6. Customer taps "Confirm Order"
7. Frontend fires `POST /api/order` (fire-and-forget, shows success immediately)
8. Backend returns success immediately
9. Background task: translates notes to Thai via Azure AI, formats message, sends to Logic App
10. Logic App forwards message to LINE OA via Push Message API
11. Restaurant owner receives notification

## Component Architecture

### Frontend

```
App.tsx (state: language, menuData, cart, selectedItems)
  |
  +-- Header (language toggle)
  +-- MenuGrid
  |     +-- MenuCard[] (each has "Ask AI" + "+" buttons)
  +-- ChatPopup (full-screen mobile / side panel desktop)
  |     +-- ChatMessage[]
  |     +-- ChatInput
  +-- AddonsPopup (slide-up panel for addons/qty/note)
  +-- CartButton (floating badge, fixed bottom)
  +-- CartDrawer (slide-up panel with cart items)
  +-- OrderSuccess (full-screen success confirmation)
```

### Backend

```
main.py (FastAPI app with CORS)
  |
  +-- routers/menu.py    -> GET /api/menu (loads menu.json)
  +-- routers/chat.py    -> POST /api/chat (Azure AI Foundry)
  +-- routers/order.py   -> POST /api/order (Logic App)
  |
  +-- services/azure_foundry.py
        - DefaultAzureCredential auth
        - POST {endpoint}/openai/v1/responses
        - agent_reference + input messages (no instructions)
```

## i18n Strategy

- Auto-detect from `navigator.language` on first visit
- Stored in localStorage (`ai-street-food-language`)
- 4 languages: Thai, English, Japanese, Chinese
- Menu dish names always displayed in Thai (restaurant identity)
- Add-on names and descriptions follow selected language
- Translation keys cover all UI text including order flow

## Design Decisions

| Decision | Reason |
|----------|--------|
| No login required | QR code at table = instant access for tourists |
| In-memory chat sessions | Prototype scope; no persistent storage needed |
| Fire-and-forget orders | Customer sees instant success; translation happens in background |
| AI-translated notes | Tourist writes note in any language; owner reads Thai |
| Fallback menu in frontend | Works offline or when backend is down |
| Azure AI Foundry agent (not raw OpenAI) | Agent has built-in index search for dish knowledge base |
| Logic App (not Azure Functions) | Visual workflow editor; no code deployment needed |
