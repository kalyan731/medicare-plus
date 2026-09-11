import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Loading from '../components/Loading'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isJustPlaced = location.state?.orderPlaced

  useEffect(() => {
    loadOrderDetails()
  }, [id, user])

  const loadOrderDetails = async () => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const userId = user.$id || user.id

      // 1. Load order details - try appwrite_user_id first
      let { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('appwrite_user_id', userId)
        .single()

      // Fallback to user_id if appwrite_user_id column doesn't exist
      if (orderError && orderError.code === '42703') {
        const fallback = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single()
        orderData = fallback.data
        orderError = fallback.error
      }

      if (orderError) throw orderError
      setOrder(orderData)

      // 2. Load order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

      if (itemsError) throw itemsError
      setOrderItems(itemsData || [])
    } catch (err) {
      console.error('Error loading order details:', err)
      setError(err.message || 'Failed to load order details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading order details..." />
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 text-sm mb-8">
            {error || "We couldn't find the requested order or you don't have permission to view it."}
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-pharmacy-600 mb-6 transition-colors group font-medium"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Orders</span>
        </button>

        {/* Order Success Banner (if just placed) */}
        {isJustPlaced && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-emerald-900 flex items-start space-x-4 shadow-sm animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Order Placed Successfully!</h2>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Thank you for your order. Our pharmacy team has received your request and is preparing your medicines for dispatch.
              </p>
            </div>
          </div>
        )}

        {/* Main Order Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden space-y-8 p-6 sm:p-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Order #{order.id.slice(0, 8).toUpperCase()}
                </h1>
                <span className="px-3 py-1 bg-pharmacy-100 text-pharmacy-800 text-xs font-semibold rounded-full">
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
              <p className="text-3xl font-extrabold text-pharmacy-700">
                ₹{parseFloat(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Ordered Medicines Table / List */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5 text-pharmacy-600" />
              <span>Ordered Items ({orderItems.length})</span>
            </h2>

            <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
              {orderItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{item.medicine_name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quantity: <strong className="text-gray-700">{item.quantity}</strong> × ₹{parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-gray-900">
                      ₹{parseFloat(item.subtotal).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center space-x-2 pb-2 border-b border-gray-200">
                <MapPin className="w-4 h-4 text-pharmacy-600" />
                <span>Delivery Address</span>
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-800 font-medium">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{order.delivery_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{order.delivery_phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-gray-600 pt-1">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {order.delivery_address}, {order.delivery_city} - {order.delivery_pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment & Status Info */}
            <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center space-x-2 pb-2 border-b border-gray-200">
                <CreditCard className="w-4 h-4 text-pharmacy-600" />
                <span>Payment & Status</span>
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-gray-900">{order.payment_method}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Status:</span>
                  <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs">
                    Pending on Delivery
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Order Status:</span>
                  <span className="font-semibold text-pharmacy-700 bg-pharmacy-100 px-2 py-0.5 rounded text-xs">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total Charged:</span>
                  <span className="font-bold text-pharmacy-700 text-base">
                    ₹{parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Links */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              to="/medicines"
              className="text-sm font-semibold text-pharmacy-700 hover:text-pharmacy-800"
            >
              Order More Medicines
            </Link>

            <Link
              to="/orders"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-colors text-sm"
            >
              View All Orders
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
