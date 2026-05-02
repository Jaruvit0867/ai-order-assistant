import type { Language } from "../types";
import { t } from "../lib/i18n";

interface CartButtonProps {
  language: Language;
  itemCount: number;
  total: number;
  onClick: () => void;
}

export default function CartButton({ language, itemCount, total, onClick }: CartButtonProps) {
  const tr = t(language);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 safe-bottom pointer-events-none">
      <div className="px-4 pb-4">
        <button
          onClick={onClick}
          className="pointer-events-auto flex min-h-[58px] w-full items-center justify-center gap-3 rounded-full bg-warm-500 px-5 py-3 text-[15px] font-extrabold text-white orange-glow transition active:bg-warm-700 cursor-pointer slide-up"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span>{itemCount} {tr.items}</span>
          <span className="h-5 w-px bg-white/35" />
          <span>฿{total}</span>
        </button>
      </div>
    </div>
  );
}
