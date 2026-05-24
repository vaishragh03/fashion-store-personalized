exports.orderConfirmationTemplate = (order) => {
  return `
    <div style="font-family: Arial;">
      <h2>Order Confirmed 🎉</h2>
      <p>Hi ${order.customerName}, your order is confirmed.</p>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p>Total: $${order.totalPrice}</p>
    </div>
  `;
};