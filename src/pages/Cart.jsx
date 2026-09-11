import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0
  const grandTotal = subtotal + deliveryFee

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-pharmacy-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pharmacy-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Looks like you haven't added any medicines yet. Explore our catalog and find the healthcare essentials you need.
          </p>
          <Link
            to="/medicines"
            className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
          >
            <span>Browse Medicines</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 text-sm mt-1">
              Review your items and proceed to checkout
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center space-x-1.5 text-xs text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Cart</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                {/* Image */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-gray-50 border border-gray-100 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[10px] font-semibold text-pharmacy-700 uppercase tracking-wider bg-pharmacy-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-base mt-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Price per unit: ₹{Number.parseFloat(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-800 text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                    title="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Remove */}
                <div className="flex items-center sm:flex-col justify-between sm:justify-center sm:items-end gap-2 w-full sm:w-auto">
                  <span className="text-base font-bold text-gray-900">
                    ₹{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back to Shopping */}
            <div className="pt-4">
              <Link
                to="/medicines"
                className="inline-flex items-center space-x-2 text-sm font-medium text-pharmacy-700 hover:text-pharmacy-800"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                {subtotal < 500 && (
                  <p className="text-xs text-pharmacy-700 bg-pharmacy-50 p-2.5 rounded-xl">
                    💡 Add <strong>₹{(500 - subtotal).toFixed(2)}</strong> more of medicines to get <strong>FREE delivery</strong>!
                  </p>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-extrabold text-pharmacy-700">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md hover:shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {!user && (
                <div className="flex items-start space-x-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>You will be prompted to log in or create an account before placing the order.</span>
                </div>
              )}

              {/* Trust Badge */}
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <ShieldCheck className="w-4 h-4 text-pharmacy-600" />
                <span>Safe and Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
