/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const reportController = require('../controllers/report.controller');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post("/createReport", reportController.createReport);
router.get("/getReports", reportController.getReports);
router.get("/getReport/:id", reportController.getReport);
router.put("/updateReport/:id", reportController.updateReport);
router.delete("/deleteReport/:id", reportController.deleteReport);
router.get("/getReportsByUser/:id", reportController.getReportsByUser);
router.get("/getReportsByPost/:id", reportController.getReportsByPost);
router.get("/getReportsByType/:reportType", reportController.getReportsByType);
router.put("/updateReportStatus/:id", reportController.updateReportStatus);

module.exports = router;