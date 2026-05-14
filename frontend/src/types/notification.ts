export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  type?: "report_urgent" | "post_alert" | string;
  referenceId?: number;
  userId: number;
  createdAt?: string;
}