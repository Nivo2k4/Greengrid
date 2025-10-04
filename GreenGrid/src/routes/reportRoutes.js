const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET all reports
router.get('/', reportController.getAllReports);

// POST a new emergency report
router.post('/', reportController.createReport);

module.exports = router;
