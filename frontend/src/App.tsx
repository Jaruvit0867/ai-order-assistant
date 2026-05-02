import { useState, useEffect, useCallback } from "react";
import type { Language, MenuItem, MenuResponse, CartItem, Addon } from "./types";
import { detectLanguage } from "./lib/i18n";
import { fetchMenu, submitOrder } from "./lib/api";
import Header from "./components/Header";
import MenuGrid from "./components/MenuGrid";
import ChatPopup from "./components/ChatPopup";
import AddonsPopup from "./components/AddonsPopup";
import CartButton from "./components/CartButton";
import CartDrawer from "./components/CartDrawer";
import OrderSuccess from "./components/OrderSuccess";

type OrderSnapshot = {
  items: CartItem[];
  total: number;
};

const FALLBACK_MENU: MenuResponse = {
  restaurant: { name_th: "ร้านอาหารสตรีทฟู้ด", name_en: "Thai Street Food", table_number: 1 },
  categories: [
    { id: "rice", name_th: "ข้าว", name_en: "Rice Dishes" },
    { id: "stir_fry", name_th: "ผัด", name_en: "Stir-fried" },
    { id: "curry", name_th: "แกง", name_en: "Curries" },
    { id: "soup", name_th: "ต้ม", name_en: "Soups" },
    { id: "appetizer", name_th: "อาหารเรียกน้ำย่อย", name_en: "Appetizers" },
    { id: "dessert", name_th: "ของหวาน", name_en: "Desserts" },
  ],
  items: [
    {
      id: "pad_thai",
      name_th: "ผัดไทยกุ้งสด",
      name_en: "Pad Thai with Fresh Shrimp",
      description_th: "เส้นจันทน์ผัดกุ้งสด ไข่ เต้าหู้ ถั่วงอก โรยถั่วลิสงบด มะนาว",
      description_en: "Stir-fried rice noodles with fresh shrimp, egg, tofu, bean sprouts, and crushed peanuts.",
      price: 60,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Pad_Thai_with_Shrimp_%283262640010%29.jpg/960px-Pad_Thai_with_Shrimp_%283262640010%29.jpg",
      category: "stir_fry",
      ingredients: ["rice noodles", "shrimp", "egg", "tofu", "bean sprouts", "peanuts", "lime"],
      ingredients_th: ["เส้นจันทน์", "กุ้ง", "ไข่", "เต้าหู้", "ถั่วงอก", "ถั่วลิสง", "มะนาว"],
      spice_level: 2,
      allergens: ["shellfish", "peanuts", "soy", "egg"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_shrimp", name_th: "กุ้งเพิ่ม", name_en: "Extra shrimp", price: 20 },
        { id: "extra_egg", name_th: "ไข่เพิ่ม", name_en: "Extra egg", price: 10 },
        { id: "no_peanuts", name_th: "ไม่ใส่ถั่ว", name_en: "No peanuts", price: 0 },
      ],
    },
    {
      id: "tom_yum",
      name_th: "ต้มยำกุ้ง",
      name_en: "Tom Yum Goong",
      description_th: "ซุปเปรี้ยวเผ็ดร้อนใส่กุ้งสด เห็ด ตะไคร้ ใบมะกรูด",
      description_en: "Spicy and sour soup with fresh shrimp, mushrooms, lemongrass, and kaffir lime leaves.",
      price: 80,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Tom_yum_goong-01.jpg/960px-Tom_yum_goong-01.jpg",
      category: "soup",
      ingredients: ["shrimp", "mushroom", "lemongrass", "galangal", "kaffir lime", "chili", "lime juice"],
      ingredients_th: ["กุ้ง", "เห็ด", "ตะไคร้", "ข่า", "ใบมะกรูด", "พริก", "มะนาว"],
      spice_level: 4,
      allergens: ["shellfish"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_shrimp", name_th: "กุ้งเพิ่ม", name_en: "Extra shrimp", price: 20 },
        { id: "extra_mushroom", name_th: "เห็ดเพิ่ม", name_en: "Extra mushroom", price: 10 },
        { id: "no_spicy", name_th: "ไม่เผ็ด", name_en: "No spicy", price: 0 },
      ],
    },
    {
      id: "green_curry",
      name_th: "แกงเขียวหวานไก่",
      name_en: "Green Curry Chicken",
      description_th: "แกงกะทิเขียวหวานใส่ไก่ มะเขือ ใบโหระพา",
      description_en: "Coconut green curry with chicken, Thai eggplant, and basil leaves.",
      price: 70,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Chicken_Thai_Green_Curry.jpg/960px-Chicken_Thai_Green_Curry.jpg",
      category: "curry",
      ingredients: ["chicken", "coconut milk", "green curry paste", "Thai eggplant", "basil", "bamboo shoots"],
      ingredients_th: ["ไก่", "กะทิ", "พริกแกงเขียวหวาน", "มะเขือ", "ใบโหระพา", "หน่อไม้"],
      spice_level: 3,
      allergens: ["coconut"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_meat", name_th: "เนื้อเพิ่ม", name_en: "Extra meat", price: 20 },
        { id: "extra_egg", name_th: "ไข่ด้าวเพิ่ม", name_en: "Extra fried egg", price: 10 },
        { id: "no_spicy", name_th: "ไม่เผ็ด", name_en: "No spicy", price: 0 },
      ],
    },
    {
      id: "khao_pad",
      name_th: "ข้าวผัดกุ้ง",
      name_en: "Fried Rice with Shrimp",
      description_th: "ข้าวผัดร้อนๆ ใส่กุ้ง ไข่ แครอท ถั่ว พริกขี้หนู",
      description_en: "Wok-fried rice with shrimp, egg, carrot, green beans, and chili.",
      price: 55,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Khao_Phat_Kung.jpg/960px-Khao_Phat_Kung.jpg",
      category: "rice",
      ingredients: ["rice", "shrimp", "egg", "carrot", "green beans", "garlic", "soy sauce"],
      ingredients_th: ["ข้าว", "กุ้ง", "ไข่", "แครอท", "ถั่ว", "กระเทียม", "ซอสถั่วเหลือง"],
      spice_level: 2,
      allergens: ["shellfish", "soy", "egg"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_shrimp", name_th: "กุ้งเพิ่ม", name_en: "Extra shrimp", price: 20 },
        { id: "extra_egg", name_th: "ไข่เพิ่ม", name_en: "Extra egg", price: 10 },
      ],
    },
    {
      id: "pad_kra_pao",
      name_th: "ผัดกะเพราหมู",
      name_en: "Stir-fried Basil Pork",
      description_th: "หมูสับผัดใบกะเพรา พริกขี้หนู กระเทียม ไข่ดาว",
      description_en: "Minced pork stir-fried with holy basil, chili, garlic. Served with fried egg.",
      price: 50,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Kao_Rad_Pad_Kra-pao_-_Unithai_2023-07-08.jpg/960px-Kao_Rad_Pad_Kra-pao_-_Unithai_2023-07-08.jpg",
      category: "stir_fry",
      ingredients: ["pork", "holy basil", "chili", "garlic", "soy sauce", "oyster sauce", "egg"],
      ingredients_th: ["หมู", "ใบกะเพรา", "พริกขี้หนู", "กระเทียม", "ซอสถั่วเหลือง", "น้ำมันหอย", "ไข่"],
      spice_level: 4,
      allergens: ["soy", "egg"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_egg", name_th: "ไข่ด้าวเพิ่ม", name_en: "Extra fried egg", price: 10 },
        { id: "extra_meat", name_th: "หมูเพิ่ม", name_en: "Extra pork", price: 15 },
        { id: "no_spicy", name_th: "ไม่เผ็ด", name_en: "No spicy", price: 0 },
      ],
    },
    {
      id: "som_tum",
      name_th: "ส้มตำ",
      name_en: "Green Papaya Salad",
      description_th: "ส้มตำรสเปรี้ยวหวานเผ็ด มะละกอดิบ ถั่ว กุ้งแห้ง มะเขือเทศ",
      description_en: "Spicy-sour-sweet green papaya salad with peanuts, dried shrimp, and tomato.",
      price: 45,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Som_tam_thai.JPG/960px-Som_tam_thai.JPG",
      category: "appetizer",
      ingredients: ["green papaya", "peanuts", "dried shrimp", "tomato", "lime", "chili", "palm sugar", "fish sauce"],
      ingredients_th: ["มะละกอดิบ", "ถั่วลิสง", "กุ้งแห้ง", "มะเขือเทศ", "มะนาว", "พริก", "น้ำตาลปี๊บ", "น้ำปลา"],
      spice_level: 3,
      allergens: ["shellfish", "peanuts", "fish"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_shrimp", name_th: "กุ้งเพิ่ม", name_en: "Extra dried shrimp", price: 10 },
        { id: "no_spicy", name_th: "ไม่เผ็ด", name_en: "No spicy", price: 0 },
        { id: "no_peanuts", name_th: "ไม่ใส่ถั่ว", name_en: "No peanuts", price: 0 },
      ],
    },
    {
      id: "massaman",
      name_th: "แกงมัสมั่นไก่",
      name_en: "Massaman Curry Chicken",
      description_th: "แกงมัสมั่นรสเข้มข้น ไก่ มันฝรั่ง ถั่วลิสง หอมใหญ่",
      description_en: "Rich massaman curry with chicken, potato, peanuts, and onion.",
      price: 75,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Making_chicken_massaman_curry_%281%29.jpg/960px-Making_chicken_massaman_curry_%281%29.jpg",
      category: "curry",
      ingredients: ["chicken", "coconut milk", "massaman paste", "potato", "peanuts", "onion", "tamarind"],
      ingredients_th: ["ไก่", "กะทิ", "พริกแกงมัสมั่น", "มันฝรั่ง", "ถั่วลิสง", "หอมใหญ่", "มะขาม"],
      spice_level: 2,
      allergens: ["peanuts", "coconut"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_meat", name_th: "ไก่เพิ่ม", name_en: "Extra chicken", price: 20 },
        { id: "extra_potato", name_th: "มันฝรั่งเพิ่ม", name_en: "Extra potato", price: 10 },
      ],
    },
    {
      id: "khao_mok",
      name_th: "ข้าวมันไก่",
      name_en: "Chicken Biryani (Khao Mok Gai)",
      description_th: "ข้าวหุงกับเครื่องเทศรสเข้ม เสิร์ฟพร้อมไก่ทอด ซอสพริก",
      description_en: "Turmeric-spiced rice served with fried chicken and sweet chili sauce.",
      price: 55,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Khao_mok_kai.JPG/960px-Khao_mok_kai.JPG",
      category: "rice",
      ingredients: ["chicken", "rice", "turmeric", "cinnamon", "cardamom", "onion", "ginger"],
      ingredients_th: ["ไก่", "ข้าว", "ขมิ้น", "อบเชย", "กระวาน", "หอมใหญ่", "ขิง"],
      spice_level: 1,
      allergens: [],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_chicken", name_th: "ไก่เพิ่ม", name_en: "Extra chicken", price: 20 },
        { id: "extra_egg", name_th: "ไข่เพิ่ม", name_en: "Extra egg", price: 10 },
      ],
    },
    {
      id: "satay",
      name_th: "หมูสะเต๊ะ",
      name_en: "Pork Satay",
      description_th: "หมูย่างเสียบไม้ ราดซอสถั่วลิสง แตงกวา หอมแดง",
      description_en: "Grilled pork skewers with peanut sauce, cucumber relish, and shallots.",
      price: 50,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Pork_satay_2022.jpg/960px-Pork_satay_2022.jpg",
      category: "appetizer",
      ingredients: ["pork", "coconut milk", "turmeric", "peanuts", "cucumber", "shallots", "sugar"],
      ingredients_th: ["หมู", "กะทิ", "ขมิ้น", "ถั่วลิสง", "แตงกวา", "หอมแดง", "น้ำตาล"],
      spice_level: 1,
      allergens: ["peanuts", "coconut"],
      is_vegetarian: false,
      is_vegan: false,
      addons: [
        { id: "special", name_th: "พิเศษ", name_en: "Special (large)", price: 10 },
        { id: "extra_pork", name_th: "หมูเพิ่ม", name_en: "Extra pork", price: 15 },
        { id: "extra_sauce", name_th: "ซอสเพิ่ม", name_en: "Extra peanut sauce", price: 5 },
      ],
    },
    {
      id: "mango_sticky_rice",
      name_th: "ข้าวเหนียวมะม่วง",
      name_en: "Mango Sticky Rice",
      description_th: "ข้าวเหนียวมูนกะทิ เสิร์ฟพร้อมมะม่วงสุก ราดซอสกะทิ",
      description_en: "Sweet coconut sticky rice served with ripe mango and coconut cream.",
      price: 55,
      image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Mango_sticky_rice_served_in_Thailand.jpg/960px-Mango_sticky_rice_served_in_Thailand.jpg",
      category: "dessert",
      ingredients: ["sticky rice", "coconut milk", "mango", "sugar", "salt"],
      ingredients_th: ["ข้าวเหนียว", "กะทิ", "มะม่วง", "น้ำตาล", "เกลือ"],
      spice_level: 0,
      allergens: ["coconut"],
      is_vegetarian: true,
      is_vegan: true,
      addons: [
        { id: "extra_mango", name_th: "มะม่วงเพิ่ม", name_en: "Extra mango", price: 15 },
        { id: "extra_coconut", name_th: "กะทิเพิ่ม", name_en: "Extra coconut cream", price: 10 },
      ],
    },
  ],
};

