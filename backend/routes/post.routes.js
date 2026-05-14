// routes/post.routes.js
import express from "express";
import { body, param, query } from "express-validator";
import PostController from "../controllers/post.controller.js";

export default (models) => {
  const router = express.Router();
  const postController = new PostController(models);

  // Routes principales
  router.post(
    "/",
    body("content").notEmpty().withMessage("Le contenu est requis"),
    body("postType").optional().isIn(["info", "alert", "event", "official"]),
    body("imageUrl").optional().isURL(),
    body("latitude").optional().isFloat(),
    body("longitude").optional().isFloat(),
    postController.createPost
  );

  router.get("/", postController.getFeed);
  router.get("/:id", param("id").isInt(), postController.getPostById);
  router.delete("/:id", param("id").isInt(), postController.deletePost);
  router.put("/:id/moderate", param("id").isInt(), body("approved").isBoolean(), postController.moderatePost);

  // Commentaires
  router.post("/:id/comments", param("id").isInt(), body("content").notEmpty(), postController.addComment);
  router.delete("/comments/:commentId", param("commentId").isInt(), postController.deleteComment);

  // Likes
  router.post("/:id/like", param("id").isInt(), postController.toggleLike);
  router.get("/:id/likes", param("id").isInt(), postController.getPostLikes);

  return router;
};