const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController.js');

router.get('/', notificationController.getAllNotifications);
router.post('/', notificationController.createNotification);

module.exports = router;
