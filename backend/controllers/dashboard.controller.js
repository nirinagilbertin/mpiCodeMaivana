// controllers/dashboard.controller.js
import { Op } from "sequelize";
import { sequelize } from "../models/index.js"; // à adapter selon votre structure

class DashboardController {
  constructor(models) {
    this.Report = models.Report;
    this.User = models.User;
    this.Category = models.Category;
    this.Post = models.Post;
    this.Comment = models.Comment;
    this.Like = models.Like;
    this.Notification = models.Notification;
    this.sequelize = models.sequelize;
  }

  /**
   * GET /api/dashboard/overview
   * Vue globale : totaux, indicateurs clés
   */
  getOverview = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(now.setDate(now.getDate() - 7));

      // Totaux généraux
      const totalReports = await this.Report.count();
      const activeIncidents = await this.Report.count({
        where: { status: { [Op.in]: ["validated", "in_progress"] } }
      });
      const resolvedReports = await this.Report.count({ where: { status: "resolved" } });
      const urgentIncidents = await this.Report.count({
        where: { urgency: "critical", status: { [Op.ne]: "resolved" } }
      });

      // Évolution récente (7 derniers jours)
      const reportsLast7Days = await this.Report.count({
        where: { createdAt: { [Op.gte]: startOfWeek } }
      });
      const resolvedLast7Days = await this.Report.count({
        where: { status: "resolved", resolvedAt: { [Op.gte]: startOfWeek } }
      });
      const newUsersLast7Days = await this.User.count({
        where: { createdAt: { [Op.gte]: startOfWeek } }
      });

      // Nombre total d'utilisateurs actifs (comptes actifs)
      const totalActiveUsers = await this.User.count({ where: { isActive: true } });

      // Nombre total de publications modérées
      const totalPosts = await this.Post.count({ where: { isModerated: true } });
      const totalComments = await this.Comment.count();
      const totalLikes = await this.Like.count();

