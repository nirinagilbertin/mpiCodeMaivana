// routes/dashboard.routes.js
import express from "express";
import DashboardController from "../controllers/dashboard.controller.js";

export default (models) => {
  const router = express.Router();
  const dashboardController = new DashboardController(models);

  // Toutes les routes dashboard sont réservées à l'admin (vérification interne dans chaque méthode)
  router.get("/overview", dashboardController.getOverview);
  router.get("/reports-by-category", dashboardController.getReportsByCategory);
  router.get("/reports-evolution", dashboardController.getReportsEvolution);
  router.get("/top-neighborhoods", dashboardController.getTopNeighborhoods);
  router.get("/critical-zones", dashboardController.getCriticalZones);
  router.get("/recent-activities", dashboardController.getRecentActivities);
  router.get("/report", dashboardController.generateReport);

  return router;
};