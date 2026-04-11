const { AppError } = require("../utils/errors");
const Products = require("../models/product.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");

exports.addtocartService = async (user, id) => {
  const { sub } = user;

  let cart = await Cart.findOne({ user: sub });

  if (!cart) {
    cart = await Cart.create({
      user: sub,
      cartItems: [{ product: id, qty: 1 }],
    });
    return cart;
  } else {
    const existingItem = cart.cartItems.find(
      (ele) => ele.product.toString() == id.toString()
    );
    if (existingItem) {
      existingItem.qty = existingItem.qty + 1;
    } else {
      cart.cartItems.push({ product: id, qty: 1 });
    }
  }
  await cart.save();
  return cart;
};
exports.delcartitemService = async (id, user) => {
  const { sub } = user;

  const cart = await Cart.findOne({ user: sub });
  //   console.log("cart", cart);
  cart.cartItems = cart.cartItems.filter((item) => item.product != id);
  await cart.save();

  // console.log("car del", cart);

  return cart;
};
exports.increaseqtyService = async (id, user) => {
  const { sub } = user;

  const cart = await Cart.findOne({ user: sub });
  let item = cart.cartItems.find(
    (ele) => ele.product.toString() == id.toString()
  );
  item.qty = item.qty + 1;

  await cart.save();
  return cart;
};
exports.decreaseqtyService = async (id, user) => {
  const { sub } = user;

  const cart = await Cart.findOne({ user: sub });
  let item = cart.cartItems.find(
    (ele) => ele.product.toString() == id.toString()
  );
  item.qty = item.qty - 1;

  await cart.save();
  return cart;
};
exports.clearcartService = async (user) => {
  const { sub } = user;

  const cart = await Cart.findOne({ user: sub });
  console.log("carts", cart);

  cart.cartItems = [];
  cart.totalCartPrice = 0;
  cart.save();

  return cart;
};

exports.getCartService = async (user) => {
  // console.log("mycartsssubb", user);
   if(!user) {
      throw new AppError('user not found')
    }
  const { sub } = user;
  const getMyCart = await Cart.findOne({ user: sub });
  
  // console.log("mycart", getMyCart);
  await getMyCart.save();

  return getMyCart;
};
