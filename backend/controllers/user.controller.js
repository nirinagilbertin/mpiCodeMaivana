// controllers/user.controller.js
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

class UserController {
  constructor(models) {
    this.User = models.User;
    this.sequelize = models.sequelize;
  }

  /**
   * POST /api/users/register
   * Inscription d’un nouvel utilisateur (citoyen ou admin)
   * Le rôle par défaut est 'citizen'
   */
  register = async (req, res) => {
    const transaction = await this.sequelize.transaction();
    try {
      // Validation des champs (express-validator à appliquer dans les routes)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { email, password, fullName, phone, neighborhood, role } = req.body;

      // Vérifier si l’email existe déjà
      const existingUser = await this.User.findOne({
        where: { email },
        transaction,
      });
      if (existingUser) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          message: "Cet email est déjà utilisé",
        });
      }

      // Vérifier le téléphone s’il est fourni
      if (phone) {
        const existingPhone = await this.User.findOne({
          where: { phone },
          transaction,
        });
        if (existingPhone) {
          await transaction.rollback();
          return res.status(409).json({
            success: false,
            message: "Ce numéro de téléphone est déjà utilisé",
          });
        }
      }

      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Créer l’utilisateur
      const newUser = await this.User.create(
        {
          email,
          password: hashedPassword,
          fullName,
          phone: phone || null,
          role: role === "admin" ? "admin" : "citizen", // sécurisé : seul un super-admin pourrait créer un admin via une route protégée
          isActive: true,
          neighborhood: neighborhood || null,
        },
        { transaction }
      );

      await transaction.commit();

      // Retourner l’utilisateur sans le mot de passe
      const { password: pwd, ...userResponse } = newUser.toJSON();
      return res.status(201).json({
        success: true,
        message: "Utilisateur créé avec succès",
        data: userResponse,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur lors de l'inscription :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de l'inscription",
        error: error.message,
      });
    }
  };

  /**
   * POST /api/users/login
   * Connexion d’un utilisateur (citoyen ou admin)
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Rechercher l’utilisateur par email
      const user = await this.User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email ou mot de passe incorrect",
        });
      }

      // Vérifier si le compte est actif
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Votre compte a été désactivé. Contactez l'administrateur.",
        });
      }

      // Vérifier le mot de passe
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Email ou mot de passe incorrect",
        });
      }

      // Stocker les infos en session
      req.session.userId = user.id;
      req.session.userRole = user.role;

      const { password: pwd, ...userResponse } = user.toJSON();
      return res.status(200).json({
        success: true,
        message: "Connexion réussie",
        data: userResponse,
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur lors de la connexion",
        error: error.message,
      });
    }
  };

  /**
   * POST /api/users/logout
   * Déconnexion (destruction de session)
   */
  logout = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la déconnexion",
          });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({
          success: true,
          message: "Déconnexion réussie",
        });
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/users/profile
   * Récupérer le profil de l’utilisateur connecté
   */
  getProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      const user = await this.User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      // On peut ajouter des statistiques personnelles (ex: nombre de signalements)
      // Pour l’instant, retour simple
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/users/profile
   * Mettre à jour le profil (fullName, phone, neighborhood, avatarUrl)
   */
  updateProfile = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      const { fullName, phone, neighborhood, avatarUrl } = req.body;

      const user = await this.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      // Vérifier l’unicité du téléphone si modifié
      if (phone && phone !== user.phone) {
        const existingPhone = await this.User.findOne({
          where: {
            phone,
            id: { [Op.ne]: userId },
          },
        });
        if (existingPhone) {
          return res.status(409).json({
            success: false,
            message: "Ce numéro de téléphone est déjà utilisé",
          });
        }
      }

      await user.update({
        fullName: fullName || user.fullName,
        phone: phone || user.phone,
        neighborhood: neighborhood !== undefined ? neighborhood : user.neighborhood,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
      });

      const { password: pwd, ...userResponse } = user.toJSON();
      return res.status(200).json({
        success: true,
        message: "Profil mis à jour avec succès",
        data: userResponse,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/users/password
   * Changer le mot de passe
   */
  changePassword = async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }

      const { oldPassword, newPassword } = req.body;

      const user = await this.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Ancien mot de passe incorrect",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await user.update({ password: hashedPassword });

      return res.status(200).json({
        success: true,
        message: "Mot de passe changé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/users (admin seulement)
   * Récupérer tous les utilisateurs avec pagination et filtres
   */
  getAllUsers = async (req, res) => {
    try {
      // Vérification admin
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé. Droits administrateur requis.",
        });
      }

      const { page = 1, limit = 10, isActive, role, search } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = {};

      if (isActive !== undefined) whereClause.isActive = isActive === "true";
      if (role) whereClause.role = role;
      if (search) {
        whereClause[Op.or] = [
          { fullName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows } = await this.User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ["password"] },
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: {
          users: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            limit: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * GET /api/users/:id (admin seulement)
   * Récupérer un utilisateur par son ID
   */
  getUserById = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      const { id } = req.params;
      const user = await this.User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * PUT /api/users/:id/status (admin seulement)
   * Activer / désactiver un utilisateur (suspendre ou réactiver)
   */
  updateUserStatus = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      const { id } = req.params;
      const { isActive } = req.body; // true ou false

      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "Le champ 'isActive' doit être un booléen",
        });
      }

      const user = await this.User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      // Empêcher un admin de se désactiver lui-même
      if (parseInt(id) === req.session.userId && isActive === false) {
        return res.status(400).json({
          success: false,
          message: "Vous ne pouvez pas désactiver votre propre compte administrateur",
        });
      }

      await user.update({ isActive });

      return res.status(200).json({
        success: true,
        message: `Utilisateur ${isActive ? "activé" : "désactivé"} avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };

  /**
   * DELETE /api/users/:id (admin seulement)
   * Supprimer un utilisateur (soft delete ou hard delete ? Ici hard delete)
   */
  deleteUser = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé",
        });
      }

      const { id } = req.params;

      if (parseInt(id) === req.session.userId) {
        return res.status(400).json({
          success: false,
          message: "Vous ne pouvez pas supprimer votre propre compte",
        });
      }

      const user = await this.User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      await user.destroy();

      return res.status(200).json({
        success: true,
        message: "Utilisateur supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      return res.status(500).json({
        success: false,
        message: "Erreur serveur",
        error: error.message,
      });
    }
  };
}

export default UserController;