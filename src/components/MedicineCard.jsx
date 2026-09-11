import { ShoppingCart, Eye, Package } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function MedicineCard({ medicine }) {
  const { addToCart } = useCart()
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [medicine.image_url])

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(medicine, 1)
  }

  const defaultImg = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"

  return (
    <Link
      to={`/medicines/${medicine.id}`}
      className="group bg-white rounded-2xl border border-gray-200/80 hover:border-pharmacy-300 hover:shadow-xl hover:shadow-pharmacy-500/5 overflow-hidden transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          {!imgError ? (
            <img
              src={medicine.image_url || defaultImg}
              alt={medicine.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-pharmacy-50/50 text-pharmacy-600">
              <Package className="w-10 h-10 mb-1 opacity-70" />
              <span className="text-xs font-semibold text-gray-500">{medicine.category}</span>
            </div>
          )}

          {medicine.stock < 20 && medicine.stock > 0 && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              Low Stock
            </div>
          )}
          {medicine.stock === 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              Out of Stock
            </div>
          )}

          {/* View Overlay on Hover */}
          <div className="absolute inset-0 bg-pharmacy-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white flex items-center space-x-2 text-sm font-medium bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 bg-pharmacy-50 text-pharmacy-700 text-xs font-semibold rounded-md">
              {medicine.category}
            </span>
            {medicine.pack_size && (
              <span className="text-[11px] text-gray-400 font-medium truncate max-w-[120px]">
                {medicine.pack_size}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1 group-hover:text-pharmacy-700 transition-colors">
            {medicine.name}
          </h3>

          {/* Generic formula / Composition */}
          {medicine.generic_name && (
            <p className="text-[11px] text-gray-400 font-medium mb-1.5 truncate">
              {medicine.generic_name}
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">
            {medicine.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0">
        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <p className="text-xl font-bold text-pharmacy-700">
                ₹{Number.parseFloat(medicine.price).toFixed(2)}
              </p>
              {medicine.mrp && medicine.mrp > medicine.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number.parseFloat(medicine.mrp).toFixed(2)}
                </span>
              )}
            </div>
            {medicine.discount_percent && (
              <span className="text-[10px] font-bold text-emerald-600 block">
                {medicine.discount_percent}% OFF
              </span>
            )}
            {medicine.manufacturer && (
              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[130px]">{medicine.manufacturer}</p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={medicine.stock === 0}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${medicine.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-pharmacy-600 text-white hover:bg-pharmacy-700 hover:shadow-md hover:shadow-pharmacy-600/30 active:scale-95'
              }`}
            title={medicine.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  )
}
