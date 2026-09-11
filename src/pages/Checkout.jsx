import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, Phone, User, Home, CreditCard, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function Checkout() {
  const { cart, clearCart, getCartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    deliveryName: profile?.full_name || '',
    deliveryPhone: profile?.phone || '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPincode: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmedOrderId, setConfirmedOrderId] = useState(null)
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState(null)

  const subtotal = getCartTotal()
  const deliveryFee = subtotal >= 500 ? 0 : 40
  const grandTotal = subtotal + deliveryFee

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.deliveryName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!formData.deliveryPhone.trim()) {
      setError('Please enter your phone number.')
      return
    }

    if (!formData.deliveryAddress.trim()) {
      setError('Please enter your delivery address.')
      return
    }

    if (!formData.deliveryCity.trim()) {
      setError('Please enter your city.')
      return
    }

    if (!formData.deliveryPincode.trim()) {
      setError('Please enter your pincode.')
      return
    }

    if (cart.length === 0) {
      setError('Your cart is empty.')
      return
    }

    if (!user) {
      setError('Please sign in to place an order.')
      return
    }

    setConfirmationOpen(true)
  }

  const handleConfirmOrder = async () => {
    if (loading) return
    setError('')
    setLoading(true)

    try {
      if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')

      const { data: { user: authenticatedUser }, error: authError } = await supabase.auth.getUser()
      if (authError || !authenticatedUser) {
        setConfirmationOpen(false)
        throw new Error('Please sign in to place an order.')
      }

      const medicineIds = cart.map((item) => item.id)
      const { data: trustedMedicines, error: medicinesError } = await supabase
        .from('medicines')
        .select('id, price, stock')
        .in('id', medicineIds)

      if (medicinesError) throw medicinesError

      const medicineById = new Map((trustedMedicines || []).map((medicine) => [medicine.id, medicine]))
      const unavailableItem = cart.find((item) => {
        const trustedMedicine = medicineById.get(item.id)
        return !trustedMedicine || trustedMedicine.stock < item.quantity
      })

      if (unavailableItem) {
        throw new Error(`${unavailableItem.name} is unavailable in the requested quantity.`)
      }

      const trustedSubtotal = cart.reduce((total, item) => {
        const trustedMedicine = medicineById.get(item.id)
        return total + Number.parseFloat(trustedMedicine.price) * item.quantity
      }, 0)
      const trustedDeliveryFee = trustedSubtotal >= 500 ? 0 : 40
      const trustedGrandTotal = trustedSubtotal + trustedDeliveryFee

      // Create the order in Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: authenticatedUser.id,
            delivery_name: formData.deliveryName,
            delivery_phone: formData.deliveryPhone,
            delivery_address: formData.deliveryAddress,
            delivery_city: formData.deliveryCity,
            delivery_pincode: formData.deliveryPincode,
            total_amount: trustedGrandTotal,
            payment_method: 'Cash on Delivery',
            status: 'Placed',
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        medicine_id: item.id,
        medicine_name: item.name,
        price: Number.parseFloat(medicineById.get(item.id).price),
        quantity: item.quantity,
        subtotal: Number.parseFloat(medicineById.get(item.id).price) * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        await supabase.from('orders').delete().eq('id', orderData.id).eq('user_id', authenticatedUser.id)
        throw itemsError
      }

      // Success: clear cart and show confirmation before navigating.
      clearCart()
      setConfirmationOpen(false)
      setConfirmedOrderId(orderData.id)
      setConfirmedOrderTotal(trustedGrandTotal)
    } catch (err) {
      console.error('Error placing order:', err)
      if (err.message?.includes('unavailable')) {
        setError(err.message)
      } else if (err.message?.includes('sign in')) {
        setError(err.message)
      } else {
        setError('We couldn\'t place your order. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const confirmationModal = (confirmationOpen || confirmedOrderId) && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{confirmedOrderId ? 'Order confirmed!' : 'Confirm your order'}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {confirmedOrderId
            ? `Thank you. Your order has been received. Total: ₹${confirmedOrderTotal?.toFixed(2)}.`
            : `Your total is ₹${grandTotal.toFixed(2)}. Confirm to place this order.`}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
          {confirmedOrderId ? (
            <button
              onClick={() => navigate(`/orders/${confirmedOrderId}`, { state: { orderPlaced: true } })}
              className="flex-1 rounded-xl bg-pharmacy-600 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pharmacy-700"
            >
              View order
            </button>
          ) : (
            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="flex-1 rounded-xl bg-pharmacy-600 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-pharmacy-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Placing order...' : 'Confirm Order'}
            </button>
          )}
          {!confirmedOrderId && (
            <button
              onClick={() => setConfirmationOpen(false)}
              disabled={loading}
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Review details
            </button>
          )}
          <button
            onClick={() => confirmedOrderId ? navigate('/medicines') : setConfirmationOpen(false)}
            className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            {confirmedOrderId ? 'Continue shopping' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )

  if (cart.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
            <p className="text-gray-500 text-sm mb-8">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <Link
              to="/medicines"
              className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
            >
              Browse Medicines
            </Link>
          </div>
        </div>
        {confirmationModal}
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Button */}
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-pharmacy-600 mb-6 transition-colors group font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Cart</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 text-sm mt-1">
              Complete your order with delivery details
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start space-x-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Grid */}
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Delivery Form */}
              <div className="lg:col-span-2 space-y-6">

                {/* Delivery Details Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-pharmacy-600" />
                    <span>Delivery Information</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label htmlFor="deliveryName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          id="deliveryName"
                          type="text"
                          name="deliveryName"
                          required
                          value={formData.deliveryName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="sm:col-span-2">
                      <label htmlFor="deliveryPhone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          id="deliveryPhone"
                          type="tel"
                          name="deliveryPhone"
                          required
                          value={formData.deliveryPhone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <label htmlFor="deliveryAddress" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Delivery Address
                      </label>
                      <div className="relative">
                        <Home className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                        <textarea
                          id="deliveryAddress"
                          name="deliveryAddress"
                          required
                          value={formData.deliveryAddress}
                          onChange={handleChange}
                          placeholder="House No, Building Name, Street, Locality"
                          rows="3"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm resize-none"
                        />
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="deliveryCity" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        City
                      </label>
                      <input
                        id="deliveryCity"
                        type="text"
                        name="deliveryCity"
                        required
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        placeholder="New Delhi"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label htmlFor="deliveryPincode" className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Pincode
                      </label>
                      <input
                        id="deliveryPincode"
                        type="text"
                        name="deliveryPincode"
                        required
                        value={formData.deliveryPincode}
                        onChange={handleChange}
                        placeholder="110016"
                        maxLength="6"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                      />
                    </div>

                  </div>
                </div>

                {/* Payment Method Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-pharmacy-600" />
                    <span>Payment Method</span>
                  </h2>

                  <div className="flex items-center justify-between p-4 bg-pharmacy-50 border-2 border-pharmacy-600 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-pharmacy-600 text-white flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when your order arrives</p>
                      </div>
                    </div>
                    <CheckCircle className="w-6 h-6 text-pharmacy-600" />
                  </div>
                </div>

              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-100">
                    Order Summary
                  </h2>

                  {/* Items List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 text-sm">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-50 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{Number.parseFloat(item.price).toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">
                          ₹{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm pt-4 border-t border-gray-100">
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

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                      <span className="text-base font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-extrabold text-pharmacy-700">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>

            </div>
          </form>

        </div>
      </div>
      {confirmationModal}
    </>
  )
}
