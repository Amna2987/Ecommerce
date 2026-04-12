import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const { signup, login } = useAuthContext()
  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form data
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })
    setError('');
  };

  // Handle signup form changes
  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData({ ...signupData, [name]: value })
    setError('');
    // console.log('signup data', signupData);

  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('')

    try {
      // Validation
      if (!loginData.email || !loginData.password) {
        throw new Error('Please fill in all fields');
      }
      const token = await login(loginData)

      if (!token) {
        throw new Error('Invalid');
      }

      // console.log('Login attempt:', loginData);

      // Close modal and redirect to dashboard
      onClose();
      navigate('/dashboard');
      setLoginData({email:'', password:'' })

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup submission
  const handleSignupSubmit = async (e) => {

    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { username, email, password } = signupData
      // Validation
      if (!signupData.username || !signupData.email || !signupData.password) {
        throw new Error('Please fill in all fields');
      }
      const res = await signup(signupData)

      // if (signupData.password !== signupData.confirmPassword) {
      //   throw new Error('Passwords do not match');
      // }

      // if (signupData.password.length < 6) {
      //   throw new Error('Password must be at least 6 characters');
      // }

      // console.log('Signup attempt:', signupData);

      // After successful signup, switch to login form
      setActiveForm('login');
      setSignupData({
        username: '',
        email: '',
        password: '',
        // confirmPassword: '',
      });
      setError('Account created successfully! Please verify to login.');
      
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Switch between forms
  const switchToSignup = () => {
    setActiveForm('signup');
    setError('');
    setLoginData({email:'', password:'' })
  };
  
  const switchToLogin = () => {
    setActiveForm('login');
    setError('');
    setSignupData({
      username: '',
      email: '',
      password: '',
      // confirmPassword: '',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold">
                  {activeForm === 'login' ? 'Login' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error/Success Message */}
              {error && (
                <div className={`mx-6 mt-6 p-4 rounded-lg ${error.includes('successfully')
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                  }`}>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={switchToLogin}
                  disabled={isLoading}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeForm === 'login'
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Login
                </button>
                <button
                  onClick={switchToSignup}
                  disabled={isLoading}
                  className={`flex-1 py-4 text-center font-medium transition-colors ${activeForm === 'signup'
                      ? 'text-black border-b-2 border-black'
                      : 'text-gray-500 hover:text-black'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Forms */}
              <div className="p-6">
                {/* Login Form */}
                {activeForm === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          required
                          placeholder="you@example.com"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          placeholder="••••••••"
                          disabled={isLoading}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Forgot password */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={isLoading}
                        className="text-sm text-black hover:text-gray-600 transition-colors disabled:opacity-50"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>

                    {/* Sign up link */}
                    <div className="text-center mt-4">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToSignup}
                          disabled={isLoading}
                          className="text-black font-semibold hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* Signup Form */}
                {activeForm === 'signup' && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    {/* Name field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="username"
                          value={signupData.username}
                          onChange={handleSignupChange}
                          required
                          placeholder="John Doe"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          required
                          placeholder="you@example.com"
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Password field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          required
                          placeholder="••••••••"
                          disabled={isLoading}
                          //   minLength={6}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Must be at least 6 characters long
                      </p>
                    </div>

                    {/* Confirm Password field */}
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={signupData.confirmPassword}
                          onChange={handleSignupChange}
                          required
                          placeholder="••••••••"
                          disabled={isLoading}
                          minLength={6}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div> */}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>

                    {/* Login link */}
                    <div className="text-center mt-4">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToLogin}
                          disabled={isLoading}
                          className="text-black font-semibold hover:text-gray-600 transition-colors disabled:opacity-50"
                        >
                          Login
                        </button>
                      </p>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By signing up, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;