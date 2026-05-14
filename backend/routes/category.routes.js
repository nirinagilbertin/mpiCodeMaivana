// routes/category.routes.js
import express from "express";
import { body, param } from "express-validator";
import CategoryController from "../controllers/category.controller.js";

export default (models) => {
  const router = express.Router();
  const categoryController = new CategoryController(models);

  // Routes publiques
  router.get("/", categoryController.getAllCategories);
  router.get("/:id", param("id").isInt(), categoryController.getCategoryById);

  // Routes admin (création, modification, suppression)
  router.post(
    "/",
    body("name").notEmpty().withMessage("Le nom est requis"),
    body("icon").optional().isString(),
    body("color").optional().isString(),
    body("isActive").optional().isBoolean(),
    categoryController.createCategory
  );

  router.put(
    "/:id",
    param("id").isInt(),
    body("name").optional().isString(),
    body("icon").optional().isString(),
    body("color").optional().isString(),
    body("isActive").optional().isBoolean(),
    categoryController.updateCategory
  );

  router.delete("/:id", param("id").isInt(), categoryController.deleteCategory);

  return router;
};