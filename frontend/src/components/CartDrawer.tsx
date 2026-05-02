import type { Language, CartItem } from "../types";
import { t } from "../lib/i18n";

interface CartDrawerProps {
  language: Language;
  cart: CartItem[];
  onRemove: (index: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CartDrawer({ language, cart, onRemove, onConfirm, onClose }: CartDrawerProps) {
  const tr = t(language);

  const total = cart.reduce(
    (sum, ci) =>
      sum + (ci.menuItem.price + ci.addons.reduce((s, a) => s + a.price, 0)) * ci.qty,
    0
  );

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center">
      <div className="absolute inset-0 bg-black/45 fade-in" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full max-w-[430px] flex-col rounded-t-[30px] bg-cream-100 shadow-2xl slide-up md:rounded-[30px] safe-bottom">
        <div className="flex justify-center pt-2 pb-1 md:hidden">
          <div className="h-1 w-9 rounded-full bg-cream-300" />
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition active:bg-cream-200"
              aria-label={tr.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-extrabold text-warm-600">{tr.cart}</h3>
          </div>
          <span className="rounded-full bg-warm-50 px-3 py-1 text-xs font-extrabold text-warm-600">
            {cart.length} {tr.items}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-xl font-extrabold text-ink">{tr.yourOrder}</h2>
            <span className="text-xs font-extrabold text-warm-500">{cart.length} {tr.items}</span>
          </div>

          {cart.length === 0 ? (
            <div className="soft-card rounded-3xl px-5 py-12 text-center">
              <p className="text-sm font-semibold text-sage">{tr.emptyCart}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((ci, idx) => {
                const addonTotal = ci.addons.reduce((s, a) => s + a.price, 0);
                const itemTotal = (ci.menuItem.price + addonTotal) * ci.qty;
                const details = [
                  ci.addons.map((a) => language === "th" ? a.name_th : a.name_en).join(", "),
                  ci.note,
                ].filter(Boolean).join(" • ");

                return (
                  <article key={idx} className="soft-card flex gap-3 rounded-3xl p-3">
                    <img
                      src={ci.menuItem.image_url}
                      alt={ci.menuItem.name_th}
                      className="h-20 w-20 shrink-0 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="truncate text-[15px] font-extrabold text-ink">
                            {ci.menuItem.name_th}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-[11px] font-medium text-sage">
                            {details || `x${ci.qty}`}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemove(idx)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-100 text-sage transition active:bg-red-50 active:text-red-600"
                          aria-label={tr.remove}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[15px] font-extrabold text-warm-500">฿{itemTotal}</span>
                        <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-extrabold text-ink">
                          x{ci.qty}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <>
              <section className="soft-card mt-6 rounded-3xl p-5">
                <h3 className="mb-4 text-xl font-extrabold text-ink">{tr.orderSummary}</h3>
                <div className="space-y-3 border-b border-black/5 pb-4 text-sm font-semibold">
                  <div className="flex justify-between text-sage">
                    <span>{tr.subtotal}</span>
                    <span>฿{total}</span>
                  </div>
                  <div className="flex justify-between text-sage">
                    <span>{tr.serviceFee}</span>
                    <span className="font-extrabold text-warm-500">{tr.free}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <span className="text-xl font-extrabold text-ink">{tr.total}</span>
                  <span className="text-2xl font-extrabold text-warm-500">฿{total}</span>
                </div>
              </section>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-black/5 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            onClick={onConfirm}
            className="flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full bg-warm-500 px-5 py-3 text-[16px] font-extrabold text-white orange-glow transition active:bg-warm-700 cursor-pointer"
          >
            {tr.confirmOrder}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6l6 6-6 6" />
            </svg>
          </button>
          </div>
        )}
      </div>
    </div>
  );
}
