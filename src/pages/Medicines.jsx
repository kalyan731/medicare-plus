


import { useEffect, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_MEDICINES, enrichMedicines } from '../lib/demoData'
import MedicineCard from '../components/MedicineCard'
import Loading from '../components/Loading'

export default function Medicines() {
  const [medicines, setMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadMedicines()
  }, [])

  useEffect(() => {
    filterMedicines()
  }, [searchQuery, selectedCategory, medicines])

  const loadMedicines = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .order('name')

        if (error) throw error
        const enriched = enrichMedicines(data || [])
        setMedicines(enriched)
        extractCategories(enriched)
      } else {
        // Use demo data when Supabase is not configured
        const enriched = enrichMedicines(SAMPLE_MEDICINES)
        setMedicines(enriched)
        extractCategories(enriched)
      }
    } catch (error) {
      console.error('Error loading medicines:', error)
      // Fallback to demo data on error
      const enriched = enrichMedicines(SAMPLE_MEDICINES)
      setMedicines(enriched)
      extractCategories(enriched)
    } finally {
      setLoading(false)
    }
  }

  const extractCategories = (medicineList) => {
    const uniqueCategories = [...new Set(medicineList.map((m) => m.category))]
    setCategories(['All', ...uniqueCategories])
  }

  const filterMedicines = () => {
    let filtered = medicines

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(query) ||
          medicine.generic_name?.toLowerCase().includes(query) ||
          medicine.description?.toLowerCase().includes(query) ||
          medicine.category?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((medicine) => medicine.category === selectedCategory)
    }

    setFilteredMedicines(filtered)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Browse Medicines
          </h1>
          <p className="text-gray-600 text-lg">
            Find trusted healthcare products for your family
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="space-y-4">

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines by name, generic composition, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Filter by Category:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-pharmacy-600 text-white shadow-md shadow-pharmacy-600/30'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters & Clear */}
            {(searchQuery || selectedCategory !== 'All') && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-pharmacy-700">{filteredMedicines.length}</span> result{filteredMedicines.length !== 1 ? 's' : ''}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-pharmacy-600 hover:bg-pharmacy-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear filters</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <Loading message="Loading medicines..." />
        ) : filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? "Try adjusting your search or filters to find what you're looking for."
                : 'No medicines are currently available in the catalog.'}
            </p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-pharmacy-600 text-white font-medium rounded-xl hover:bg-pharmacy-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
