// controllers/notification.controller.js
import { Op } from "sequelize";
import { validationResult } from "express-validator";

class NotificationController {
  constructor(models) {
    this.Notification = models.Notification;
    this.sequelize = models.sequelize;
  }

  /**
   * GET /api/notifications
   * Récupérer les notifications de l'utilisateur connecté (paginer, filtrer par non lues)
   */
  getMyNotifications = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = { userId };

      if (unreadOnly === "true" || unreadOnly === true) {
        whereClause.isRead = false;
      }

      const { count, rows } = await this.Notification.findAndCountAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset,
      });

      return res.status(200).json({
        success: true,
        data: {
          notifications: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            limit: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Erreur récupération notifications :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/notifications/unread-count
   * Compter les notifications non lues de l'utilisateur
   */
  getUnreadCount = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const count = await this.Notification.count({
        where: { userId, isRead: false },
      });

      return res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      console.error("Erreur comptage notifications non lues :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/notifications/:id/read
   * Marquer une notification spécifique comme lue
   */
  markAsRead = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const { id } = req.params;
      const notification = await this.Notification.findOne({
        where: { id, userId },
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification non trouvée ou n'appartient pas à l'utilisateur",
        });
      }

      if (notification.isRead) {
        return res.status(200).json({
          success: true,
          message: "Notification déjà lue",
          data: notification,
        });
      }

      await notification.update({ isRead: true });

      return res.status(200).json({
        success: true,
        message: "Notification marquée comme lue",
        data: notification,
      });
    } catch (error) {
      console.error("Erreur mise à jour notification :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/notifications/read-all
   * Marquer toutes les notifications de l'utilisateur comme lues
   */
  markAllAsRead = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const [updatedCount] = await this.Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
      );

      return res.status(200).json({
        success: true,
        message: `${updatedCount} notification(s) marquée(s) comme lue(s)`,
        data: { updatedCount },
      });
    } catch (error) {
      console.error("Erreur mise à jour massive :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * DELETE /api/notifications/:id
   * Supprimer une notification (seulement la sienne)
   */
  deleteNotification = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const { id } = req.params;
      const notification = await this.Notification.findOne({
        where: { id, userId },
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification non trouvée ou n'appartient pas à l'utilisateur",
        });
      }

      await notification.destroy();

      return res.status(200).json({
        success: true,
        message: "Notification supprimée",
      });
    } catch (error) {
      console.error("Erreur suppression notification :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };
}

export default NotificationController;