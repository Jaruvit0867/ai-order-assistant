import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "../types";
import { sendChat } from "../lib/api";

export function useChat(menuItemId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionId = useRef(
    `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  );

  const sendMessage = useCallback(
    async (prompt: string) => {
      const userMsg: ChatMessage = { role: "user", content: prompt };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      try {
        const res = await sendChat({
          prompt,
          menu_item_id: menuItemId,
          session_id: sessionId.current,
        });
        setMessages(res.history);
      } catch (err) {
        setMessages((prev) => prev.slice(0, -1));
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
      } finally {
        setLoading(false);
      }
    },
    [menuItemId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    sessionId.current = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}
