# AI Order Assistant

A mobile-first web application for Thai street food restaurants. Customers scan a QR code on their table to view the menu, ask AI about dishes, and place orders. The restaurant owner receives real-time order notifications via LINE Official Account.

Built as a hackathon prototype for Microsoft presentation, showcasing Azure AI Foundry, Azure Logic Apps, and LINE Messaging API integration.

## Features

- Mobile-first responsive menu with Thai/English/Japanese/Chinese support
- AI chat assistant per dish (Azure AI Foundry agent with index search)
- Add-ons selection, quantity, and special notes per item
- Shopping cart with order confirmation
- LINE OA notification to restaurant owner with AI-translated notes
- Language auto-detection from device settings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, TypeScript 6, Tailwind CSS v4 |
| Backend | Python, FastAPI, uvicorn, httpx |
| AI | Azure AI Foundry (agent with built-in index search) |
| Notification | Azure Logic Apps (Stateful) + LINE Messaging API |
| Auth | Azure DefaultAzureCredential (backend-to-Azure) |

## Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Azure account with AI Foundry project

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then fill in your values
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Environment Variables

| Variable | Description |
|----------|-------------|
| `AZURE_EXISTING_AIPROJECT_ENDPOINT` | Azure AI Foundry project endpoint URL |
| `AZURE_EXISTING_AGENT_ID` | Agent name and version (e.g., `my-agent:1`) |
| `LOGIC_APP_ORDER_URL` | Azure Logic App HTTP trigger URL |
| `FRONTEND_ORIGIN` | Frontend URL for CORS (default: `http://localhost:5173`) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | Get full menu with categories and items |
| POST | `/api/chat` | Ask AI about a dish |
| POST | `/api/order` | Place an order (sends to Logic App) |

## Documentation

See [docs/](docs/) directory for detailed documentation:

- [Architecture](docs/architecture.md) - System design and data flow
- [Setup Guide](docs/setup-guide.md) - Azure and LINE OA setup instructions
- [API Reference](docs/api-reference.md) - Full API documentation
- [Menu Data Format](docs/menu-data.md) - Menu JSON schema and addons
- [Deployment](docs/deployment.md) - Deploy to Azure (Web App + Static Web Apps)

## Project Structure

```
ai-order-assistant/
  backend/
    app/
      config.py          # Environment settings (pydantic-settings)
      main.py             # FastAPI app entry point
      models.py           # Pydantic models
      data/menu.json      # Menu data (10 Thai dishes)
      routers/
        menu.py           # GET /api/menu
        chat.py           # POST /api/chat
        order.py          # POST /api/order
      services/
        azure_foundry.py  # Azure AI Foundry REST client
  frontend/
    src/
      App.tsx             # Root component with cart state
      types/index.ts      # TypeScript interfaces
      lib/
        api.ts            # API client (fetchMenu, sendChat, submitOrder)
        i18n.ts           # i18n (TH/EN/JP/ZH) with auto-detect
      components/         # React components
      hooks/useChat.ts    # Chat state management hook
      styles/index.css    # Tailwind v4 theme
```