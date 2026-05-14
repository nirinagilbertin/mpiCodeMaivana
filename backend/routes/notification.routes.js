// routes/notification.routes.js
import express from "express";
import { param, query } from "express-validator";
import NotificationController from "../controllers/notification.controller.js";

export default (models) => {
  const router = express.Router();
  const notificationController = new NotificationController(models);

  // Routes utilisateur (connecté)
  router.get(
    "/",
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("unreadOnly").optional().isBoolean(),
    notificationController.getMyNotifications
  );

  router.get("/unread-count", notificationController.getUnreadCount);

  router.put("/read-all", notificationController.markAllAsRead);

  router.put(
    "/:id/read",
    param("id").isInt(),
    notificationController.markAsRead
  );

  router.delete(
    "/:id",
    param("id").isInt(),
    notificationController.deleteNotification
  );

  return router;
};