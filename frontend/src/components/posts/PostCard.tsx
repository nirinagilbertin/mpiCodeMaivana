import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  MapPin,
  Clock,
  BadgeCheck,
  Megaphone,
  Calendar,
  Info,
} from "lucide-react";
import type { PostWithRelations } from "../../types/post";
import { formatRelativeTime } from "../../utils/formatDate";
import Badge from "../ui/Badge";
import Card from "../ui/Card";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: PostWithRelations;
  // 🔥 FIX #4 : prop liked ajoutée
  liked: boolean;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
}

const postTypeConfig = {
  alert: {
    icon: Megaphone,
    color: "#EF4444",
    bgColor: "bg-red-50 border-red-200",
    label: "Alerte",
  },
  official: {
    icon: BadgeCheck,
    color: "#8B5CF6",
    bgColor: "bg-purple-50 border-purple-200",
    label: "Officiel",
  },
  event: {
    icon: Calendar,
    color: "#10B981",
    bgColor: "bg-green-50 border-green-200",
    label: "Événement",
  },
  info: {
    icon: Info,
    color: "#3B82F6",
    bgColor: "bg-blue-50 border-blue-200",
    label: "Info",
  },
};

export default function PostCard({ post, liked, onLike, onComment }: PostCardProps) {
  const config = postTypeConfig[post.postType as keyof typeof postTypeConfig] || postTypeConfig.info;
  const TypeIcon = config.icon;

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Bandeau type de post */}
      <div className={`px-4 py-2 border-b ${config.bgColor} flex items-center gap-2`}>
        <TypeIcon size={14} style={{ color: config.color }} />
        <span className="text-xs font-semibold" style={{ color: config.color }}>
          {config.label}
        </span>
        {post.isModerated && (
          <Badge color="#10B981" size="sm" variant="outline">
            Vérifié
          </Badge>
        )}
      </div>

      <div className="p-4">
        {/* Auteur */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {post.user?.fullName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {post.user?.fullName || "Utilisateur"}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={10} />
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Image */}
        {post.imageUrl && (
          <div className="mb-3 rounded-xl overflow-hidden">
            <img
              src={post.imageUrl}
              alt="Post"
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Localisation */}
        {post.latitude && post.longitude && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
            <MapPin size={12} />
            <span>
              {post.latitude.toFixed(4)}, {post.longitude.toFixed(4)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          <LikeButton
            liked={liked}  // 🔥 FIX #4 : valeur réelle du like
            count={post.likesCount}
            onClick={() => onLike?.(post.id)}
          />
          <button
            onClick={() => onComment?.(post.id)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={16} />
            <span>{post.commentsCount}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}