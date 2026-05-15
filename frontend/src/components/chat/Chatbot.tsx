import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import Suggestions from "./Suggestions";
import ChatInput from "./ChatInput";
import { askAssistant } from "@/services/gemini";
import { Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Bonjour, je suis votre assistant urbain. Posez-moi une question sur le trafic, l'eau, les marchés ou la sécurité à Fianarantsoa.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(message: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await askAssistant(message);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* HEADER */}
      <header className="border-b border-blue-100 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Bot size={18} />
          </div>

          <div>
            <h1 className="text-sm font-semibold text-slate-800">
              Fianara Pulse
            </h1>
            <p className="text-xs text-slate-500">
              Assistant Urbain Intelligent
            </p>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-2 py-4">
        <div className="mx-auto max-w-3xl space-y-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
            />
          ))}

          {/* typing indicator */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* SUGGESTIONS */}
      {messages.length < 3 && (
        <div className="border-t border-blue-100 bg-white">
          <Suggestions onSelect={handleSend} />
        </div>
      )}

      {/* INPUT FIXED */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}