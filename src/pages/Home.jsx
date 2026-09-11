import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Sparkles, Shield, Truck, Moon, Sun } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_MEDICINES, enrichMedicines } from '../lib/demoData'
import MedicineCard from '../components/MedicineCard'
import Loading from '../components/Loading'
import { useTheme } from '../context/ThemeContext'

export default function Home() {
  const [featuredMedicines, setFeaturedMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const { darkMode, toggleTheme } = useTheme()

  useEffect(() => {
    loadFeaturedMedicines()

    if (!isSupabaseConfigured || !supabase) return undefined

    const channel = supabase
      .channel('home-medicines')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medicines' }, loadFeaturedMedicines)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const loadFeaturedMedicines = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .limit(8)

        if (error) throw error
        setFeaturedMedicines(enrichMedicines(data || []))
      } else {
        // Use demo data when Supabase is not configured
        setFeaturedMedicines(enrichMedicines(SAMPLE_MEDICINES.slice(0, 8)))
      }
    } catch (error) {
      console.error('Error loading medicines:', error)
      // Fallback to demo data on error
      setFeaturedMedicines(enrichMedicines(SAMPLE_MEDICINES.slice(0, 8)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pharmacy-50/30 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pharmacy-600 via-pharmacy-700 to-teal-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-pharmacy-200" />
                <span>Trusted by 10,000+ families</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-pharmacy-200 to-teal-200 bg-clip-text text-transparent">
                  Delivered
                </span>{' '}
                to Your Door
              </h1>

              <p className="text-lg sm:text-xl text-pharmacy-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Browse trusted medicines, healthcare essentials, and wellness products.
                Get them delivered conveniently to your neighbourhood with care and speed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/medicines"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-pharmacy-700 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Medicines</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>View Cart</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-4 bg-black/10 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span>{darkMode ? 'Light mode' : 'Dark mode'}</span>
                </button>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="hidden lg:block relative">
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform rotate-6"></div>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl transform -rotate-6"></div>
                <img
                  src="/medicines/paracetamol-500.jpg"
                  alt="Pharmacy medicines"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-pharmacy-50/50 rounded-xl border border-pharmacy-100">
              <div className="w-12 h-12 rounded-xl bg-pharmacy-600 text-white flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Genuine</h3>
                <p className="text-sm text-gray-600">Certified medicines only</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-pharmacy-50/50 rounded-xl border border-pharmacy-100">
              <div className="w-12 h-12 rounded-xl bg-pharmacy-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Same-day neighbourhood service</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-pharmacy-50/50 rounded-xl border border-pharmacy-100">
              <div className="w-12 h-12 rounded-xl bg-pharmacy-600 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Shopping</h3>
                <p className="text-sm text-gray-600">Browse, order, pay on delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medicines */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Featured Medicines
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully selected healthcare essentials for your family's daily needs
            </p>
          </div>

          {loading ? (
            <Loading message="Loading medicines..." />
          ) : featuredMedicines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredMedicines.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  to="/medicines"
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-pharmacy-600 text-white font-semibold rounded-xl hover:bg-pharmacy-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <span>View All Medicines</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No medicines available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Supabase Configuration Notice */}
      {!isSupabaseConfigured && (
        <section className="py-8 bg-amber-50 border-y border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Demo Mode Active</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Currently using sample data. To enable full authentication and order persistence,
                    configure your Supabase credentials in the <code className="px-2 py-0.5 bg-gray-100 rounded text-xs">.env</code> file.
                  </p>
                  <p className="text-xs text-gray-500">
                    See <code className="px-1.5 py-0.5 bg-gray-100 rounded">.env.example</code> and <code className="px-1.5 py-0.5 bg-gray-100 rounded">supabase_schema.sql</code> for setup instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
