from pydantic import BaseModel


class MenuItem(BaseModel):
    id: str
    name_th: str
    name_en: str
    description_th: str
    description_en: str
    price: int
    image_url: str
    category: str
    ingredients: list[str]
    ingredients_th: list[str]
    spice_level: int
    allergens: list[str]
    is_vegetarian: bool
    is_vegan: bool
    addons: list[dict] = []


class MenuCategory(BaseModel):
    id: str
    name_th: str
    name_en: str


class RestaurantInfo(BaseModel):
    name_th: str
    name_en: str
    table_number: int


class MenuResponse(BaseModel):
    restaurant: RestaurantInfo
    categories: list[MenuCategory]
    items: list[MenuItem]


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    prompt: str
    menu_item_id: str
    session_id: str


class ChatResponse(BaseModel):
    answer: str
    history: list[ChatMessage]


class OrderItem(BaseModel):
    name: str
    qty: int
    price: int
    addons: list[str]
    note: str = ""


class OrderRequest(BaseModel):
    table: int
    items: list[OrderItem]
    total: int
    note: str


class OrderResponse(BaseModel):
    success: bool
    message: str
