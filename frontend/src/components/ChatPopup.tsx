import { useEffect, useRef } from "react";
import type { MenuItem, Language } from "../types";
import { t, itemDescription } from "../lib/i18n";
import { useChat } from "../hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface Props {
  item: MenuItem;
  language: Language;
  onClose: () => void;
}

export default function ChatPopup({ item, language, onClose }: Props) {
  const tr = t(language);
  const { messages, loading, error, sendMessage } = useChat(item.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center">
      <div
        className="absolute inset-0 bg-black/50 fade-in"
        onClick={onClose}
      />

      <div className="relative flex h-[92vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[30px] bg-cream-100 shadow-2xl slide-up md:h-[86vh] md:rounded-[30px]">
        <div className="flex justify-center pt-2 pb-0 md:hidden">
          <div className="h-1 w-9 rounded-full bg-cream-300" />
        </div>

        <div className="border-b border-black/5 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warm-500 text-white shadow-lg shadow-orange-500/25">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a5.25 5.25 0 00-4.5 7.95v1.3a1 1 0 001 1h7a1 1 0 001-1v-1.3A5.25 5.25 0 0012 3.75zM9 17h6m-5 3h4m-4.75-9.5h.01M12 10.5h.01m2.75 0h.01" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold leading-tight text-ink">{tr.askAi}</h2>
              <p className="truncate text-[12px] font-medium text-sage">{item.name_th}</p>
            </div>
            <button
              onClick={onClose}
              className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-full bg-cream-100 text-sage transition-colors active:bg-cream-200"
              aria-label={tr.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4 flex gap-3 rounded-3xl bg-cream-100 p-2">
          <img
            src={item.image_url}
            alt={item.name_th}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
          />
            <div className="min-w-0 flex-1 py-1">
            <h3 className="truncate text-[14px] font-extrabold leading-snug text-ink">
              {item.name_th}
            </h3>
            <p className="mt-1 line-clamp-2 text-[12px] font-medium leading-relaxed text-sage">
              {itemDescription(item, language)}
            </p>
          </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        >
          {messages.length === 0 && !loading && (
            <div className="space-y-3 pt-1">
              <p className="text-center text-[12px] font-bold text-sage">{tr.aboutDish}</p>
              <div className="flex flex-wrap justify-center gap-2 px-2">
                {tr.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="min-h-[36px] rounded-full border border-black/5 bg-white px-3 text-[12px] font-bold text-sage shadow-sm transition-colors active:border-warm-300 active:bg-warm-50 active:text-warm-600 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-black/5 bg-white px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-warm-500" />
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-warm-500" />
                  <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-warm-500" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-[11px] text-red-600 bg-red-50 py-2 px-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        <div className="border-t border-black/5 bg-white px-4 pt-3 pb-4 safe-bottom">
          <ChatInput
            onSend={sendMessage}
            disabled={loading}
            placeholder={tr.typeQuestion}
          />
        </div>
      </div>
    </div>
  );
}
