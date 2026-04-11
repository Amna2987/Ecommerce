const { AppError } = require("../utils/errors");
const Products = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

exports.getAdminDataService = async () => {
  const allProducts = await Products.find();
  const allOrders = await Order.find();
  const allUsers = await User.find();

  const adminData = {
    products: allProducts,
    orders: allOrders,
    users: allUsers,
  };
  //  throw new AppError("error");
  return adminData;
};
exports.getOrderByIdService = async (id) => {
  if (!id) {
    throw new AppError("id not found");
  }
  const order = await Order.findById({ _id: id });
  return order;
};
exports.updateOrderService = async (updateData) => {
  if (!updateData) {
    throw new AppError("id not found");
  }

  const { id, status } = updateData;
  const orderUpdate = await Order.findById({ _id: id.orderId });
  console.log("update orderssss", orderUpdate);

  // {...orderUpdate, }
  orderUpdate.orderStatus = status;
  await orderUpdate.save();

  console.log("update orderssss 2", orderUpdate);

  return orderUpdate;
};
exports.updateUserService = async (updateData) => {
  if (!updateData) {
    throw new AppError("no updates");
  }
  const { userId, status, role } = updateData;
  const userUpdate = await User.findById({ _id: userId });
  // console.log('update usersssss', userUpdate);

  userUpdate.status = status;
  userUpdate.role = role;
  await userUpdate.save();

  // console.log('update userssss 2', userUpdate);

  return userUpdate;
};
exports.delUserService = async (id) => {
  if (!id) {
    throw new AppError("id not found");
  }
  const delUser = await User.findByIdAndDelete({ _id: id });

  const userUpdate = await User.find();

  // console.log('del usersssss', userUpdate);
  // await userUpdate.save()

  // console.log('del userssss 2', userUpdate);

  return userUpdate;
};
exports.addProductService = async (productData, image, images) => {
  console.log("new", productData, image, images);

  if (!productData) {
    throw new AppError("data not found");
  }

  const newProduct = await Products.create({
    name: productData.name,
    description: productData.description,
    price: productData.price,
    discountedPrice: productData.discountedPrice,
    category: productData.category,
    brand: productData.brand,
    stock: productData.stock,
    image: image[0].path,
    images: [],
    rating: "",
    reviews: [],
    isFeatured: productData.isFeatured,
    tags: productData.tags,
  });

  let imagesArray = images.map((file) =>({
     url: file.path
  })  );
  newProduct.images = imagesArray;
  console.log("new product", newProduct);

  await newProduct.save()

  const allProducts = await Products.find()

  return allProducts;
};
