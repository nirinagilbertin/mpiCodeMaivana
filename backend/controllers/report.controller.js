// controllers/report.controller.js
import { Op } from "sequelize";
import { validationResult } from "express-validator";

class ReportController {
  constructor(models) {
    this.Report = models.Report;
    this.User = models.User;
    this.Category = models.Category;
    this.Notification = models.Notification;
    this.sequelize = models.sequelize;
  }

  /**
   * POST /api/reports
   * Créer un signalement (citoyen connecté)
   */
  createReport = async (req, res) => {
    const transaction = await this.sequelize.transaction();
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await transaction.rollback();
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const userId = req.session.userId;
      if (!userId) {
        await transaction.rollback();
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const { title, description, latitude, longitude, categoryId, urgency, photoUrl, address } = req.body;

      // Vérifier que la catégorie existe
      const category = await this.Category.findByPk(categoryId, { transaction });
      if (!category) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: "Catégorie invalide" });
      }

      // Créer le signalement avec statut "pending"
      const report = await this.Report.create({
        title,
        description,
        latitude,
        longitude,
        address: address || null,
        urgency: urgency || "medium",
        status: "pending",
        photoUrl: photoUrl || null,
        userId,
        categoryId,
      }, { transaction });

      // NOTIFICATION POUR ADMIN : si urgence critique ou catégorie sécurité
      if (urgency === "critical" || category.name === "Sécurité & urgence") {
        const admins = await this.User.findAll({ where: { role: "admin" }, transaction });
        const notifications = admins.map(admin => ({
          userId: admin.id,
          title: "Nouveau signalement urgent",
          message: `${report.title} - ${report.description.substring(0, 100)}`,
          type: "urgent_report",
          referenceId: report.id,
        }));
        if (notifications.length) {
          await this.Notification.bulkCreate(notifications, { transaction });
        }
      }

      await transaction.commit();

      const { userId: uid, ...reportResponse } = report.toJSON();
      return res.status(201).json({
        success: true,
        message: "Signalement créé avec succès",
        data: reportResponse,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur création signalement :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/reports
   * Liste des signalements (filtres + pagination)
   * - Admin : tous
   * - Citoyen : ses propres signalements + ceux validés ou en cours
   */
  getAllReports = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }

      const { page = 1, limit = 10, status, categoryId, urgency, neighborhood, startDate, endDate } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Filtres communs
      if (status) whereClause.status = status;
      if (categoryId) whereClause.categoryId = categoryId;
      if (urgency) whereClause.urgency = urgency;
      if (startDate && endDate) {
        whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      // Différenciation admin / citoyen
      if (userRole === "admin") {
        // Admin voit tout
      } else {
        // Citoyen : ses propres signalements + ceux validés ou en cours
        whereClause[Op.or] = [
          { userId: userId },
          { status: { [Op.in]: ["validated", "in_progress"] } }
        ];
      }

      // Filtre par quartier (neighborhood) : recherche dans l'adresse
      if (neighborhood) {
        whereClause.address = { [Op.like]: `%${neighborhood}%` };
      }

      const { count, rows } = await this.Report.findAndCountAll({
        where: whereClause,
        include: [
          { model: this.User, attributes: ["id", "fullName", "avatarUrl"] },
          { model: this.Category, attributes: ["id", "name", "icon", "color"] },
        ],
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: { reports: rows, pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), limit: parseInt(limit) } },
      });
    } catch (error) {
      console.error("Erreur récupération signalements :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * GET /api/reports/map
   * Signalements pour la carte (public) : status validated ou in_progress
   */
  getReportsForMap = async (req, res) => {
    try {
      const { categoryId, urgency } = req.query;
      const whereClause = { status: { [Op.in]: ["validated", "in_progress"] } };
      if (categoryId) whereClause.categoryId = categoryId;
      if (urgency) whereClause.urgency = urgency;

      const reports = await this.Report.findAll({
        where: whereClause,
        attributes: ["id", "title", "description", "latitude", "longitude", "urgency", "status", "photoUrl", "createdAt"],
        include: [{ model: this.Category, attributes: ["name", "icon", "color"] }],
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({ success: true, data: reports });
    } catch (error) {
      console.error("Erreur récupération carte :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/reports/:id
   * Détail d'un signalement (vérification droits)
   */
  getReportById = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      const { id } = req.params;

      const report = await this.Report.findByPk(id, {
        include: [
          { model: this.User, attributes: ["id", "fullName", "avatarUrl", "phone"] },
          { model: this.Category, attributes: ["id", "name", "icon", "color"] },
        ],
      });
      if (!report) {
        return res.status(404).json({ success: false, message: "Signalement non trouvé" });
      }

      // Vérifier droits : admin ou propriétaire ou signalement public (validé/in_progress)
      const isPublic = ["validated", "in_progress"].includes(report.status);
      if (userRole !== "admin" && report.userId !== userId && !isPublic) {
        return res.status(403).json({ success: false, message: "Accès non autorisé" });
      }

      return res.status(200).json({ success: true, data: report });
    } catch (error) {
      console.error("Erreur détail signalement :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * PUT /api/reports/:id/status
   * Changer le statut (admin)
   */
  updateReportStatus = async (req, res) => {
    const transaction = await this.sequelize.transaction();
    try {
      if (req.session.userRole !== "admin") {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const { id } = req.params;
      const { status, adminComment } = req.body;
      const validStatuses = ["pending", "validated", "in_progress", "resolved", "rejected"];
      if (!validStatuses.includes(status)) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: "Statut invalide" });
      }

      const report = await this.Report.findByPk(id, { transaction });
      if (!report) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: "Signalement non trouvé" });
      }

      const updateData = { status };
      if (adminComment !== undefined) updateData.adminComment = adminComment;
      if (status === "resolved") updateData.resolvedAt = new Date();

      await report.update(updateData, { transaction });

      // Notifier le citoyen auteur du changement de statut
      await this.Notification.create({
        userId: report.userId,
        title: `Statut de votre signalement mis à jour`,
        message: `Votre signalement "${report.title}" est maintenant ${status}.`,
        type: "report_status",
        referenceId: report.id,
      }, { transaction });

      await transaction.commit();
      return res.status(200).json({ success: true, message: "Statut mis à jour", data: { status } });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur mise à jour statut :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * PUT /api/reports/:id/urgency
   * Modifier le niveau d'urgence (admin)
   */
  updateReportUrgency = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }
      const { id } = req.params;
      const { urgency } = req.body;
      const validUrgencies = ["low", "medium", "high", "critical"];
      if (!validUrgencies.includes(urgency)) {
        return res.status(400).json({ success: false, message: "Urgence invalide" });
      }

      const report = await this.Report.findByPk(id);
      if (!report) return res.status(404).json({ success: false, message: "Signalement non trouvé" });

      await report.update({ urgency });
      return res.status(200).json({ success: true, message: "Niveau d'urgence mis à jour", data: { urgency } });
    } catch (error) {
      console.error("Erreur mise à jour urgence :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * DELETE /api/reports/:id
   * Supprimer un signalement (admin uniquement)
   */
  deleteReport = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }
      const { id } = req.params;
      const report = await this.Report.findByPk(id);
      if (!report) return res.status(404).json({ success: false, message: "Signalement non trouvé" });

      await report.destroy();
      return res.status(200).json({ success: true, message: "Signalement supprimé" });
    } catch (error) {
      console.error("Erreur suppression :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/reports/admin/statistics
   * Statistiques pour le dashboard admin
   */
  getStatistics = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      // Totaux généraux
      const totalReports = await this.Report.count();
      const activeIncidents = await this.Report.count({ where: { status: { [Op.in]: ["validated", "in_progress"] } } });
      const resolved = await this.Report.count({ where: { status: "resolved" } });
      const urgentIncidents = await this.Report.count({ where: { urgency: "critical", status: { [Op.ne]: "resolved" } } });

      // Par catégorie
      const byCategory = await this.Report.findAll({
        attributes: ["categoryId", [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"]],
        include: [{ model: this.Category, attributes: ["name", "icon", "color"] }],
        group: ["categoryId", "Category.id"],
      });

      // Évolution par jour (7 derniers jours)
      const evolution = await this.Report.findAll({
        attributes: [
          [this.sequelize.fn("DATE", this.sequelize.col("createdAt")), "date"],
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"],
        ],
        where: {
          createdAt: { [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) },
        },
        group: [this.sequelize.fn("DATE", this.sequelize.col("createdAt"))],
        order: [[this.sequelize.fn("DATE", this.sequelize.col("createdAt")), "ASC"]],
      });

      // Quartiers les plus touchés (basé sur le champ address)
      const topNeighborhoods = await this.Report.findAll({
        attributes: ["address", [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"]],
        where: { address: { [Op.ne]: null } },
        group: ["address"],
        order: [[this.sequelize.fn("COUNT", this.sequelize.col("id")), "DESC"]],
        limit: 5,
      });

      return res.status(200).json({
        success: true,
        data: {
          totalReports,
          activeIncidents,
          resolved,
          urgentIncidents,
          byCategory,
          evolution,
          topNeighborhoods,
        },
      });
    } catch (error) {
      console.error("Erreur statistiques :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/reports/admin/critical-zones
   * Détection automatique des zones critiques (clustering simple par adresse)
   */
  getCriticalZones = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      // Regrouper par adresse (quartier) avec count et moyenne d'urgence
      const zones = await this.Report.findAll({
        attributes: [
          "address",
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "reportCount"],
          [this.sequelize.fn("AVG", this.sequelize.col("urgency")), "avgUrgency"], // besoin de caster si enum, ici simplifié
        ],
        where: { address: { [Op.ne]: null }, status: { [Op.ne]: "resolved" } },
        group: ["address"],
        having: this.sequelize.literal("COUNT(id) >= 3"), // seuil de criticité
        order: [[this.sequelize.fn("COUNT", this.sequelize.col("id")), "DESC"]],
      });

      // Pour chaque zone, récupérer un point représentatif (premier signalement)
      const enrichedZones = await Promise.all(zones.map(async (zone) => {
        const sample = await this.Report.findOne({
          where: { address: zone.address },
          attributes: ["latitude", "longitude", "address"],
        });
        return {
          address: zone.address,
          reportCount: zone.dataValues.reportCount,
          latitude: sample?.latitude,
          longitude: sample?.longitude,
        };
      }));

      return res.status(200).json({ success: true, data: enrichedZones });
    } catch (error) {
      console.error("Erreur zones critiques :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };
}

export default ReportController;