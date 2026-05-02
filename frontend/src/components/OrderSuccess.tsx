import type { CartItem, Language } from "../types";
import { t } from "../lib/i18n";

type OrderSnapshot = {
  items: CartItem[];
  total: number;
};

interface OrderSuccessProps {
  language: Language;
  order: OrderSnapshot | null;
  onBack: () => void;
}

export default function OrderSuccess({ language, order, onBack }: OrderSuccessProps) {
  const tr = t(language);
  const total = order?.total ?? 0;
  const coverUrl = order?.items[0]?.menuItem.image_url;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-cream-100">
      <div className="flex min-h-screen w-full max-w-[430px] flex-col overflow-y-auto bg-cream-100 px-4 py-5 safe-bottom">
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-warm-500 bg-warm-50">
              {coverUrl ? (
                <img src={coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-warm-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M4 8h16M4 16h16" />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-lg font-extrabold text-warm-600">{tr.brand}</h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5" />
            </svg>
          </div>
        </header>

        <section className="text-center">
          <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-warm-500 text-white orange-glow">
            <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[26px] font-extrabold leading-tight text-ink">{tr.orderSuccess}</h2>
          <p className="mt-2 text-sm font-medium text-sage">{tr.orderSent}</p>
        </section>

        {order && order.items.length > 0 && (
          <section className="soft-card mt-6 overflow-hidden rounded-3xl">
            <div className="border-b border-black/5 bg-white px-5 py-3">
              <h3 className="text-xl font-extrabold text-ink">{tr.orderSummary}</h3>
            </div>
            <div className="space-y-3 px-5 py-3">
              {order.items.map((ci, index) => {
                const addonTotal = ci.addons.reduce((sum, addon) => sum + addon.price, 0);
                const itemTotal = (ci.menuItem.price + addonTotal) * ci.qty;
                const details = [
                  ci.addons.map((a) => language === "th" ? a.name_th : a.name_en).join(", "),
                  ci.note,
                ].filter(Boolean).join(" • ");

                return (
                  <div key={`${ci.menuItem.id}-${index}`} className="flex items-center gap-3">
                    <img
                      src={ci.menuItem.image_url}
                      alt={ci.menuItem.name_th}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-extrabold text-ink">{ci.menuItem.name_th}</h4>
                      <p className="mt-0.5 truncate text-[11px] font-medium text-sage">
                        {details || `x${ci.qty}`}
                      </p>
                    </div>
                    <span className="text-sm font-extrabold text-ink">฿{itemTotal}</span>
                  </div>
                );
              })}
            </div>
            <div className="mx-5 border-t border-black/5 py-3">
              <div className="mb-2 flex justify-between text-sm font-semibold text-sage">
                <span>{tr.subtotal}</span>
                <span>฿{total}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-extrabold text-ink">{tr.total}</span>
                <span className="text-2xl font-extrabold text-warm-500">฿{total}</span>
              </div>
            </div>
          </section>
        )}

        <div className="mt-auto pt-4 pb-8">
          <button
            onClick={onBack}
            className="min-h-[56px] w-full rounded-full bg-warm-500 px-6 py-3 text-[17px] font-extrabold text-white orange-glow transition active:bg-warm-700 cursor-pointer"
          >
            {tr.backToMenu}
          </button>
        </div>
      </div>
    </div>
  );
}
