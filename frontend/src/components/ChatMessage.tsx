import type { ChatMessage as ChatMessageType } from "../types";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] font-medium leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? "bg-cream-200 text-ink rounded-br-md"
            : "bg-white text-ink rounded-bl-md shadow-sm border border-black/5"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
