const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  port: Number(process.env.SMTP_PORT) || 2525,
  auth: {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim()
  }
});

const sendMail = async (to, subject, html) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured — skipping email to', to);
    return null;
  }
  return transporter.sendMail({
    from: '"Fashion Boutique" <noreply@fashionboutique.com>',
    to,
    subject,
    html
  });
};

exports.sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4f46e5;">Welcome to Fashion Boutique, ${name}!</h2>
      <p>Your account has been created successfully. Start exploring personalized fashion picks today.</p>
      <p style="color: #777; font-size: 12px;">Happy shopping!</p>
    </div>
  `;
  return sendMail(email, 'Welcome to Fashion Boutique', html);
};

exports.sendOrderConfirmationEmail = async (customerEmail, orderDetails) => {
  const orderItemsMarkup = orderDetails.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title} (${item.variantSize} / ${item.variantColor})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px;">
      <h2 style="color: #111; text-align: center;">Your Order is Confirmed!</h2>
      <p>Dear ${orderDetails.customerName},</p>
      <p>Thank you for shopping with us! We are preparing your order for shipment.</p>
      <p><strong>Order ID:</strong> #${orderDetails.orderId}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 8px; text-align: left;">Product</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${orderItemsMarkup}</tbody>
      </table>
      <div style="text-align: right; margin-top: 15px;">
        <p><strong>Shipping:</strong> ₹${orderDetails.shippingPrice.toFixed(2)}</p>
        <p style="font-size: 18px; color: #b12704;"><strong>Grand Total:</strong> ₹${orderDetails.totalPrice.toFixed(2)}</p>
      </div>
    </div>
  `;

  return sendMail(customerEmail, `Order Confirmation - #${orderDetails.orderId}`, html);
};

exports.sendShippingUpdateEmail = async (customerEmail, orderId, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Order Update</h2>
      <p>Your order <strong>#${orderId}</strong> status is now: <strong>${status}</strong>.</p>
    </div>
  `;
  return sendMail(customerEmail, `Order ${status} - #${orderId}`, html);
};
