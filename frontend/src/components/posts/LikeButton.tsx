import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onClick: () => void;
}

export default function LikeButton({ liked, count, onClick }: LikeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm transition-colors group"
      style={{ color: liked ? "#EF4444" : "#6B7280" }}
    >
      <motion.div
        whileTap={{ scale: 1.3 }}
        transition={{ duration: 0.1 }}
        className="relative"
      >
        <Heart
          size={16}
          className={`transition-colors ${
            liked ? "fill-red-500 text-red-500" : "group-hover:text-red-400"
          }`}
        />
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 text-red-400"
            >
              <Heart size={16} className="fill-red-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <span>{count}</span>
    </button>
  );
}