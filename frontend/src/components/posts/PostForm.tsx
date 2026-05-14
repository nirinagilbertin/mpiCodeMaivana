import { useState, type FormEvent } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import Button from "../ui/Button";
import Select from "../ui/Select";
import { POST_TYPES } from "../../config/constants";
import AlertToast from "../ui/AlertToast";

interface PostFormProps {
  onSuccess?: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function PostForm({ onSuccess, onCancel }: PostFormProps) {
  const { createPost } = usePosts();

  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"info" | "alert" | "event" | "official">("info");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({ visible: false, message: "", type: "success" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setToast({ visible: true, message: "Veuillez écrire un message.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const result = await createPost(content.trim(), postType);

      if (result) {
        setContent("");
        setPostType("info");
        setToast({ visible: true, message: "Publication créée !", type: "success" });

        // 🔥 On attend que onSuccess finisse (re-fetch) avant de continuer
        await onSuccess?.();
      }
    } catch (err: any) {
      setToast({
        visible: true,
        message: err.message || "Erreur lors de la publication.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const postTypeOptions = Object.entries(POST_TYPES).map(([key, value]) => ({
    value: key,
    label: value.label,
  }));

  return (
    <>
      <AlertToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Type de publication"
          options={postTypeOptions}
          value={postType}
          onChange={(e) => setPostType(e.target.value as typeof postType)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            rows={4}
            placeholder="Partagez une information..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <button type="button" className="text-xs text-gray-400 flex gap-1">
              <ImageIcon size={12} /> Ajouter une image
            </button>
            <span className="text-xs text-gray-400">{content.length}/500</span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" variant="primary" loading={submitting} icon={<Send size={16} />}>
            Publier
          </Button>
        </div>
      </form>
    </>
  );
}