// routes/report.routes.js
import express from "express";
import { body, param, query } from "express-validator";
import ReportController from "../controllers/report.controller.js";
import models from "../models/index.js";

const router = express.Router();

/**
 * Injection du modèle (à adapter selon votre structure)
 * En général, on passe les models au contrôleur dans l'index principal.
 * Ici on suppose que le contrôleur est déjà instancié avec les models.
 * Pour plus de clarté, on crée une fonction qui reçoit les models.
 */
export default (models) => {
  const reportController = new ReportController(models);

  // ---------- Routes publiques / citoyens ----------
  
  // Créer un signalement (citoyen authentifié)
  router.post(
    "/",
    body("title").notEmpty().withMessage("Le titre est requis"),
    body("description").notEmpty().withMessage("La description est requise"),
    body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Latitude invalide"),
    body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Longitude invalide"),
    body("categoryId").isInt().withMessage("Catégorie invalide"),
    body("urgency").optional().isIn(["low", "medium", "high", "critical"]),
    body("photoUrl").optional().isURL(),
    body("address").optional().isString(),
    reportController.createReport
  );

  // Liste des signalements (avec filtres) – citoyen ou admin
  router.get(
    "/",
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("status").optional().isIn(["pending", "validated", "in_progress", "resolved", "rejected"]),
    query("categoryId").optional().isInt(),
    query("urgency").optional().isIn(["low", "medium", "high", "critical"]),
    query("neighborhood").optional().isString(),
    query("startDate").optional().isISO8601(),
    query("endDate").optional().isISO8601(),
    reportController.getAllReports
  );

  // Carte publique : signalements validés ou en cours
  router.get(
    "/map",
    query("categoryId").optional().isInt(),
    query("urgency").optional().isIn(["low", "medium", "high", "critical"]),
    reportController.getReportsForMap
  );

  // Détail d'un signalement (vérification droits automatique)
  router.get(
    "/:id",
    param("id").isInt().withMessage("ID invalide"),
    reportController.getReportById
  );

  // ---------- Routes administrateur seulement ----------
  
  // Changer le statut d'un signalement (admin)
  router.put(
    "/:id/status",
    param("id").isInt(),
    body("status").isIn(["pending", "validated", "in_progress", "resolved", "rejected"]),
    body("adminComment").optional().isString(),
    reportController.updateReportStatus
  );

  // Modifier le niveau d'urgence (admin)
  router.put(
    "/:id/urgency",
    param("id").isInt(),
    body("urgency").isIn(["low", "medium", "high", "critical"]),
    reportController.updateReportUrgency
  );

  // Supprimer un signalement (admin)
  router.delete(
    "/:id",
    param("id").isInt(),
    reportController.deleteReport
  );

  // Statistiques dashboard admin
  router.get(
    "/admin/statistics",
    reportController.getStatistics
  );

  // Zones critiques détectées automatiquement
  router.get(
    "/admin/critical-zones",
    reportController.getCriticalZones
  );

  return router;
};