import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`w-full flex px-4 py-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-2xl items-start gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* AVATAR */}
        <div
          className={`
            flex h-9 w-9 items-center justify-center rounded-full
            shadow-sm
            ${
              isUser
                ? "bg-blue-600 text-white"
                : "bg-blue-50 text-blue-600 border border-blue-100"
            }
          `}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        {/* BUBBLE */}
        <div
          className={`
            rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
            transition-all
            ${
              isUser
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white text-slate-700 border border-blue-100 rounded-bl-md"
            }
          `}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}