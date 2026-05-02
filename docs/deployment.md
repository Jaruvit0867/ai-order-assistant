# Deployment

## Overview

| Component | Azure Service | Method |
|-----------|--------------|--------|
| Backend (FastAPI) | Azure Web App for Containers | Docker image via Docker Hub |
| Frontend (React/Vite) | Azure Static Web Apps | GitHub Actions auto-deploy |

## Backend - Azure Web App

### 1. Build Docker image (amd64)

Run from the `backend/` directory:

```bash
docker build --platform linux/amd64 -t ai-order-backend:latest .
```

### 2. Push to Docker Hub

```bash
docker tag ai-order-backend:latest <your-dockerhub-user>/ai-order-backend:latest
docker push <your-dockerhub-user>/ai-order-backend:latest
```

### 3. Create Azure Web App

1. Azure Portal -> Create a resource -> **Web App**
2. **Publish**: Docker Container
3. **Operating System**: Linux
4. **SKU**: Basic B1 or higher
5. **Image source**: Docker Hub
6. **Image and tag**: `<your-dockerhub-user>/ai-order-backend:latest`
7. Create

### 4. Configure environment variables

Azure Portal -> Web App -> Configuration -> Application settings:

| Name | Value |
|------|-------|
| `AZURE_EXISTING_AIPROJECT_ENDPOINT` | `https://<resource>.services.ai.azure.com/api/projects/<project>` |
| `AZURE_EXISTING_AGENT_ID` | `<agent-name>:<version>` |
| `LOGIC_APP_ORDER_URL` | `https://prod-<region>.logic.azure.com:443/workflows/...` |
| `FRONTEND_ORIGIN` | `https://<your-static-app>.azurestaticapps.net` |
| `PORT` | `8000` |
| `WEBSITES_PORT` | `8000` |

### 5. Update deployment

After pushing a new Docker image, restart the Web App or enable continuous deployment to auto-pull on image update.

## Frontend - Azure Static Web Apps

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-user>/<repo>.git
git push -u origin main
```

### 2. Create Static Web App

1. Azure Portal -> Create a resource -> **Static Web App**
2. **Source**: GitHub
3. Sign in and select repository + branch (`main`)
4. **Build Presets**: Custom
5. **App location**: `/frontend`
6. **Api location**: (leave empty)
7. **Output location**: `dist`
8. Create

Azure will auto-generate a GitHub Actions workflow file in `.github/workflows/`.

### 3. Add backend URL to GitHub Secrets

The frontend needs to know the backend URL at build time.

1. GitHub repo -> Settings -> Secrets and variables -> Actions
2. Add secret:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://<your-backend-webapp>.azurewebsites.net`

### 4. Update workflow file

Edit `.github/workflows/azure-static-web-apps-*.yml` to pass the env var during build:

```yaml
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_XXX }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          api_location: ""
          output_location: "dist"
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

### 5. Deploy

Every push to `main` triggers GitHub Actions to build and deploy automatically.

To trigger manually:

```bash
git commit --allow-empty -m "trigger rebuild"
git push
```

### Note on API linking

Azure Static Web Apps can only link to Azure Functions or API Management as managed APIs. Since the backend is a Docker container on Web App, the frontend connects via the `VITE_API_BASE_URL` environment variable instead.

## CORS

The backend CORS is configured via `FRONTEND_ORIGIN` env var. Set it to the Static Web Apps URL:

```
FRONTEND_ORIGIN=https://<your-static-app>.azurestaticapps.net
```

After changing this, restart the backend Web App.
