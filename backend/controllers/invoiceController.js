const PDFDocument = require('pdfkit');
const Order = require('../models/Order');

/**
 * Build PDF document for an order (used by order routes)
 */
exports.generateInvoice = (order) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.fillColor('#111111')
    .fontSize(22)
    .text('FASHION BOUTIQUE INVOICE', { align: 'center' });
  doc.moveDown(1);

  const customerName = order.user?.name || 'Customer';
  const customerEmail = order.user?.email || '';

  doc.fontSize(10)
    .text(`Invoice ID: ${order._id}`, { align: 'right' })
    .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' })
    .moveDown(1);

  doc.text(`Bill To: ${customerName}`)
    .text(`Email: ${customerEmail}`)
    .text(
      `Shipping: ${order.shippingAddress?.streetAddress || ''}, ${order.shippingAddress?.city || ''}`
    )
    .moveDown(2);

  const tableTop = 230;
  doc.font('Helvetica-Bold');
  doc.text('Item Description', 50, tableTop);
  doc.text('Qty', 350, tableTop, { width: 40, align: 'center' });
  doc.text('Price', 400, tableTop, { width: 70, align: 'right' });
  doc.text('Total', 480, tableTop, { width: 70, align: 'right' });
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
  doc.font('Helvetica');

  let currentY = tableTop + 25;
  order.items.forEach((item) => {
    const title = item.title || item.product?.title || 'Product';
    const lineTotal = item.price * item.quantity;
    doc.text(`${title} (${item.size} / ${item.color})`, 50, currentY, { width: 280 });
    doc.text(String(item.quantity), 350, currentY, { width: 40, align: 'center' });
    doc.text(`₹${item.price.toFixed(2)}`, 400, currentY, { width: 70, align: 'right' });
    doc.text(`₹${lineTotal.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });
    currentY += 25;
  });

  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
  currentY += 15;
  doc.font('Helvetica-Bold')
    .text('Grand Total:', 380, currentY, { width: 90, align: 'right' })
    .font('Helvetica')
    .text(`₹${(order.totalPrice || 0).toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });

  doc.fontSize(10).text(
    'Thank you for shopping with us!',
    50,
    currentY + 50,
    { align: 'center', width: 500 }
  );

  return doc;
};

/**
 * @desc    Generate and stream order invoice in PDF format
 * @route   GET /api/orders/:id/invoice
 * @access  Private (Customer or Admin)
 */
exports.generateOrderInvoicePdf = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title');

    if (!order) {
      return res.status(404).json({ message: "Invoiced order details not found." });
    }

    // Verify requesting client owns the invoice (or is an Admin)
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access Denied: Unauthorized invoice request." });
    }

    // 1. Initialize a PDFDocument
    const doc = new PDFDocument({ margin: 50 });

    // 2. Set response headers to trigger file download in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);

    // 3. Pipe document layout stream directly to Express response output
    doc.pipe(res);

    // --- Header ---
    doc.fillColor('#111111')
       .fontSize(22)
       .text('FASHION BOUTIQUE INVOICE', { align: 'center' });
    doc.moveDown(1);

    // --- Meta Details ---
    doc.fontSize(10)
       .text(`Invoice ID: ${order._id}`, { align: 'right' })
       .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'right' })
       .moveDown(1);

    doc.text(`Bill To: ${order.user.name}`)
       .text(`Email: ${order.user.email}`)
       .text(`Shipping Address: ${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}`)
       .moveDown(2);

    // --- Items Table Header ---
    const tableTop = 230;
    doc.font('Helvetica-Bold');
    doc.text('Item Description', 50, tableTop);
    doc.text('Qty', 350, tableTop, { width: 40, align: 'center' });
    doc.text('Price', 400, tableTop, { width: 70, align: 'right' });
    doc.text('Total', 480, tableTop, { width: 70, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    doc.font('Helvetica');

    // --- Items Table Loop ---
    let currentY = tableTop + 25;
    order.items.forEach(item => {
      const itemTitle = `${item.product.title} (${item.size} / ${item.color})`;
      const lineTotal = item.price * item.quantity;

      doc.text(itemTitle, 50, currentY, { width: 280 });
      doc.text(item.quantity.toString(), 350, currentY, { width: 40, align: 'center' });
      doc.text(`$${item.price.toFixed(2)}`, 400, currentY, { width: 70, align: 'right' });
      doc.text(`$${lineTotal.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });

      currentY += 25;
    });

    // --- Total Price Calculation ---
    doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    currentY += 15;

    doc.font('Helvetica-Bold')
       .text('Subtotal:', 380, currentY, { width: 90, align: 'right' })
       .font('Helvetica')
       .text(`$${order.subtotal.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });

    currentY += 15;
    doc.font('Helvetica-Bold')
       .text('Discount:', 380, currentY, { width: 90, align: 'right' })
       .font('Helvetica')
       .text(`-$${order.discount.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });

    currentY += 15;
    doc.font('Helvetica-Bold')
       .text('Final Invoice:', 380, currentY, { width: 90, align: 'right' })
       .font('Helvetica')
       .text(`$${order.totalPrice.toFixed(2)}`, 480, currentY, { width: 70, align: 'right' });

    // --- Footer ---
    doc.fontSize(10)
       .text('Thank you for shopping with us! Have a wonderful day!', 50, currentY + 50, { align: 'center', width: 500 });

    // 4. Finalize the PDF generation and close the output stream
    doc.end();

  } catch (error) {
    console.error("PDF Processing Failure Error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server encountered an error building PDF Invoice." });
    }
  }
};