export default function App() {
  const [language, setLang] = useState<Language>(detectLanguage);
  const [menuData, setMenuData] = useState<MenuResponse>(FALLBACK_MENU);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addonsItem, setAddonsItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderSnapshot | null>(null);

  useEffect(() => {
    fetchMenu().then(setMenuData).catch(() => {
      // Use fallback menu if backend is not available
    });
  }, []);

  const handleAddToCart = useCallback((item: MenuItem) => {
    setAddonsItem(item);
  }, []);

  const handleAddonsConfirm = useCallback(
    (item: MenuItem, qty: number, addons: Addon[], note: string) => {
      setCart((prev) => [...prev, { menuItem: item, qty, addons, note }]);
      setAddonsItem(null);
    },
    []
  );

  const handleRemoveFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cartTotal = cart.reduce(
    (sum, ci) =>
      sum + (ci.menuItem.price + ci.addons.reduce((s, a) => s + a.price, 0)) * ci.qty,
    0
  );

  const handleConfirmOrder = useCallback(() => {
    setLastOrder({
      items: cart,
      total: cartTotal,
    });

    // Fire and forget — don't wait for backend
    submitOrder({
      table: menuData.restaurant.table_number,
      items: cart.map((ci) => ({
        name: ci.menuItem.name_th,
        qty: ci.qty,
        price: ci.menuItem.price + ci.addons.reduce((s, a) => s + a.price, 0),
        addons: ci.addons.map((a) => (language === "th" ? a.name_th : a.name_en)),
        note: ci.note,
      })),
      total: cartTotal,
      note: cart.map((ci) => ci.note).filter(Boolean).join("; "),
    }).catch(() => {});
    setShowCart(false);
    setShowSuccess(true);
    setCart([]);
  }, [cart, cartTotal, language, menuData.restaurant.table_number]);

  return (
    <div className="phone-shell relative bg-cream-100 text-ink">
      <Header language={language} onLanguageChange={setLang} />

      <main className="px-4 pt-3 pb-28">
        <MenuGrid
          items={menuData.items}
          categories={menuData.categories}
          language={language}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onAskAi={setSelectedItem}
          onAddToCart={handleAddToCart}
        />
      </main>

      {selectedItem && (
        <ChatPopup
          item={selectedItem}
          language={language}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {addonsItem && (
        <AddonsPopup
          item={addonsItem}
          language={language}
          onAdd={handleAddonsConfirm}
          onClose={() => setAddonsItem(null)}
        />
      )}

      <CartButton
        language={language}
        itemCount={cart.length}
        total={cartTotal}
        onClick={() => setShowCart(true)}
      />

      {showCart && (
        <CartDrawer
          language={language}
          cart={cart}
          onRemove={handleRemoveFromCart}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowCart(false)}
        />
      )}

      {showSuccess && (
        <OrderSuccess
          language={language}
          order={lastOrder}
          onBack={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
