import type { MenuItem, Language } from "../types";
import { itemDescription, t } from "../lib/i18n";

interface MenuCardProps {
  item: MenuItem;
  language: Language;
  variant?: "featured" | "tile" | "row";
  onAskAi: (item: MenuItem) => void;
  onAdd: (item: MenuItem) => void;
}

const SPICE_DOT_COLORS = ["bg-sage-light", "bg-spice-1", "bg-spice-2", "bg-spice-3", "bg-spice-4", "bg-spice-5"];

function SpiceIndicator({ level }: { level: number }) {
  const color = SPICE_DOT_COLORS[Math.min(Math.max(level, 0), 5)];

  return (
    <div className="flex items-center gap-1" title={`Spice: ${level}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full ${i <= level ? color : "bg-cream-300"}`}
        />
      ))}
    </div>
  );
}

function AiButton({
  label,
  onClick,
  compact = false,
}: {
  label: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${
        compact ? "h-10 min-w-[52px] px-2" : "h-11 min-w-[58px] px-3"
      } flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white/94 text-warm-500 shadow-lg shadow-black/10 backdrop-blur transition active:bg-warm-50`}
      aria-label={label}
      title={label}
    >
      <svg className={compact ? "h-4 w-4" : "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a5.25 5.25 0 00-4.5 7.95v1.3a1 1 0 001 1h7a1 1 0 001-1v-1.3A5.25 5.25 0 0012 3.75zM9 17h6m-5 3h4m-4.75-9.5h.01M12 10.5h.01m2.75 0h.01" />
      </svg>
      <span className="text-[11px] font-extrabold leading-none">AI</span>
    </button>
  );
}

export default function MenuCard({ item, language, variant = "tile", onAskAi, onAdd }: MenuCardProps) {
  const tr = t(language);
  const description = itemDescription(item, language);

  if (variant === "featured") {
    return (
      <article className="soft-card overflow-hidden rounded-3xl">
        <div className="relative aspect-[16/9] bg-cream-200">
          <img
            src={item.image_url}
            alt={item.name_th}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-extrabold leading-snug text-ink">{item.name_th}</h3>
              <p className="mt-0.5 line-clamp-2 text-[13px] font-medium leading-relaxed text-sage">
                {description}
              </p>
            </div>
            <AiButton label={tr.askAi} onClick={() => onAskAi(item)} />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <span className="text-lg font-extrabold text-warm-500">฿{item.price}</span>
              <div className="mt-1">
                <SpiceIndicator level={item.spice_level} />
              </div>
            </div>
            <button
              onClick={() => onAdd(item)}
              className="min-h-[46px] rounded-2xl bg-warm-500 px-5 text-[14px] font-extrabold text-white orange-glow transition active:bg-warm-700"
            >
              {tr.addToCart}
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "row") {
    return (
      <article className="soft-card flex items-center gap-3 rounded-3xl p-3">
        <img
          src={item.image_url}
          alt={item.name_th}
          className="h-20 w-20 shrink-0 rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-extrabold leading-tight text-ink">{item.name_th}</h3>
              <p className="mt-1 line-clamp-1 text-[12px] font-medium text-sage">{description}</p>
            </div>
            <AiButton label={tr.askAi} onClick={() => onAskAi(item)} compact />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[15px] font-extrabold text-warm-500">฿{item.price}</span>
            <button
              onClick={() => onAdd(item)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-500 text-white shadow-lg shadow-orange-500/25 transition active:bg-warm-700"
              aria-label={tr.add}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="soft-card flex h-full min-h-[270px] flex-col overflow-hidden rounded-3xl transition active:scale-[0.99]">
      <div className="relative aspect-[1.15/1] overflow-hidden bg-cream-200">
        <img
          src={item.image_url}
          alt={item.name_th}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute right-2.5 top-2.5">
          <AiButton label={tr.askAi} onClick={() => onAskAi(item)} compact />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 min-h-[36px] text-[14px] font-extrabold leading-snug text-ink">
          {item.name_th}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[38px] text-[12px] font-medium leading-relaxed text-sage">
          {description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-[15px] font-extrabold text-warm-500">฿{item.price}</span>
          <button
            onClick={() => onAdd(item)}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-500 text-warm-500 transition active:bg-warm-50"
            aria-label={tr.add}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
