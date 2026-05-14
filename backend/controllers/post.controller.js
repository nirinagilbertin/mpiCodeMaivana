// controllers/post.controller.js
import { Op } from "sequelize";
import { validationResult } from "express-validator";

class PostController {
  constructor(models) {
    this.Post = models.Post;
    this.Comment = models.Comment;
    this.Like = models.Like;
    this.User = models.User;
    this.Notification = models.Notification;
    this.sequelize = models.sequelize;
  }

  /**
   * POST /api/posts
   * Créer une publication (citoyen ou admin)
   * - Les admins peuvent créer des posts officiels (postType = 'official')
   * - Les citoyens peuvent créer info, alert, event (modération nécessaire)
   */
  createPost = async (req, res) => {
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

      const { content, postType, imageUrl, latitude, longitude } = req.body;
      const userRole = req.session.userRole;

      // Vérifier les droits pour le type 'official'
      let finalPostType = postType || "info";
      if (finalPostType === "official" && userRole !== "admin") {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Seul un administrateur peut publier des annonces officielles" });
      }

      // Si ce n'est pas un admin, la publication doit être modérée
      const isModerated = (userRole === "admin") ? true : false;

      const post = await this.Post.create({
        content,
        postType: finalPostType,
        imageUrl: imageUrl || null,
        latitude: latitude || null,
        longitude: longitude || null,
        isModerated,
        userId,
      }, { transaction });

      // Si c'est une alerte ou un post officiel, envoyer des notifications aux citoyens proches (optionnel, à implémenter avec géolocalisation)
      if (finalPostType === "alert" || finalPostType === "official") {
        // Exemple simplifié : notification à tous les admins (pour info)
        const admins = await this.User.findAll({ where: { role: "admin" }, transaction });
        const notifications = admins.map(admin => ({
          userId: admin.id,
          title: `Nouvelle publication ${finalPostType === "alert" ? "alerte" : "officielle"}`,
          message: content.substring(0, 100),
          type: "post_alert",
          referenceId: post.id,
        }));
        if (notifications.length) {
          await this.Notification.bulkCreate(notifications, { transaction });
        }
      }

      await transaction.commit();

      const postWithUser = await this.Post.findByPk(post.id, {
        include: [{ model: this.User, attributes: ["id", "fullName", "avatarUrl"] }]
      });

      return res.status(201).json({
        success: true,
        message: "Publication créée avec succès",
        data: postWithUser,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur création post :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * GET /api/posts
   * Récupérer le fil d'actualité (publications modérées + officielles)
   * - Si admin : voit toutes les publications (y compris non modérées)
   * - Si citoyen : voit seulement isModerated = true + ses propres posts non modérés
   * Filtres : postType, near (lat/lng/radius), pagination
   */
  getFeed = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      const { page = 1, limit = 10, postType, latitude, longitude, radius = 5 } = req.query;
      const offset = (page - 1) * limit;
      const whereClause = {};

      // Filtre par type
      if (postType) whereClause.postType = postType;

      // Gestion de la modération
      if (userRole !== "admin") {
        whereClause[Op.or] = [
          { isModerated: true },
          { userId: userId } // ses propres posts même non modérés
        ];
      }

      // Filtre géographique (optionnel)
      let locationFilter = {};
      if (latitude && longitude) {
        // Calcul de distance approximative (formule simplifiée, à adapter avec PostGIS ou requête brute)
        // On utilise une bounding box rapide
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusDeg = radius / 111; // 1 degré ≈ 111 km
        locationFilter = {
          latitude: { [Op.between]: [lat - radiusDeg, lat + radiusDeg] },
          longitude: { [Op.between]: [lng - radiusDeg, lng + radiusDeg] },
        };
      }

      const { count, rows } = await this.Post.findAndCountAll({
        where: { ...whereClause, ...locationFilter },
        include: [
          { model: this.User, attributes: ["id", "fullName", "avatarUrl"] },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset,
      });
      // --- NOUVEAU : Récupération des likes de l'utilisateur pour ces posts ---
    let userLikesMap = new Map();
    if (userId && rows.length > 0) {
      const postIds = rows.map(post => post.id);
      const likes = await this.Like.findAll({
        where: {
          userId: userId,
          postId: { [Op.in]: postIds }
        },
        attributes: ['postId']
      });
      likes.forEach(like => userLikesMap.set(like.postId, true));
    }

    // Enrichir chaque post avec le champ userLiked
    const postsWithLikeStatus = rows.map(post => {
      const plain = post.toJSON();
      plain.userLiked = userLikesMap.get(post.id) || false;
      return plain;
    });

      // Pour chaque post, récupérer le nombre de likes et de commentaires (déjà dans le modèle via likesCount/commentsCount, mais on peut rafraîchir)
      // Les compteurs sont maintenus par triggers ou hooks, on peut les utiliser directement.

      return res.status(200).json({
        success: true,
        data: { posts: rows, pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), limit: parseInt(limit) } }
      });
    } catch (error) {
      console.error("Erreur récupération feed :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * GET /api/posts/:id
   * Détail d'une publication (avec commentaires)
   */
  getPostById = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const userRole = req.session.userRole;

      const post = await this.Post.findByPk(id, {
        include: [
          { model: this.User, attributes: ["id", "fullName", "avatarUrl"] },
          {
            model: this.Comment,
            include: [{ model: this.User, attributes: ["id", "fullName", "avatarUrl"] }],
            order: [["createdAt", "ASC"]],
          }
        ]
      });
      if (!post) {
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }

      // Vérifier droits d'accès
      if (!post.isModerated && userRole !== "admin" && post.userId !== userId) {
        return res.status(403).json({ success: false, message: "Cette publication n'est pas encore modérée" });
      }

      return res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error("Erreur détail post :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * PUT /api/posts/:id/moderate (admin seulement)
   * Approuver ou rejeter une publication (changer isModerated)
   */
  moderatePost = async (req, res) => {
    try {
      if (req.session.userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs" });
      }
      const { id } = req.params;
      const { approved } = req.body; // boolean
      const post = await this.Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }
      if (post.isModerated === approved) {
        return res.status(400).json({ success: false, message: "Cette publication a déjà ce statut de modération" });
      }
      await post.update({ isModerated: approved });
      // Notifier l'auteur
      await this.Notification.create({
        userId: post.userId,
        title: approved ? "Publication approuvée" : "Publication rejetée",
        message: approved ? "Votre publication a été approuvée et est visible par tous." : "Votre publication n'a pas été approuvée par la modération.",
        type: "post_moderation",
        referenceId: post.id,
      });
      return res.status(200).json({ success: true, message: approved ? "Publication approuvée" : "Publication rejetée" });
    } catch (error) {
      console.error("Erreur modération post :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * DELETE /api/posts/:id
   * Supprimer une publication (admin ou auteur)
   */
  deletePost = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      const { id } = req.params;
      const post = await this.Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }
      if (post.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Vous n'avez pas le droit de supprimer cette publication" });
      }
      await post.destroy();
      return res.status(200).json({ success: true, message: "Publication supprimée" });
    } catch (error) {
      console.error("Erreur suppression post :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * POST /api/posts/:id/comments
   * Ajouter un commentaire
   */
  addComment = async (req, res) => {
    const transaction = await this.sequelize.transaction();
    try {
      const userId = req.session.userId;
      if (!userId) {
        await transaction.rollback();
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }
      const { id } = req.params;
      const { content } = req.body;
      if (!content) {
        await transaction.rollback();
        return res.status(400).json({ success: false, message: "Le commentaire ne peut pas être vide" });
      }
      const post = await this.Post.findByPk(id);
      if (!post) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }
      // Vérifier si le post est visible (modéré ou admin)
      const userRole = req.session.userRole;
      if (!post.isModerated && userRole !== "admin" && post.userId !== userId) {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas commenter cette publication" });
      }
      const comment = await this.Comment.create({
        content,
        userId,
        postId: id,
      }, { transaction });
      // Incrémenter le compteur de commentaires du post
      await post.increment("commentsCount", { transaction });
      // Notifier l'auteur du post (sauf si c'est lui-même)
      if (post.userId !== userId) {
        await this.Notification.create({
          userId: post.userId,
          title: "Nouveau commentaire",
          message: `${req.session.userFullName || "Un utilisateur"} a commenté votre publication.`,
          type: "comment",
          referenceId: post.id,
        }, { transaction });
      }
      await transaction.commit();
      const commentWithUser = await this.Comment.findByPk(comment.id, {
        include: [{ model: this.User, attributes: ["id", "fullName", "avatarUrl"] }]
      });
      return res.status(201).json({ success: true, message: "Commentaire ajouté", data: commentWithUser });
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur ajout commentaire :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * DELETE /api/posts/comments/:commentId
   * Supprimer un commentaire (admin ou auteur du commentaire)
   */
  deleteComment = async (req, res) => {
    try {
      const userId = req.session.userId;
      const userRole = req.session.userRole;
      const { commentId } = req.params;
      const comment = await this.Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ success: false, message: "Commentaire non trouvé" });
      }
      if (comment.userId !== userId && userRole !== "admin") {
        return res.status(403).json({ success: false, message: "Vous n'avez pas le droit de supprimer ce commentaire" });
      }
      const postId = comment.postId;
      await comment.destroy();
      // Décrémenter le compteur
      await this.Post.decrement("commentsCount", { where: { id: postId } });
      return res.status(200).json({ success: true, message: "Commentaire supprimé" });
    } catch (error) {
      console.error("Erreur suppression commentaire :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };

  /**
   * POST /api/posts/:id/like
   * Liker/Unlike une publication
   */
  toggleLike = async (req, res) => {
    const transaction = await this.sequelize.transaction();
    try {
      const userId = req.session.userId;
      if (!userId) {
        await transaction.rollback();
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }
      const { id } = req.params;
      const post = await this.Post.findByPk(id);
      if (!post) {
        await transaction.rollback();
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }
      // Vérifier visibilité
      const userRole = req.session.userRole;
      if (!post.isModerated && userRole !== "admin" && post.userId !== userId) {
        await transaction.rollback();
        return res.status(403).json({ success: false, message: "Vous ne pouvez pas interagir avec cette publication" });
      }
      const existingLike = await this.Like.findOne({ where: { userId, postId: id }, transaction });
      if (existingLike) {
        // Unlike
        await existingLike.destroy({ transaction });
        await post.decrement("likesCount", { transaction });
        await transaction.commit();
        return res.status(200).json({ success: true, message: "Like retiré", liked: false });
      } else {
        // Like
        await this.Like.create({ userId, postId: id, type: "like" }, { transaction });
        await post.increment("likesCount", { transaction });
        // Notifier l'auteur (sauf si c'est lui-même)
        if (post.userId !== userId) {
          await this.Notification.create({
            userId: post.userId,
            title: "Nouveau like",
            message: `${req.session.userFullName || "Un utilisateur"} a aimé votre publication.`,
            type: "like",
            referenceId: post.id,
          }, { transaction });
        }
        await transaction.commit();
        return res.status(200).json({ success: true, message: "Like ajouté", liked: true });
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Erreur toggle like :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  };

  /**
   * GET /api/posts/:id/likes
   * Lister les utilisateurs qui ont liké une publication (pagination)
   */
  getPostLikes = async (req, res) => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;
      const post = await this.Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ success: false, message: "Publication non trouvée" });
      }
      const { count, rows } = await this.Like.findAndCountAll({
        where: { postId: id },
        include: [{ model: this.User, attributes: ["id", "fullName", "avatarUrl"] }],
        limit: parseInt(limit),
        offset,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        data: { likes: rows.map(like => like.User), pagination: { total: count, page: parseInt(page), totalPages: Math.ceil(count / limit), limit: parseInt(limit) } }
      });
    } catch (error) {
      console.error("Erreur récupération likes :", error);
      return res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  };
}

export default PostController;