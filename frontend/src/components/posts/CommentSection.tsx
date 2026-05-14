import { useState, type FormEvent } from "react";
import { Send, User } from "lucide-react";
import type { Comment } from "../../types/comment";
// 🔥 FIX #1 & #3 : on n'appelle plus usePosts() ici.
// commentOnPost est reçu en prop depuis PostList (qui est le seul à appeler usePosts).
import { formatRelativeTime } from "../../utils/formatDate";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  // 🔥 Prop ajoutée
  onComment: (postId: number, content: string) => Promise<any>;
}

export default function CommentSection({
  postId,
  comments,
  onComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const result = await onComment(postId, newComment.trim());
      if (result) {
        setNewComment("");
      }
    } catch (err) {
      console.error("Erreur commentaire:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <EmptyState
          title="Aucun commentaire"
          description="Soyez le premier à réagir."
        />
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 rounded-xl bg-gray-50"
            >
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-gray-900">
                    Utilisateur
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire nouveau commentaire */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-gray-100">
        <input
          type="text"
          placeholder="Écrire un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-150"
          maxLength={300}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          loading={submitting}
          disabled={!newComment.trim()}
          icon={<Send size={14} />}
        >
          Envoyer
        </Button>
      </form>
    </div>
  );
}