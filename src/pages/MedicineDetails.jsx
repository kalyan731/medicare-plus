import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  Shield,
  Truck,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Package,
  Heart
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_MEDICINES, enrichMedicine } from '../lib/demoData'
import { useCart } from '../context/CartContext'
import Loading from '../components/Loading'

export default function MedicineDetails() {
  const { id } = useParams()
  const { addToCart, toggleWishlist, isWishlisted } = useCart()

  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedNotice, setAddedNotice] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [medicine?.image_url])

  useEffect(() => {
    loadMedicineDetails()

    if (!isSupabaseConfigured || !supabase) return undefined

    const channel = supabase
      .channel(`medicine-details-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines', filter: `id=eq.${id}` }, loadMedicineDetails)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [id])

  const loadMedicineDetails = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setMedicine(enrichMedicine(data))
      } else {
        // Find in demo data
        const found = SAMPLE_MEDICINES.find((m) => m.id === id)
        setMedicine(found ? enrichMedicine(found) : null)
      }
    } catch (error) {
      console.error('Error loading medicine details:', error)
      const found = SAMPLE_MEDICINES.find((m) => m.id === id)
      setMedicine(found ? enrichMedicine(found) : null)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!medicine) return
    addToCart(medicine, quantity)
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 3000)
  }

  if (loading) {
    return <Loading message="Loading medicine details..." />
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h2>
          <p className="text-gray-600 mb-6">
            The medicine you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/medicines"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-pharmacy-600 text-white font-medium rounded-xl hover:bg-pharmacy-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Medicines</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-pharmacy-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/medicines" className="hover:text-pharmacy-600 transition-colors">
            Medicines
          </Link>
          <ChevronRight className="w-4 h-4" />
          {medicine.category && (
            <>
              <span className="text-gray-400">{medicine.category}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-medium truncate">{medicine.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">

            {/* Left Column: Image */}
            <div className="relative aspect-square max-h-[500px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-gray-100">
              {!imgError ? (
                <img
                  src={medicine.image_url}
                  alt={medicine.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-pharmacy-50/50 text-pharmacy-600">
                  <Package className="w-20 h-20 mb-2 opacity-70" />
                  <span className="text-sm font-semibold text-gray-500">{medicine.category}</span>
                </div>
              )}
              {medicine.stock < 20 && medicine.stock > 0 && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Low Stock
                </div>
              )}
              {medicine.stock === 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">

                {/* Category & Stock Badge */}
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-pharmacy-100 text-pharmacy-800 text-xs font-semibold rounded-lg">
                    {medicine.category}
                  </span>
                  {medicine.stock > 0 ? (
                    <span className="flex items-center space-x-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>In Stock ({medicine.stock} units available)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {medicine.name}
                </h1>

                {/* Generic Formula / Subtitle */}
                {medicine.generic_name && (
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    Generic: <span className="text-gray-700 font-semibold">{medicine.generic_name}</span>
                  </p>
                )}

                {/* Price & MRP */}
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-pharmacy-700">
                    ₹{Number.parseFloat(medicine.price).toFixed(2)}
                  </span>
                  {medicine.mrp && medicine.mrp > medicine.price && (
                    <>
                      <span className="text-sm sm:text-base text-gray-400 line-through">
                        MRP ₹{Number.parseFloat(medicine.mrp).toFixed(2)}
                      </span>
                      {medicine.discount_percent && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                          {medicine.discount_percent}% OFF
                        </span>
                      )}
                    </>
                  )}
                  <span className="text-xs text-gray-400">Inclusive of all taxes</span>
                </div>

                {/* Pack Size Info (if available) */}
                {medicine.pack_size && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-semibold">Pack Size:</span>
                    <span>{medicine.pack_size}</span>
                  </div>
                )}

              </div>

              {/* Purchase Section */}
              <div className="pt-6 border-t border-gray-200 space-y-4">

                {medicine.stock > 0 && (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(medicine.stock, quantity + 1))}
                        className="p-2.5 hover:bg-gray-100 text-gray-600 transition-colors"
                        disabled={quantity >= medicine.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Total: <strong className="text-pharmacy-700 font-bold text-sm">₹{(Number.parseFloat(medicine.price) * quantity).toFixed(2)}</strong>
                    </span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={medicine.stock === 0}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold shadow-md transition-all ${medicine.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-pharmacy-600 text-white hover:bg-pharmacy-700 hover:shadow-lg hover:shadow-pharmacy-600/30 active:scale-98'
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(medicine)}
                    className={`w-full sm:w-auto flex items-center justify-center space-x-2 py-4 px-5 rounded-xl font-semibold border-2 transition-colors ${isWishlisted(medicine.id)
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-500'
                      }`}
                    title={isWishlisted(medicine.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className="w-5 h-5" fill={isWishlisted(medicine.id) ? 'currentColor' : 'none'} />
                    <span>{isWishlisted(medicine.id) ? 'Saved' : 'Wishlist'}</span>
                  </button>

                  <Link
                    to="/cart"
                    className="flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold border-2 border-pharmacy-600 text-pharmacy-700 hover:bg-pharmacy-50 transition-colors"
                  >
                    <span>Go to Cart</span>
                  </Link>
                </div>

                {/* Added to cart notification */}
                {addedNotice && (
                  <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-in fade-in duration-200">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Added {quantity} × {medicine.name} to your cart!</span>
                  </div>
                )}

                {/* Trust reassurance */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-pharmacy-600" />
                    <span>100% Genuine Medicine</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Truck className="w-4 h-4 text-pharmacy-600" />
                    <span>Same-day Local Dispatch</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Product Details / Specifications */}
        <div className="mt-10 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Header Navigation */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none">
            {[
              { id: 'description', label: 'Description' },
              { id: 'uses', label: 'Uses & Benefits' },
              { id: 'composition', label: 'Composition' },
              { id: 'manufacturer', label: 'Manufacturer' },
              { id: 'safety', label: 'Safety & Storage' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                  ? 'border-pharmacy-600 text-pharmacy-700 bg-pharmacy-50/40'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Product Overview</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {medicine.description}
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">Key Highlights:</h4>
                  <ul className="list-disc list-inside space-x-1 text-sm text-gray-600 space-y-1">
                    <li>High quality certified pharmaceutical product</li>
                    <li>Sourced directly from verified licensed manufacturers</li>
                    <li>Tamper-proof sealed packaging ensures safety and purity</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'uses' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Therapeutic Indications</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {medicine.uses || `Used for treatment and management of conditions under category ${medicine.category}. Consult your physician for detailed diagnosis and tailored course instructions.`}
                </p>
                {medicine.dosage && (
                  <div className="p-4 bg-pharmacy-50 rounded-2xl text-sm border border-pharmacy-100">
                    <strong className="text-pharmacy-900 block mb-1">Recommended Usage:</strong>
                    <span className="text-pharmacy-800">{medicine.dosage}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'composition' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Active Ingredients & Formulation</h3>
                <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                  <div className="p-4 flex justify-between text-sm bg-gray-50 font-medium text-gray-700">
                    <span>Component</span>
                    <span>Details</span>
                  </div>
                  <div className="p-4 flex justify-between text-sm">
                    <span className="text-gray-600">Active Generic Compound</span>
                    <span className="font-semibold text-gray-900">{medicine.generic_name || medicine.name}</span>
                  </div>
                  {medicine.pack_size && (
                    <div className="p-4 flex justify-between text-sm">
                      <span className="text-gray-600">Packaging Specification</span>
                      <span className="font-semibold text-gray-900">{medicine.pack_size}</span>
                    </div>
                  )}
                  <div className="p-4 flex justify-between text-sm">
                    <span className="text-gray-600">Form</span>
                    <span className="font-semibold text-gray-900">Tablet / Capsule / Formulation</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manufacturer' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Manufacturer & Quality Compliance</h3>
                <p className="text-gray-600 text-sm">
                  Manufactured and marketed under strict GMP (Good Manufacturing Practices) guidelines.
                </p>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 block">Manufacturer Name</span>
                      <span className="font-bold text-gray-800">{medicine.manufacturer || 'Approved Pharmaceutical Lab'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">Country of Origin</span>
                      <span className="font-bold text-gray-800">India</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Safety Advice & Storage Guidelines</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Store in a cool, dry place away from direct sunlight and moisture.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Keep out of reach of children and domestic pets.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Do not exceed the recommended dose without consulting a healthcare professional.</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>Check expiry date printed on the foil strip before consumption.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
