import { useMemo, useState } from "react";
import type { MenuItem, MenuCategory, Language } from "../types";
import { t, categoryName } from "../lib/i18n";
import MenuCard from "./MenuCard";

interface MenuGridProps {
  items: MenuItem[];
  categories: MenuCategory[];
  language: Language;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onAskAi: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuGrid({
  items,
  categories,
  language,
  activeCategory,
  onCategoryChange,
  onAskAi,
  onAddToCart,
}: MenuGridProps) {
  const tr = t(language);
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const inCategory = activeCategory === "all" || item.category === activeCategory;
        const inSearch =
          !normalizedQuery ||
          [
            item.name_th,
            item.name_en,
            item.description_th,
            item.description_en,
            item.category,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        return inCategory && inSearch;
      }),
    [activeCategory, items, normalizedQuery]
  );

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">{tr.searchPlaceholder}</span>
          <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-sage-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={tr.searchPlaceholder}
            className="h-14 w-full rounded-2xl border border-black/5 bg-white px-12 text-[15px] font-medium text-ink shadow-sm outline-none transition focus:border-warm-300 focus:ring-4 focus:ring-warm-100 placeholder:text-sage-light"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-cream-100 text-sage transition active:bg-cream-200"
              aria-label={tr.close}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </label>

        <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => onCategoryChange("all")}
              className={`min-h-[40px] shrink-0 rounded-full px-4 text-[13px] font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                activeCategory === "all"
                  ? "bg-warm-500 text-white orange-glow"
                  : "bg-white text-sage shadow-sm active:bg-cream-200"
              }`}
            >
              {tr.allDishes}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`min-h-[40px] shrink-0 rounded-full px-4 text-[13px] font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-warm-500 text-white orange-glow"
                    : "bg-white text-sage shadow-sm active:bg-cream-200"
                }`}
              >
                {categoryName(cat, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="soft-card rounded-3xl px-5 py-12 text-center">
          <p className="text-sm font-semibold text-sage">{tr.noMenuItems}</p>
        </div>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold text-ink">{tr.menu}</h2>
            <span className="text-[12px] font-extrabold text-warm-500">
              {filtered.length} {tr.items}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                language={language}
                variant="tile"
                onAskAi={onAskAi}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
