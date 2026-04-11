import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Share2, Truck, Shield, RefreshCw, Star, Loader } from 'lucide-react';
import api from '../api/axios'
import { ProductServices } from '../services/product.service';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { _id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState({})
  const [productImg, setProductImg] = useState('')
  const [review, setReview] = useState({
    content: '',
    productId: '',
    rating: ''
  })
  const [allReviews, setAllReviews] = useState([])




  const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
  console.log('total rating', totalRating);

  const revCal = totalRating / allReviews.length
  console.log('rev cal', revCal);


  const { getProductsByCategory, addToWishlist, removeFromWishlist, wishlistItems, data, relatedProducts, addReview, addToCart, increaseItemQuantity, decreaseItemQuantity, } = useContext(ProductContext)
  let isInWishlist = wishlistItems.some(ele => ele._id == product._id)

  const getReviews = async () => {
    try {
      const res = await ProductServices.getReview(product._id)
      console.log('res rev', res.data.data);
      setAllReviews(res.data.data.reviews)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {

    const getProduct = async () => {
      try {
        setLoading(true)
        const res = await ProductServices.getProduct(_id)
        console.log('single product', res.data.data);
        setProduct(res.data.data)
        setProductImg(res.data.data.image)
        const res1 = await ProductServices.getReview(_id)
        console.log('res rev', res1.data.data);
        setAllReviews(res1.data.data.reviews)
        // setAllReviews(res.data.data.reviews)
        let category = res.data.data.category
        getProductsByCategory(category)

      } catch (error) {
        console.log(error);

      }
      finally {
        setLoading(false)
      }
    }
    getProduct()
    // getReviews()
  }, [_id])

  const handleProductImg = (img, index) => {
    // console.log('img url', img);
    setProductImg(img.url)
    setSelectedImage(index)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setReview({ ...review, [name]: value, productId: product._id, })
    // setReview({ ...review, content: e.target.value, productId: product._id,rating:e.target.value })
    console.log('rev', review);

  }

  const handleReview = async (e) => {
    try {

      const res = await addReview(review)
      // console.log('revies', res);
      getReviews(product._id)
    } catch (error) {
      console.log(error);

    }
    setReview({
      content: '',
      productId: '',
      rating: ''
    })
  }

  const handleAddToCart = (id) => {
    addToCart(id);
  };

  const handleWishlistToggle = (id) => {

    const existing = wishlistItems.find((product, indx) => (
      product._id.toString() == id.toString()
    ))
    if (existing) {
      removeFromWishlist(id)
    }
    else {
      addToWishlist(id)
    }

  };


  return (
    <div className="animate-fade-in">
      <div className="max-width section-padding py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><a href="/" className="hover:text-black transition-colors">Home</a></li>
            <li>/</li>
            <li><a href="/shop" className="hover:text-black transition-colors">Shop</a></li>
            <li>/</li>
            <Link to={`/shop?category=${product.category}`}>
              <li>
                {product.category}
              </li>
            </Link>
            <li>/</li>
            <li className="text-black font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={productImg}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  // onClick={() => setSelectedImage(index)}
                  onClick={() => handleProductImg(img, index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-black' : 'border-transparent'
                    }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-4">
              <span className="text-gray-600 text-sm">{product.category}</span>
              <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex flex-col justify-center gap-2 mb-4">
                <div className="flex">
                  {Array(5).fill(1).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(revCal)
                          ? 'fill-yellow-400 text-yellow-400'
                          : i < revCal
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                {/* <span className="text-gray-600">
                  {revCal}/5 rating
                </span> */}
                <span className="text-gray-600">
                  brand: {product.brand}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${product.discountedPrice}</span>
                {product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price}
                  </span>
                )}
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                  Save ${(product.price - product.discountedPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* tags */}
            <div className='flex space-x-2 text-gray-500 mb-5'>
              tags:

              {
                product.tags?.map(tag => (

                  <span className='text-gray-500'>{tag},</span>
                ))
              }
            </div>

            {/* Features */}
            {/* <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <p>left in stock: {product.stock}</p>
              <div className="flex items-center gap-4">
                {/* <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => decreaseItemQuantity(product._id)}
                    // onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 w-16 text-center">{product.qty}</span>
                  <button
                    onClick={() => increaseItemQuantity(product._id)}
                    // onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div> */}
                <div className="flex gap-4">
                  <button className="flex-1 btn-primary flex items-center justify-center gap-3"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                  {/* <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-4 rounded-lg border ${isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'border-gray-300 hover:border-black'
                      } transition-all duration-300`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                  </button> */}
                  <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className="p-4 border-gray-300 hover:border-black bg-white rounded-lg border shadow-lg hover:bg-black hover:text-white transition-all duration-300 z-10"
                  // aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    {/* <Heart className='' /> */}
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">Over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">2-Year Warranty</p>
                <p className="text-xs text-gray-600">Full coverage</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-600">No questions asked</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {loading ?
              <div>
                <Loader />
              </div>
              :
              relatedProducts.length == 0 ?
                <p>no products found</p>
                :
                relatedProducts?.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
            }
          </div>
        </div>
        {/* Reviews */}
        <div className="mt-16 pt-16 border-t space-y-5  border-gray-200">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <p>{allReviews?.length} reviews</p>
          <div className='h-auto space-y-5'>
            {
              allReviews?.map(review => (

                <div className="w-full space-y-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
                  <p>{review.review}</p>
                  <p className='text-gray-500'>{review?.user?.username}</p>
                  <p className='text-gray-500 text-[13px]'>Date: {review.reviewedOn}</p>
                  <div className='flex'>
                    {[...Array(5)].map((_, i) => (

                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(review.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              ))
            }
          </div>
          <div className='flex space-x-5'>
            <input
              type="text"
              className="w-[80%] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="write review.."
              name='content'
              value={review.content}
              onChange={(e) => handleChange(e)}
            />
            <input
              type="number"
              className="w-[10%] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="rating"
              name='rating'
              max={5}
              min={1}
              value={review.rating}
              onChange={(e) => handleChange(e)}
            />
            <button onClick={handleReview} className='flex-1 btn-primary flex items-center justify-center gap-3'>Add</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;