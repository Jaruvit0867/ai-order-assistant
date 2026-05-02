import { useState, useRef, useEffect, type FormEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  // Auto-focus on desktop (not mobile to avoid keyboard popup)
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        enterKeyHint="send"
        className="min-h-[52px] flex-1 rounded-2xl border border-black/5 bg-cream-100 px-4 text-[14px] font-medium text-ink placeholder:text-sage-light focus:outline-none focus:ring-4 focus:ring-warm-100 focus:border-warm-300 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="flex min-h-[52px] min-w-[52px] shrink-0 items-center justify-center rounded-2xl bg-warm-500 text-white transition-colors duration-100 active:bg-warm-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  );
}
