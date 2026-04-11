import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';

const CheckoutPage = () => {
  const { accessToken, login, userData } = useContext(AuthContext)
  const { cartItems, cartTotal, OrderDetail } = useContext(ProductContext);
  const [orderData, setOrderData] = useState([])
  // const [status, setStatus] = useState(false)
  const [step, setStep] = useState(1);
  const [inpVal, setInpVal] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    shippingMethod: '',
    shippingCharges: '',
    paymentMethod: ''
  })
  console.log('cart values', cartItems, cartTotal);


  useEffect(() => {
    if (userData) {
      setInpVal({
        name: userData.username,
        email: userData.email
      })
    }
  }, [userData])

  const handlechange = (e) => {
    const { name, value } = e.target
    setInpVal({ ...inpVal, [name]: value, totalAmount: total, cartItems, cartTotal, shippingAmount })
    console.log('ship', inpVal);
  }

  /// place order
  const handleOrderData = async (e) => {
    try {
      e.preventDefault()
      const res = await OrderDetail(inpVal)
      console.log('place order', res);
      // setStatus(true)

    } catch (error) {
      console.log(error);
    }
  }

  const shipping = [
    {
      type: 'standard',
      charges: '$2',
      days: '6-7 days'
    },
    {
      type: 'express',
      charges: '$4',
      days: '3-4 days'
    },
    {
      type: 'overnight',
      charges: '$6',
      days: 'next day'
    },
  ]


  const steps = [
    { number: 1, title: 'Shipping', description: 'Enter your shipping details' },
    { number: 2, title: 'Shipping Method', description: 'Choose shipping method' },
    { number: 3, title: 'Payment', description: 'Choose payment method' },
    { number: 4, title: 'Review', description: 'Review your order' },
  ];

  // Calculate totals
  const subtotal = cartTotal;
  const shippingAmount = inpVal.shippingMethod === 'standard' ? 2 : inpVal.shippingMethod === 'express' ? 4 : 6;
  const total = cartTotal + shippingAmount

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* {
        status &&
        <div className='absolute z-20 h-full w-full bg-black/50 flex flex-col items-center justify-center '>
          <div className='bg-white h-[300px] w-[550px] flex flex-col items-center justify-center rounded border border-black shadow-lg space-y-5'>

            <h1 className='text-[30px]'>Order Placed</h1>
            <Link to={'/shop'}>

              <button className='text-xl bg-black p-3 text-white rounded cursor-pointer'>Continue Shopping</button>
            </Link>
          </div>
       
        </div>

      } */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}

        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
          </div>

          <div className="flex justify-between relative">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex flex-col items-center relative z-10">
                <div onClick={() => setStep(stepItem.number)} className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stepItem.number <= step
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-400'
                  }`}>
                  {stepItem.number < step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepItem.number
                  )}
                </div>
                <div className="text-center">
                  <div className={`font-medium ${stepItem.number <= step ? 'text-black' : 'text-gray-400'
                    }`}>
                    {stepItem.title}
                  </div>
                  <div className="text-sm text-gray-500 hidden md:block">
                    {stepItem.description}
                  </div>
                </div>
              </div>
            ))}
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Ali"
                      name='name'
                      value={inpVal.name}
                      onChange={handlechange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="ali@email.com"
                      name='email'
                      value={inpVal.email}
                      onChange={handlechange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="123 Main Street"
                    name='address'
                    value={inpVal.address}
                    onChange={handlechange}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Lahore"
                      name='city'
                      value={inpVal.city}
                      onChange={handlechange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Punjab"
                      name='province'
                      value={inpVal.province}
                      onChange={handlechange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="10001"
                      name='zipCode'
                      value={inpVal.zipCode}
                      onChange={handlechange}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Next
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Shipping Method</h2>
              <div className="space-y-4 mb-8">
                {
                  shipping.map((method) => (
                    <label
                      key={method.type}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${inpVal.shippingMethod === method.type
                        ? 'border-black bg-black/5'
                        : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.type}
                        checked={inpVal.shippingMethod === method.type}
                        onChange={handlechange}
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium capitalize">{method.type}</div>
                        <div className="text-sm text-gray-600" value={inpVal.shippingCharges} name='shippingCharges'>
                          {method.days}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.charges}
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Next
                </button>

              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>
              <div className="space-y-4 mb-8">
                {['stripe', 'cash on delivery'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${inpVal.paymentMethod === method
                      ? 'border-black bg-black/5'
                      : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={inpVal.paymentMethod === method}
                      onChange={handlechange}
                      className="mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium capitalize">{method}</div>
                      <div className="text-sm text-gray-600">
                        {method === 'card' && 'Pay with credit or debit card'}
                        {method === 'paypal' && 'Pay with your PayPal account'}
                        {method === 'applepay' && 'Pay with Apple Pay'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600">${shippingAmount}</span>
                    </div>
                    {/* <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>$20.80</span>
                    </div> */}
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Assurance */}
                <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
                  <Shield className="w-5 h-5 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Checkout</div>
                    <div>Your payment information is encrypted and secure.</div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button onClick={handleOrderData} className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-3">
                  <Lock className="w-5 h-5" />
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;