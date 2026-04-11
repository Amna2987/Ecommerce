const { success } = require("../utils/response.utils");
const productServices = require("../services/product.service");
const { AppError } = require("../utils/errors");

exports.getProductsController = async (req, res) => {
  // console.log("products", req.query);
  const query = { ...req.query };

  // console.log("query", query);
  const { products, pagination, categories } =
    await productServices.getProductsService(query);
  return success(
    res,
    "all products",
    { products, pagination, categories },
    {},
    201
  );
};

exports.getProductController = async (req, res) => {
  // console.log("products params", req.body);
  console.log("products users", req.user);

  const { id } = req.params;


  const product = await productServices.getProductService(id);
  return success(res, "single products", product, {}, 201);
};

exports.userWishListController = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  // console.log('w user', user);
  // console.log('w param', id);

  const wishList = await productServices.wishListService(id, user);
  return success(res, "added to wish list", wishList, {}, 201);
};

exports.delWishListItemController = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  // console.log("d param", id);
  const delWishItem = await productServices.delWishListItemService(id, user);
  return success(res, "item deleted", delWishItem, {}, 201);
};

exports.clearWishListController = async (req, res) => {
  const user = req.user;

  const clearWishList = await productServices.clearWishListService(user);
  // console.log("clear");
  return success(res, "clear wish list", clearWishList, {}, 201);
};

exports.getMyWishListController = async (req, res) => {
  const user = req.user;
  
  const getMyWishList = await productServices.getMyWishList(user);
  return success(res, "wish list", getMyWishList, {}, 201);
};

exports.addReviewController = async (req, res) => {
  // console.log('review', req.body);
  
  const {sub} = req.user;
  const review = req.body 
  
  const productReview = await productServices.addReviewService(review,sub)
  return success(res, "submit reviews", productReview, {}, 201);
};
exports.getReviewsController = async (req, res) => {
  // console.log('review id', req.body);
  
  const {id} = req.body;
  
  const productReview = await productServices.getReviewsService(id)
  return success(res, "product reviews", productReview, {}, 201);
};
