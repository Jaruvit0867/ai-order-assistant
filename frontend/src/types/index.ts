export type Language = "th" | "en" | "ja" | "zh";

export interface Addon {
  id: string;
  name_th: string;
  name_en: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  ingredients_th: string[];
  spice_level: number;
  allergens: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  addons: Addon[];
}

export interface MenuCategory {
  id: string;
  name_th: string;
  name_en: string;
}

export interface MenuResponse {
  restaurant: {
    name_th: string;
    name_en: string;
    table_number: number;
  };
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  prompt: string;
  menu_item_id: string;
  session_id: string;
}

export interface ChatResponse {
  answer: string;
  history: ChatMessage[];
}

export interface CartItem {
  menuItem: MenuItem;
  qty: number;
  addons: Addon[];
  note: string;
}

export interface OrderRequest {
  table: number;
  items: {
    name: string;
    qty: number;
    price: number;
    addons: string[];
    note: string;
  }[];
  total: number;
  note: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
}
