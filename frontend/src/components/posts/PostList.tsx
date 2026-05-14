import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "./PostCard";
import PostForm from "./PostForm";
import CommentSection from "./CommentSection";
import Spinner from "../ui/Spinner";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { Newspaper, Plus } from "lucide-react";

export default function PostList() {
  const { posts, loading, error, likePost } = usePosts();
  const [showForm, setShowForm] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState<number | null>(null);

  const handleLike = async (postId: number) => {
    await likePost(postId);
  };

  if (error) {
    return (
      <EmptyState
        title="Erreur de chargement"
        description="Impossible de charger les actualités pour le moment."
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Newspaper size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Fil d'actualité
            </h2>
            <p className="text-sm text-gray-500">
              Restez informé des événements à Fianarantsoa
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setShowForm(true)}
        >
          Publier
        </Button>
      </div>

      {/* Formulaire de création */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nouvelle publication"
        size="md"
      >
        <PostForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Liste des posts */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="Aucune actualité"
          description="Soyez le premier à partager une information avec la communauté."
        />
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <PostCard
                  post={post}
                  onLike={handleLike}
                  onComment={(id) => setCommentingPostId(id)}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Section commentaires */}
      <Modal
        isOpen={commentingPostId !== null}
        onClose={() => setCommentingPostId(null)}
        title="Commentaires"
        size="md"
      >
        {commentingPostId && (
          <CommentSection
            postId={commentingPostId}
            comments={
              posts.find((p) => p.id === commentingPostId)?.comments || []
            }
          />
        )}
      </Modal>
    </div>
  );
}