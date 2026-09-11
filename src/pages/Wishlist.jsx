import { Heart, ShoppingBag, ArrowRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import MedicineCard from '../components/MedicineCard'

export default function Wishlist() {
    const { wishlist, toggleWishlist } = useCart()

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-200 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <Heart className="w-10 h-10" fill="currentColor" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Save medicines you want to remember by tapping the heart button on a product.
                    </p>
                    <Link
                        to="/medicines"
                        className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-6 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-md transition-all"
                    >
                        <ShoppingBag className="w-4 h-4" />
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
                <div className="mb-8">
                    <div className="flex items-center space-x-3">
                        <Heart className="w-7 h-7 text-red-500" fill="currentColor" />
                        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">Your saved medicines are here when you are ready.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((medicine) => (
                        <div key={medicine.id} className="relative">
                            <button
                                type="button"
                                onClick={() => toggleWishlist(medicine)}
                                className="absolute right-3 top-3 z-20 inline-flex items-center space-x-1 rounded-full bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-red-600 shadow-md hover:bg-red-50"
                                title="Remove from wishlist"
                                aria-label={`Remove ${medicine.name} from wishlist`}
                            >
                                <X className="w-3.5 h-3.5" />
                                <span>Remove</span>
                            </button>
                            <MedicineCard medicine={medicine} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
