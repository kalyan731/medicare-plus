import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Calendar, CreditCard, MapPin, Eye, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import Loading from '../components/Loading'

export default function Orders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrders()
  }, [user])

  const loadOrders = async () => {
    if (!user || !isSupabaseConfigured) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const userId = user.$id || user.id

      // Try appwrite_user_id first
      let { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('appwrite_user_id', userId)
        .order('created_at', { ascending: false })

      // Fallback to user_id if appwrite_user_id column doesn't exist
      if (error && error.code === '42703') {
        const fallback = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        data = fallback.data
        error = fallback.error
      }

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Error loading orders:', err)
      setError(err.message || 'Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Supabase Not Configured</h2>
          <p className="text-gray-500 text-sm mb-8">
            Please configure your Supabase credentials in <code className="px-2 py-0.5 bg-gray-100 rounded text-xs">.env</code> to view your order history.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading message="Loading your orders..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-500 text-sm mb-8">{error}</p>
          <button
            onClick={loadOrders}
            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 bg-pharmacy-50 rounded-full flex items-center justify-center mx-auto mb-6 text-pharmacy-600">
            <Package className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 text-sm mb-8">
            You haven't placed any orders yet. Start shopping and place your first order!
          </p>
          <Link
            to="/medicines"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
          >
            Browse Medicines
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 text-sm mt-1">
            View your order history and track deliveries
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 hover:border-pharmacy-300 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                {/* Left: Order Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-pharmacy-100 text-pharmacy-700 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="truncate max-w-xs">{order.delivery_city}, {order.delivery_pincode}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span>{order.payment_method}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center px-3 py-1 bg-pharmacy-50 text-pharmacy-700 text-xs font-semibold rounded-lg">
                    Status: {order.status}
                  </div>
                </div>

                {/* Right: Amount & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                    <p className="text-2xl font-bold text-pharmacy-700">
                      ₹{parseFloat(order.total_amount).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-sm font-medium text-pharmacy-700 group-hover:text-pharmacy-800">
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
