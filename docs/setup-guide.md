# Setup Guide

## 1. Azure AI Foundry

### Create Agent

1. Go to Azure AI Foundry portal
2. Create a new project
3. Create an agent with an attached index (knowledge base about Thai dishes)
4. Note the project endpoint and agent name/version

### Get Credentials

- **Endpoint**: Found in project settings, format: `https://{resource}.services.ai.azure.com/api/projects/{project}`
- **Agent ID**: `{agent-name}:{version}` (e.g., `order-assistant:2`)

### Authentication

The backend uses `DefaultAzureCredential` from `azure-identity`. Supported auth methods:

1. `az login` (Azure CLI)
2. Visual Studio Code Azure extension
3. Managed Identity (when deployed to Azure)
4. Environment variables (`AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`)

## 2. Azure Logic App

### Create Workflow

1. Go to Azure Portal -> Create resource -> Logic App
2. Select **Stateful** workflow type
3. Region: choose closest to your location

### Configure Trigger

1. Add trigger: **When an HTTP request is received**
2. Method: POST
3. The URL will be generated after saving (this goes in `LOGIC_APP_ORDER_URL`)

### Add HTTP Action (LINE Messaging API)

1. Add action: **HTTP**
2. Method: POST
3. URL: `https://api.line.me/v2/bot/message/push`
4. Headers:
   - `Authorization`: `Bearer {YOUR_CHANNEL_ACCESS_TOKEN}`
   - `Content-Type`: `application/json`
5. Body:
```json
{
  "to": "{YOUR_LINE_USER_ID}",
  "messages": [
    {
      "type": "text",
      "text": "@{triggerBody()['message']}"
    }
  ]
}
```

Note: `@{triggerBody()['message']}` is a Logic App expression. In the designer, click inside the text field -> Expression tab -> type `triggerBody()['message']`.

## 3. LINE Official Account

### Create LINE OA

1. Go to [LINE Developers Console](https://developers.line.biz/console)
2. Create a provider
3. Create a Messaging API channel
4. Enable Messaging API

### Get Channel Access Token

1. In channel settings -> Messaging API tab
2. Under Channel access token -> click **Issue**
3. Copy the token (use this in Logic App HTTP action header)

### Get Your LINE User ID

1. In LINE Developers Console -> channel settings -> Basic settings tab
2. Scroll to "Your user ID" or use the LINE Official Account Manager
3. This goes in the `to` field of the Logic App HTTP body

### Note on Webhook

This project does NOT need a LINE webhook URL. It only uses the Push Message API (server-to-user), not webhook events (user-to-server).

## 4. Environment Configuration

### Backend `.env`

```env
AZURE_EXISTING_AIPROJECT_ENDPOINT=https://{resource}.services.ai.azure.com/api/projects/{project}
AZURE_EXISTING_AGENT_ID={agent-name}:{version}
LOGIC_APP_ORDER_URL={logic-app-http-trigger-url}
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend

No environment variables required for development. The frontend proxies API calls to `localhost:8000` via Vite config.

## 5. Running the Application

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 on your phone or browser.

## 6. Testing the Flow

1. Open the app in a browser
2. Browse menu categories
3. Tap "Ask AI" on any dish -> ask questions in chat
4. Tap "+" on any dish -> select add-ons, set quantity, write note
5. Tap floating cart badge at bottom -> review items
6. Tap "Confirm Order" -> success screen appears immediately
7. Check LINE OA on phone -> order notification arrives with translated note
