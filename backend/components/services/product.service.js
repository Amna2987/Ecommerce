const { AppError } = require("../utils/errors");
const Products = require("../models/product.model");
const User = require("../models/user.model");

exports.getProductsService = async (query) => {
  let filter = {};
  let sorting = {};
  // console.log("query", query);

  let page = query.page ? query.page : 1;
  let limit = 6;
  let skip = (page - 1) * limit;

  if (query.sorting) {
    switch (query.sorting) {
      case "featured":
        sorting.isFeatured = -1;
        break;
      case "price-low":
        sorting.price = 1;
        break;
      case "price-high":
        sorting.price = -1;
        break;
      // case 'newest':
      //     sorting.isFeatured = -1
      //     break;
      case "rating":
        sorting.rating = -1;
        break;

      default:
        break;
    }
  }

  if (query.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  if (query.category) {
    if (Array.isArray(query.category)) {
      filter.category = { $in: query.category };
    } else {
      filter.category = query.category;
    }
  }

  if (query.minPrice) {
    filter.price = { $gte: Number(query.minPrice) };
  }
  if (query.maxPrice) {
    filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
  }
  const products = await Products.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sorting);
  const categories = await Products.distinct("category");
  const totalProducts = await Products.find(filter).countDocuments();
  const totalPage = Math.ceil(totalProducts / limit);
  const pagination = {
    hasMore: page >= totalPage,
    totalPage,
    totalProducts,
  };
  return { products, pagination, categories };
};

exports.getProductService = async (id) => {
   if(!id) {
    throw new AppError('id not found')
  } 
  const product = await Products.findOne({ _id: id })
  console.log('single pro', product);
  
  return product;
};

exports.wishListService = async (id, user) => {
  const { email } = user;
  if(!id && !user) {
    throw new AppError('id and user not found')
  }

  const currentUser = await User.findOne({ email: email });
  // console.log('curruent user', currentUser);

  const { wishList } = currentUser;

  const myWishList = wishList.push(id);
  await currentUser.save();
  // console.log('mywishlist', currentUser);

  const user1 = await User.findOne({ email }).populate("wishList");
  console.log(user1);

  return user1.wishList;
};

exports.delWishListItemService = async (id, user) => {
  const { email } = user;

  const currentUser = await User.findOne({ email: email });
  // console.log('curruent user2', currentUser);

  const { wishList } = currentUser;

  currentUser.wishList = currentUser.wishList.filter(
    (ele) => ele != id.toString()
  );
  await currentUser.save();
  // console.log('del', delWishItem);

  const user1 = await User.findOne({ email }).populate("wishList");
  // console.log('del 2', user1.wishList);

  return user1.wishList;
};

exports.clearWishListService = async (user) => {
  const { email } = user;
  const currentUser = await User.findOne({ email: email });

  currentUser.wishList = [];
  // console.log('empty', currentUser);
  currentUser.save();

  return currentUser;
};

exports.getMyWishList = async (user) => {
  const { email } = user;
  
  const myWishList = await User.findOne({ email }).populate("wishList");
  // console.log('my wl', myWishList);
  return myWishList.wishList;
};

exports.addReviewService = async (review,sub) => {
  const {content,rating} = review
  
  const findProduct = await Products.findOne({ _id:review.productId })
  // console.log('find product', findProduct);

  const submitReview = findProduct.reviews.push({review : content,user : sub,rating:rating})
  await findProduct.save()
  // console.log('find product 2', findProduct, submitReview);
  return submitReview
};

exports.getReviewsService = async (id) => {
  
  const productReviews = await Products.findOne({ _id:id }).populate('reviews.user')
  console.log('product rev ser', productReviews);

  return productReviews
};


