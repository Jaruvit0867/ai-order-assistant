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

export default function App() {
  const [language, setLang] = useState<Language>(detectLanguage);
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
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
      setMenuData(null);
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
      table: menuData!.restaurant.table_number,
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
  }, [cart, cartTotal, language, menuData?.restaurant.table_number]);

  if (!menuData) {
    return (
      <div className="phone-shell relative bg-cream-100 text-ink">
        <Header language={language} onLanguageChange={setLang} />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-3 text-stone-400">
          <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm">{language === "th" ? "กำลังโหลดเมนู..." : "Loading menu..."}</p>
        </div>
      </div>
    );
  }

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
