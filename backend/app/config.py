from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    azure_existing_aiproject_endpoint: str = ""
    azure_existing_agent_id: str = ""
    logic_app_order_url: str = ""
    frontend_origin: str = "http://localhost:5173"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
