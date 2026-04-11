import React, { useContext, useState } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { ProductServices } from '../services/product.service';
import { ProductContext } from '../context/ProductContext';
import Loader from '../components/Loader';
import { useSearchParams } from 'react-router-dom';

const Shop = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loader, setLoader] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState([])
  const [minPrice, setminPrice] = useState('')
  const [maxPrice, setmaxPrice] = useState('')
  const [sorting, setSorting] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, sethasMore] = useState(true)
  const [totalPage, setTotalPage] = useState(1)
  const [activeBtn, setActiveBtn] = useState(page)


  const { getProducts, data, allProducts, categories, setCategories, totalProducts, setTotalProducts, pageno, setpageno } = useContext(ProductContext)
  const [searchParams, setSearchParams] = useSearchParams()


  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
  ];
  // console.log('shop res', data);

  // URL TO STATE
  useEffect(() => {
    const urlCategories = searchParams.getAll('category')
    const urlSort = searchParams.get('sorting') || 'newest'
    const urlPage = Number(searchParams.get('page')) || 1
    const urlMinPrice = Number(searchParams.get('minPrice')) || 1
    const urlMaxPrice = Number(searchParams.get('maxPrice')) || 1000

    setCategory(urlCategories)
    setSorting(urlSort)
    setPage(urlPage)
    setminPrice(urlMinPrice)
    setmaxPrice(urlMaxPrice)

  }, [])


  // ===== STATE → URL =====
  useEffect(() => {
    const params = new URLSearchParams();


    category.forEach((cat) => {
      params.append("category", cat);
    });

    if (sorting) params.set("sorting", sorting);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page);

    params.set("minPrice", minPrice);
    params.set("maxPrice", maxPrice);
    setSearchParams(params);

  }, [category, sorting, page, minPrice, maxPrice, search, setSearchParams]);

  const toggleCategory = (category) => {
    // console.log('cate', category);

    // if (category === 'All Categories') {
    //   setCategory([])
    // }
    // else {

    setCategory((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    // }
    setPage(1);
  };


  useEffect(() => {

    try {
      setLoader(true)
      // const query = getFilterProducts()
      // console.log('query', query);

      getProducts(searchParams.toString())
      // console.log('product data', data);
      // sethasMore(data?.pagination.hasMore)
    } catch (error) {
      console.log('no products', error);
    }
    finally {
      setLoader(false)
    }

  }, [searchParams])



  // ===== FETCH PRODUCTS (SIMULATION) =====
  useEffect(() => {
    // This is where your API call goes
    // fetch(/api/products?${searchParams.toString()})
    console.log("Fetching:", searchParams.toString());
  }, [searchParams]);


  const handleClick = (num) => {
    setPage(num)
    setActiveBtn(num)
  }
  const handleNext = () => {
    if (page >= pageno) {
      setPage(1)
      setActiveBtn(1)
    }
    else {

      setPage(page + 1)
      setActiveBtn(page + 1)
      // setBtnActive(page + 1)
    }
  }
  const handlePrevious = () => {
    console.log('btn working');

    setPage(page - 1)
    setActiveBtn(page - 1)
    if (page <= 1) {
      setPage(1)
      setActiveBtn(1)
    }
  }


  return (
    <div className="animate-fade-in">
      {/* Shop Header */}
      <div className="bg-gray-50 py-12">
        <div className="max-width section-padding">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-gray-600">Discover our curated collection</p>
        </div>
      </div>

      <div className="max-width section-padding py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside className="w-full lg:w-1/4">
  <div className="lg:sticky lg:top-24">

    {/* Mobile Filter Toggle */}
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="lg:hidden w-full flex items-center justify-between p-4 bg-black text-white mb-4 rounded-lg"
    >
      <span className="flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Filters
      </span>
      <ChevronDown
        className={`w-5 h-5 transition-transform ${
          showFilters ? 'rotate-180' : ''
        }`}
      />
    </button>

    {/* Filters */}
    <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg border border-gray-200 space-y-6"
      >

        {/* Search */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Search</h3>
          <input
            type="text"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            placeholder="Search product"
            className="w-full p-2 bg-gray-200 rounded-lg"
          />
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Categories</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((ele, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={category.includes(ele)}
                  onChange={() => toggleCategory(ele)}
                  className="w-4 h-4 text-black rounded border-gray-300"
                />
                <span className="text-gray-700">{ele}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Price Range</h3>
          <div className="space-y-3">
            <input
              type="number"
              name="minPrice"
              onChange={(e) => setminPrice(e.target.value)}
              value={minPrice}
              placeholder="Min Price"
              className="w-full p-2 bg-gray-200 rounded-lg"
            />

            <input
              type="number"
              name="maxPrice"
              onChange={(e) => setmaxPrice(e.target.value)}
              value={maxPrice}
              placeholder="Max Price"
              className="w-full p-2 bg-gray-200 rounded-lg"
            />
          </div>
        </div>

      </motion.div>
    </div>

  </div>
</motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-gray-600">
                Showing {totalProducts} products
              </p>
              <div className="flex items-center gap-4">
                {/* View Toggle */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-black'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sorting}
                  onChange={(e) => setSorting(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
            }>
              <AnimatePresence>
                {loader ?
                  <div>
                    <Loader />
                  </div>
                  :
                  allProducts.length == 0 ?
                    <p>no products found</p>
                    :
                    allProducts?.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                }
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12 px-2">
              <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">

                {/* Previous */}
                <button
                  onClick={handlePrevious}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-black text-black bg-white rounded-md hover:bg-black hover:text-white transition"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex flex-wrap justify-center gap-2">
                  {Array(pageno).fill(1).map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleClick(idx + 1)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base rounded-lg font-medium transition-all duration-300 ${activeBtn === idx + 1
                          ? 'bg-black text-white'
                          : 'bg-white text-black border border-gray-200 hover:border-black'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={handleNext}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-black text-black bg-white rounded-md hover:bg-black hover:text-white transition"
                >
                  Next
                </button>

              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;