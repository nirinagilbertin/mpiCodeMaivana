// controllers/category.controller.js
import { validationResult } from "express-validator";

class CategoryController {
  constructor(models) {
    this.Category = models.Category;
    this.Report = models.Report;
    this.sequelize = models.sequelize;
  }

  /**
   * GET /api/categories
   * Liste publique de toutes les catégories actives (pour les formulaires, filtres, etc.)
   */
  getAllCategories = async (req, res) => {
    try {
      const { includeInactive } = req.query;
      const whereClause = {};
      
      // Par défaut, on n'affiche que les actives, sauf si admin demande explicitement
      if (!includeInactive || req.session.userRole !== "admin") {
        whereClause.isActive = true;
      }

      const categories = await this.Category.findAll({
        where: whereClause,
        order: [["name", "ASC"]],
      });

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/categories/:id
   * Détail d'une catégorie (publique)
   */
  getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await this.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }
      // Vérifier si active ou si admin
      if (!category.isActive && req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Cette catégorie n'est pas accessible",
        });
      }
      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      console.error("Erreur récupération catégorie :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * POST /api/categories (admin seulement)
   * Créer une nouvelle catégorie
   */
  createCategory = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { name, icon, color, isActive } = req.body;

      // Vérifier si le nom existe déjà
      const existing = await this.Category.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Une catégorie avec ce nom existe déjà",
        });
      }

      const category = await this.Category.create({
        name,
        icon: icon || null,
        color: color || "#6c757d",
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        message: "Catégorie créée avec succès",
        data: category,
      });
    } catch (error) {
      console.error("Erreur création catégorie :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/categories/:id (admin seulement)
   * Mettre à jour une catégorie
   */
  updateCategory = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { name, icon, color, isActive } = req.body;

      const category = await this.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }

      // Vérifier unicité du nom si modifié
      if (name && name !== category.name) {
        const existing = await this.Category.findOne({ where: { name } });
        if (existing) {
          return res.status(409).json({
            success: false,
            message: "Une autre catégorie utilise déjà ce nom",
          });
        }
      }

      await category.update({
        name: name || category.name,
        icon: icon !== undefined ? icon : category.icon,
        color: color || category.color,
        isActive: isActive !== undefined ? isActive : category.isActive,
      });

      return res.status(200).json({
        success: true,
        message: "Catégorie mise à jour",
        data: category,
      });
    } catch (error) {
      console.error("Erreur mise à jour catégorie :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * DELETE /api/categories/:id (admin seulement)
   * Supprimer une catégorie (seulement si aucun signalement associé)
   */
  deleteCategory = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux administrateurs",
        });
      }

      const { id } = req.params;
      const category = await this.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Catégorie non trouvée",
        });
      }

      // Vérifier si des signalements utilisent cette catégorie
      const reportCount = await this.Report.count({ where: { categoryId: id } });
      if (reportCount > 0) {
        return res.status(400).json({
          success: false,
          message: `Impossible de supprimer cette catégorie : ${reportCount} signalement(s) y sont associés. Désactivez-la plutôt.`,
        });
      }

      await category.destroy();
      return res.status(200).json({
        success: true,
        message: "Catégorie supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur suppression catégorie :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };
}

export default CategoryController;