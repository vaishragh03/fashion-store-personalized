const emailService = require('../services/emailService');

exports.sendOrderConfirmation = async (req, res) => {
  try {
    await emailService.sendOrderConfirmationEmail(
      req.body.email,
      req.body.orderDetails
    );

    res.json({ success: true, message: "Email sent" });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};