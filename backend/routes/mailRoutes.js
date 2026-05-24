const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

router.post('/send-order-email', mailController.sendOrderConfirmation);

module.exports = router;