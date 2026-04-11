const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String },
  userId: { type: String, required: true },

  shippingInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    zipCode: { type: Number, required: true },
  },
  orderSummary: {
    subTotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  orderItems: [],
  paymentMethod: { type: String, required: true },

  shippingMethod: {
    shippingType: { type: String, required: true },
    // shippingDays: { type: String, required: true },
    shippingCharges: { type: Number, required: true },
  },
  orderStatus: { type: String, default: "pending" , enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  paymentStatus: { type: String, default: "unpaid" },
  stripeSessionId: { type: String },

  orderedOn: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
});

module.exports = mongoose.model("Order", OrderSchema);
