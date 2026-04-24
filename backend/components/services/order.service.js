const { AppError } = require("../utils/errors");
const Order = require("../models/order.model");
const Stripe = require("stripe");
let nodemailer = require("nodemailer");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: "socialcircle87@gmail.com",
    // pass: "ekbk mkyo vhkr eypl",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
}); 

exports.orderDataService = async (data, sub) => {
  const { shippingMethod, cartTotal, cartItems, paymentMethod } = data;
  // console.log("shippping,total", data);

  const shippingAmount =
    shippingMethod === "standard" ? 2 : shippingMethod === "express" ? 4 : 6;
  const totalAmountCal = cartTotal + shippingAmount;
  // console.log("sA, tA", cartItems);
  let orderId = 'ORD-' + Date.now()

  const orderdata = await Order.create({
    orderId: orderId,
    userId: sub,
    shippingInfo: {
      name: data.name,
      email: data.email,
      address: data.address,
      city: data.city,
      province: data.province,
      zipCode: data.zipCode,
    },
    orderSummary: {
      subTotal: data.cartTotal,
      totalAmount: totalAmountCal,
    },
    orderItems: data.cartItems,
    paymentMethod: data.paymentMethod,
    shippingMethod: {
      shippingType: data.shippingMethod,
      shippingCharges: shippingAmount,
    },
  });

  //  await transporter.sendMail({
  //   to: data.email,
  //   subject: "Your order has been placed",
  //   html: `<h2>Your order has been placed. your order id is : ${orderId}</h2>`,
  // });

   try {
    await transporter.sendMail({
      to: data.email,
      subject: "Your order has been placed",
      html: `<h2>Your order has been placed. Your order ID is: ${orderId}</h2>`,
    });
  } catch (emailErr) {
    console.error("Email sending failed (non-fatal):", emailErr.message);
  }

  
  if (paymentMethod === "stripe") {
    let lineItems = [];
    lineItems = cartItems.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: { name: product.product.name },
          unit_amount: product.product.discountedPrice == 0 ? product.product.price * 100 : product.product.discountedPrice * 100,
        },
        quantity: product.qty,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${process.env.CLIENT_ORIGIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/payment-cancelled`,
    });

    orderdata.stripeSessionId = session.id 
    orderdata.save()
    // console.log("session", orderdata);
  
    return { url: session.url,orderdata };
  }

  return orderdata; 
};

exports.orderConfirmService = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // console.log('session ret', session);
  

  if (session.payment_status !== "paid") {
    return { message: "Payment not completed" }
  }

  const order = await Order.findOne({ stripeSessionId: sessionId });
  console.log('session order', order);
  
  order.paymentStatus = "PAID";

  // await transporter.sendMail({
  //   to: order.shippingInfo.email,
  //   subject: "Payment successful",
  //   html: '<h2>Payment successful</h2>',
  // });

   try {
   await transporter.sendMail({
    to: order.shippingInfo.email,
    subject: "Payment successful",
    html: '<h2>Payment successful</h2>',
  });
  } catch (emailErr) {
    console.error("Email sending failed (non-fatal):", emailErr.message);
  }
  
  await order.save();

  return order
};

exports.orderCodService = async(id) => {
if (!id) {
  throw new AppError('id not found')
}
const order = await Order.findOne({orderId:id})
return order
}

exports.getUserDataService = async (sub) => {
  const userData = await Order.find({ userId: sub });
  // console.log('user... find', userData);

  // const userData = await
  return userData;
};

exports.getOrderDetailService = async (id, sub) => {
  const userData = await Order.find({ orderId: id });
  const order = userData.find((ele) => ele.orderId.toString() == id.toString());
  // console.log("order", order);

  return order;
};
