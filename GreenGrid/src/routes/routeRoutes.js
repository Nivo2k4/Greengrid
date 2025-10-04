const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

// GET all truck routes/schedules
router.get('/', routeController.getAllRoutes);

// POST a new truck schedule/route
router.post('/', routeController.addRoute);

module.exports = router;
