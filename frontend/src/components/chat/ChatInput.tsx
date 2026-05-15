import { useState } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border-t border-blue-100 bg-white px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        {/* INPUT WRAPPER */}
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={disabled}
            maxLength={200}
            className="
              w-full
              rounded-xl
              border border-blue-200
              bg-white
              px-4
              py-3
              pr-12
              text-sm text-slate-700
              placeholder-slate-400
              shadow-sm
              transition-all
              outline-none
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-slate-50
              disabled:text-slate-400
            "
          />

          {/* counter léger optionnel UX */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {input.length}/200
          </div>
        </div>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="
            flex h-11 w-11 items-center justify-center
            rounded-xl
            bg-blue-600
            text-white
            shadow-sm
            transition-all
            hover:bg-blue-700
            active:scale-95
            disabled:cursor-not-allowed
            disabled:bg-blue-300
            disabled:active:scale-100
          "
          aria-label="Envoyer le message"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}