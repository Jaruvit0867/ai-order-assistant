import { useState } from "react";
import type { MenuItem, Language, Addon } from "../types";
import { itemDescription, t } from "../lib/i18n";

interface AddonsPopupProps {
  item: MenuItem;
  language: Language;
  onAdd: (item: MenuItem, qty: number, addons: Addon[], note: string) => void;
  onClose: () => void;
}

export default function AddonsPopup({ item, language, onAdd, onClose }: AddonsPopupProps) {
  const tr = t(language);
  const [qty, setQty] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [note, setNote] = useState("");

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = (item.price + addonTotal) * qty;

  function toggleAddon(addon: Addon) {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  }

  function handleSubmit() {
    onAdd(item, qty, selectedAddons, note);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center md:items-center">
      <div
        className="absolute inset-0 bg-black/45 fade-in"
        onClick={onClose}
      />

      <div className="relative flex max-h-[92vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[30px] bg-cream-100 shadow-2xl slide-up md:rounded-[30px] safe-bottom">
        <div className="relative h-52 shrink-0 bg-cream-200">
          <img src={item.image_url} alt={item.name_th} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-cream-100" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition active:bg-white"
            aria-label={tr.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-4">
          <section className="soft-card rounded-3xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-extrabold leading-tight text-ink">{item.name_th}</h2>
                <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-relaxed text-sage">
                  {itemDescription(item, language)}
                </p>
              </div>
              <span className="shrink-0 text-xl font-extrabold text-warm-600">฿{item.price}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.spice_level > 0 && (
                <span className="rounded-full bg-warm-50 px-3 py-1 text-[11px] font-bold text-warm-700">
                  {tr.spiceLevel} {item.spice_level}/5
                </span>
              )}
              {item.is_vegetarian && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                  {item.is_vegan ? tr.vegan : tr.vegetarian}
                </span>
              )}
              {item.allergens.slice(0, 2).map((allergen) => (
                <span key={allergen} className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-bold text-sage">
                  {tr.contains} {allergen}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-6 space-y-4">
            <h3 className="text-lg font-extrabold text-ink">{tr.customizeOrder}</h3>

            <div className="soft-card flex items-center justify-between rounded-3xl px-4 py-3">
              <span className="text-sm font-bold text-ink">{tr.quantity}</span>
              <div className="flex items-center gap-3 rounded-full bg-cream-100 px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-sage transition active:bg-white"
                  aria-label={`${tr.quantity} -`}
                >
                  -
                </button>
                <span className="w-5 text-center text-sm font-extrabold text-ink">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-500 text-lg font-bold text-white transition active:bg-warm-700"
                  aria-label={`${tr.quantity} +`}
                >
                  +
                </button>
              </div>
            </div>

            {item.addons.length > 0 && (
              <div>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-sage">{tr.addons}</span>
                <div className="grid grid-cols-2 gap-2">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`min-h-[58px] rounded-2xl border px-3 py-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-warm-500 bg-warm-50 text-warm-700"
                          : "border-black/10 bg-white text-ink active:bg-cream-50"
                      }`}
                    >
                      <span className="block text-[13px] font-extrabold leading-snug">
                        {language === "th" ? addon.name_th : addon.name_en}
                      </span>
                      <span className={`mt-1 block text-[11px] font-bold ${isSelected ? "text-warm-600" : "text-sage"}`}>
                        {addon.price === 0 ? tr.free : `+${addon.price} ${tr.baht}`}
                      </span>
                    </button>
                  );
                })}
                </div>
              </div>
            )}

            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.08em] text-sage">{tr.specialNote}</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={tr.orderNote}
                className="min-h-[94px] w-full resize-none rounded-3xl border border-black/5 bg-white px-4 py-3 text-[14px] font-medium text-ink outline-none transition focus:border-warm-300 focus:ring-4 focus:ring-warm-100 placeholder:text-sage-light"
              />
            </label>
          </section>
        </div>

        <div className="border-t border-black/5 bg-white/95 px-4 py-4 backdrop-blur">
          <button
            onClick={handleSubmit}
            className="min-h-[56px] w-full rounded-full bg-warm-500 px-5 py-3 text-[15px] font-extrabold text-white orange-glow transition active:bg-warm-700 cursor-pointer"
          >
            {tr.addToCart} • ฿{total}
          </button>
        </div>
      </div>
    </div>
  );
}