      return res.status(200).json({
        success: true,
        data: {
          reports: {
            total: totalReports,
            active: activeIncidents,
            resolved: resolvedReports,
            urgent: urgentIncidents,
            last7Days: reportsLast7Days,
            resolvedLast7Days,
          },
          users: {
            totalActive: totalActiveUsers,
            newLast7Days: newUsersLast7Days,
          },
          engagement: {
            posts: totalPosts,
            comments: totalComments,
            likes: totalLikes,
          },
        },
      });
    } catch (error) {
      console.error("Erreur dashboard overview :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * GET /api/dashboard/reports-by-category
   * Nombre de signalements par catégorie (avec détails)
   */
  getReportsByCategory = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const result = await this.Report.findAll({
        attributes: [
          "categoryId",
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"],
        ],
        include: [{ model: this.Category, attributes: ["id", "name", "icon", "color"] }],
        group: ["categoryId", "Category.id"],
        order: [[this.sequelize.fn("COUNT", this.sequelize.col("id")), "DESC"]],
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Erreur stats par catégorie :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/dashboard/reports-evolution
   * Évolution quotidienne des signalements (période paramétrable)
   * Query: ?days=30 (défaut 30)
   */
  getReportsEvolution = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const days = parseInt(req.query.days) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const evolution = await this.Report.findAll({
        attributes: [
          [this.sequelize.fn("DATE", this.sequelize.col("createdAt")), "date"],
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"],
        ],
        where: { createdAt: { [Op.gte]: startDate } },
        group: [this.sequelize.fn("DATE", this.sequelize.col("createdAt"))],
        order: [[this.sequelize.fn("DATE", this.sequelize.col("createdAt")), "ASC"]],
      });

      return res.status(200).json({ success: true, data: evolution });
    } catch (error) {
      console.error("Erreur évolution signalements :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/dashboard/top-neighborhoods
   * Quartiers les plus touchés (basé sur le champ address)
   */
  getTopNeighborhoods = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const top = await this.Report.findAll({
        attributes: [
          "address",
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"],
        ],
        where: { address: { [Op.ne]: null } },
        group: ["address"],
        order: [[this.sequelize.fn("COUNT", this.sequelize.col("id")), "DESC"]],
        limit: 10,
      });

      return res.status(200).json({ success: true, data: top });
    } catch (error) {
      console.error("Erreur top quartiers :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/dashboard/critical-zones
   * Détection avancée des zones critiques (clustering simplifié)
   * Seuil : 3 signalements non résolus par quartier
   */
  getCriticalZones = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      // Regrouper par adresse avec nombre de signalements actifs
      const zones = await this.Report.findAll({
        attributes: [
          "address",
          [this.sequelize.fn("COUNT", this.sequelize.col("id")), "reportCount"],
          [this.sequelize.fn("AVG", this.sequelize.literal(`
            CASE 
              WHEN urgency = 'low' THEN 1
              WHEN urgency = 'medium' THEN 2
              WHEN urgency = 'high' THEN 3
              WHEN urgency = 'critical' THEN 4
              ELSE 0
            END
          `)), "avgSeverity"],
        ],
        where: {
          address: { [Op.ne]: null },
          status: { [Op.ne]: "resolved" },
        },
        group: ["address"],
        having: this.sequelize.literal("COUNT(id) >= 3"),
        order: [[this.sequelize.literal("reportCount"), "DESC"]],
      });

      // Enrichir avec les coordonnées d'un point représentatif
      const enriched = await Promise.all(
        zones.map(async (zone) => {
          const sample = await this.Report.findOne({
            where: { address: zone.address },
            attributes: ["latitude", "longitude", "address"],
          });
          return {
            address: zone.address,
            reportCount: zone.dataValues.reportCount,
            avgSeverity: parseFloat(zone.dataValues.avgSeverity) || 0,
            latitude: sample?.latitude,
            longitude: sample?.longitude,
          };
        })
      );

      return res.status(200).json({ success: true, data: enriched });
    } catch (error) {
      console.error("Erreur zones critiques :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/dashboard/recent-activities
   * Dernières activités (signalements, publications, commentaires)
   * Paramètre ?limit=10
   */
  getRecentActivities = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const limit = parseInt(req.query.limit) || 10;

      // Récupérer les 5 derniers signalements
      const recentReports = await this.Report.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [{ model: this.User, attributes: ["fullName"] }, { model: this.Category, attributes: ["name"] }],
        attributes: ["id", "title", "status", "createdAt"],
      });

      // 5 dernières publications modérées
      const recentPosts = await this.Post.findAll({
        limit: 5,
        where: { isModerated: true },
        order: [["createdAt", "DESC"]],
        include: [{ model: this.User, attributes: ["fullName"] }],
        attributes: ["id", "content", "postType", "createdAt"],
      });

      // 5 derniers commentaires
      const recentComments = await this.Comment.findAll({
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [{ model: this.User, attributes: ["fullName"] }, { model: this.Post, attributes: ["id"] }],
        attributes: ["id", "content", "createdAt"],
      });

      return res.status(200).json({
        success: true,
        data: {
          reports: recentReports,
          posts: recentPosts,
          comments: recentComments,
        },
      });
    } catch (error) {
      console.error("Erreur activités récentes :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * GET /api/dashboard/report
   * Génération d'un rapport (quotidien, hebdomadaire, mensuel)
   * Query: ?period=week (day, week, month) & format=json (csv à implémenter si besoin)
   */
  generateReport = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }

      const { period = "week" } = req.query;
      let startDate = new Date();
      let endDate = new Date();
      let groupFormat = "%Y-%m-%d";

      switch (period) {
        case "day":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          groupFormat = "%Y-%m-%d %H:00:00";
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Statistiques générales sur la période
      const totalReports = await this.Report.count({
        where: { createdAt: { [Op.between]: [startDate, endDate] } },
      });
      const resolvedReports = await this.Report.count({
        where: { status: "resolved", resolvedAt: { [Op.between]: [startDate, endDate] } },
      });
      const newUsers = await this.User.count({
        where: { createdAt: { [Op.between]: [startDate, endDate] } },
      });
      const newPosts = await this.Post.count({
        where: { createdAt: { [Op.between]: [startDate, endDate] }, isModerated: true },
      });

      // Signalements par catégorie (période)
      const byCategory = await this.Report.findAll({
        attributes: ["categoryId", [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"]],
        include: [{ model: this.Category, attributes: ["name"] }],
        where: { createdAt: { [Op.between]: [startDate, endDate] } },
        group: ["categoryId", "Category.id"],
      });

      // Top 5 quartiers
      const topNeighborhoods = await this.Report.findAll({
        attributes: ["address", [this.sequelize.fn("COUNT", this.sequelize.col("id")), "count"]],
        where: { address: { [Op.ne]: null }, createdAt: { [Op.between]: [startDate, endDate] } },
        group: ["address"],
        order: [[this.sequelize.fn("COUNT", this.sequelize.col("id")), "DESC"]],
        limit: 5,
      });

      const reportData = {
        period,
        startDate,
        endDate,
        generatedAt: new Date(),
        summary: {
          totalReports,
          resolvedReports,
          resolutionRate: totalReports ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0,
          newUsers,
          newPosts,
        },
        byCategory,
        topNeighborhoods,
      };

      // Possibilité d'envoyer en CSV ou JSON, ici JSON par défaut
      return res.status(200).json({ success: true, data: reportData });
    } catch (error) {
      console.error("Erreur génération rapport :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };
}

export default DashboardController;