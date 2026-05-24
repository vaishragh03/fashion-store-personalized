const PDFDocument = require('pdfkit');

exports.generateInvoice = (order, res) => {
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);

  doc.pipe(res);

  doc.fontSize(20).text("FASHION STORE INVOICE", { align: "center" });
  doc.moveDown();

  order.items.forEach(item => {
    doc.fontSize(12).text(
      `${item.title} | Qty: ${item.quantity} | ₹${item.price}`
    );
  });

  doc.moveDown();
  doc.text(`TOTAL: ₹${order.totalPrice}`, { align: "right" });

  doc.end();
};