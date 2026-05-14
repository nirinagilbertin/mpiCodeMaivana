import {
  Home,
  Map,
  FileText,
  Newspaper,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Send,
  Search,
  Filter,
  X,
  ArrowLeft,
  Circle,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";

export const ICONS = {
  // Navigation
  HOME: Home,
  MAP: Map,
  REPORT: FileText,
  POSTS: Newspaper,
  PROFILE: User,
  DASHBOARD: LayoutDashboard,
  SETTINGS: Settings,
  LOGOUT: LogOut,

  // Actions
  ADD: Plus,
  EDIT: Edit,
  DELETE: Trash2,
  SEND: Send,
  SEARCH: Search,
  FILTER: Filter,
  CLOSE: X,
  BACK: ArrowLeft,

  // Statuts
  PENDING: Clock,
  VALIDATED: CheckCircle,
  IN_PROGRESS: AlertTriangle,
  RESOLVED: CheckCircle,
  REJECTED: XCircle,

  // Réseaux sociaux
  LIKE: Heart,
  COMMENT: MessageCircle,
  SHARE: Share2,
} as const;