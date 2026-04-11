import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, LogOut, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';
import WishlistDropdown from './WishlistDropdown';
import { AuthContext } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistDropdownOpen, setIsWishlistDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, accessToken } = useContext(AuthContext);
  const { cartItemCount, wishlistCount, setWishlistItems, setCartItems } = useProductContext();

  const isLoggedIn = Boolean(accessToken);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-tighter text-black">
              MINIMAL<span className="text-gray-600">STORE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium transition-colors duration-300 relative ${location.pathname === item.path
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                    }`}
                >
                  {item.name}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                      initial={false}
                    />
                  )}
                </Link>
              ))}
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  className={`font-medium transition-colors duration-300 relative ${location.pathname === '/dashboard'
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                    }`}
                >
                  Dashboard
                  {location.pathname === '/dashboard' && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                      initial={false}
                    />
                  )}
                </Link>
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                <Search className="w-5 h-5 text-black" />
              </button> */}

              <div className='hidden lg:flex'>

                {/* Wishlist Dropdown */}
                <WishlistDropdown />

                {/* User Icon */}
                {isLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/dashboard"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                      title="Go to Dashboard"
                    >
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
                        <User />
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-black" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                    title="Login / Signup"
                  >
                    <User className="w-5 h-5 text-black" />
                  </button>
                )}

                {/* Cart Icon */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                >
                  <ShoppingBag className="w-5 h-5 text-black" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </button>
              </div>


              <button
                className="md:hidden p-2 text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 border-t border-gray-200 bg-white">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block py-3 px-4 font-medium transition-colors duration-300 ${location.pathname === item.path
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-gray-100'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isLoggedIn && (
                    <Link
                      to="/dashboard"
                      className={`block py-3 px-4 font-medium transition-colors duration-300 ${location.pathname === '/dashboard'
                        ? 'bg-black text-white'
                        : 'text-black hover:bg-gray-100'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}

                  {/* Wishlist in Mobile Menu */}
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 py-3 px-4 font-medium text-black hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-5 h-5" />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>

                  {/* Cart in Mobile Menu */}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center gap-3 w-full text-left py-3 px-4 font-medium text-black hover:bg-gray-100 transition-colors duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </button>

                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left py-3 px-4 font-medium text-black hover:bg-gray-100 transition-colors duration-300"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="block w-full text-left py-3 px-4 font-medium text-black hover:bg-gray-100 transition-colors duration-300"
                    >
                      Login / Signup
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Header;