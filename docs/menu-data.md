# Menu Data Format

The menu data lives in `backend/app/data/menu.json` and serves as the single source of truth for all dishes, categories, and add-ons.

## Schema

### Restaurant

```json
{
  "name_th": "Thai name",
  "name_en": "English name",
  "table_number": 1
}
```

### Category

```json
{
  "id": "stir_fry",
  "name_th": "...",
  "name_en": "..."
}
```

Category IDs used: `rice`, `stir_fry`, `curry`, `soup`, `appetizer`, `dessert`

### Menu Item

```json
{
  "id": "pad_thai",
  "name_th": "...",
  "name_en": "...",
  "description_th": "...",
  "description_en": "...",
  "price": 60,
  "image_url": "https://...",
  "category": "stir_fry",
  "ingredients": ["rice noodles", "shrimp"],
  "ingredients_th": ["...", "..."],
  "spice_level": 2,
  "allergens": ["shellfish", "peanuts"],
  "is_vegetarian": false,
  "is_vegan": false,
  "addons": [...]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (snake_case) |
| `name_th` | string | Thai dish name (always displayed) |
| `name_en` | string | English dish name |
| `description_th` | string | Thai description |
| `description_en` | string | English description |
| `price` | int | Base price in Thai baht |
| `image_url` | string | Image URL (Unsplash used for prototype) |
| `category` | string | Category ID for filtering |
| `ingredients` | string[] | English ingredient list |
| `ingredients_th` | string[] | Thai ingredient list |
| `spice_level` | int | 0-5 spice indicator (0 = not spicy) |
| `allergens` | string[] | Allergen list |
| `is_vegetarian` | bool | Vegetarian-friendly |
| `is_vegan` | bool | Vegan-friendly |
| `addons` | array | Available add-ons for this dish |

### Add-on

```json
{
  "id": "special",
  "name_th": "...",
  "name_en": "...",
  "price": 10
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique within the dish |
| `name_th` | string | Thai name |
| `name_en` | string | English name |
| `price` | int | Additional price (0 = free) |

## Add-on Conventions

- Base add-on is always "Special (large)" / id `special` -- represents the Thai street food "peset" (larger portion) upgrade
- Each dish has its own unique add-ons relevant to that dish
- Free add-ons (price: 0) are modifications like "no spicy", "no peanuts"
- Paid add-ons are extras like "extra egg", "extra shrimp", "extra meat"
- Add-ons are per-dish, not global

## Current Dishes (10 items)

| ID | Name (TH) | Category | Price | Spice |
|----|-----------|----------|-------|-------|
| pad_thai | Thai | stir_fry | 60 | 2 |
| tom_yum | Thai | soup | 80 | 4 |
| green_curry | Thai | curry | 70 | 3 |
| khao_pad | Thai | rice | 55 | 2 |
| pad_kra_pao | Thai | stir_fry | 50 | 4 |
| som_tum | Thai | appetizer | 45 | 3 |
| massaman | Thai | curry | 75 | 2 |
| khao_mok | Thai | rice | 55 | 1 |
| satay | Thai | appetizer | 50 | 1 |
| mango_sticky_rice | Thai | dessert | 55 | 0 |

## Adding a New Dish

1. Add the dish object to `items` array in `menu.json`
2. Add the same dish to `FALLBACK_MENU` in `frontend/src/App.tsx`
3. Ensure all required fields are present
4. Include at least the "special" (large portion) add-on
5. Restart backend (uvicorn --reload picks up JSON changes automatically)
