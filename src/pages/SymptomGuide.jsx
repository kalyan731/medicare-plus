import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, HeartPulse, Search, ShieldCheck, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SAMPLE_MEDICINES, enrichMedicines } from '../lib/demoData'
import MedicineCard from '../components/MedicineCard'
import Loading from '../components/Loading'

const symptomGuides = [
    {
        id: 'fever',
        label: 'Fever or body aches',
        keywords: ['fever', 'temperature', 'body ache', 'headache', 'pain'],
        guidance: 'For mild, short-term fever or common aches, a pharmacist may discuss paracetamol-based options. Follow the package directions and avoid taking more than one product containing paracetamol.',
        categories: ['Pain & Fever'],
    },
    {
        id: 'allergy',
        label: 'Allergy, sneezing, or runny nose',
        keywords: ['allergy', 'sneeze', 'sneezing', 'runny nose', 'itchy eyes'],
        guidance: 'For occasional allergy symptoms, a pharmacist may recommend an antihistamine. Some antihistamines can cause drowsiness, so check the label before driving or working.',
        categories: ['Allergy & Cold'],
    },
    {
        id: 'acidity',
        label: 'Acidity, heartburn, or gas',
        keywords: ['acidity', 'heartburn', 'gas', 'indigestion', 'reflux', 'stomach'],
        guidance: 'For occasional mild acidity, antacid products may provide short-term relief. Persistent, severe, or recurring symptoms should be assessed by a clinician.',
        categories: ['Digestive & Stomach Care'],
    },
    {
        id: 'dehydration',
        label: 'Dehydration after vomiting or diarrhea',
        keywords: ['dehydration', 'diarrhea', 'vomiting', 'loose motion', 'electrolyte'],
        guidance: 'Oral rehydration solution can help replace fluids and salts. Use it exactly as directed and seek medical care when symptoms are severe or ongoing.',
        categories: ['Digestive & Stomach Care'],
    },
    {
        id: 'first-aid',
        label: 'Minor cuts, scrapes, or burns',
        keywords: ['cut', 'scrape', 'burn', 'wound', 'first aid'],
        guidance: 'For a minor wound, clean it with clean running water and use an appropriate dressing. Deep, dirty, infected, or heavily bleeding wounds need medical care.',
        categories: ['First Aid & Wellness'],
    },
    {
        id: 'supplements',
        label: 'Daily vitamins or nutrition support',
        keywords: ['vitamin', 'nutrition', 'immunity', 'supplement', 'zinc'],
        guidance: 'Supplements are not a replacement for a balanced diet or medical treatment. Ask a healthcare professional before starting them if you are pregnant, taking medicines, or managing a condition.',
        categories: ['Vitamins & Supplements'],
    },
]

const urgentSymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'fainting', 'seizure', 'stroke', 'face drooping', 'sudden weakness']

export default function SymptomGuide() {
    const [selectedGuide, setSelectedGuide] = useState(null)
    const [query, setQuery] = useState('')
    const [medicines, setMedicines] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadMedicines = async () => {
            try {
                if (isSupabaseConfigured && supabase) {
                    const { data, error } = await supabase.from('medicines').select('*').order('name')
                    if (error) throw error
                    setMedicines(enrichMedicines(data || []))
                } else {
                    setMedicines(enrichMedicines(SAMPLE_MEDICINES))
                }
            } catch (error) {
                console.error('Error loading medicines for symptom guide:', error)
                setMedicines(enrichMedicines(SAMPLE_MEDICINES))
            } finally {
                setLoading(false)
            }
        }

        loadMedicines()
    }, [])

    const normalizedQuery = query.trim().toLowerCase()
    const matchingGuide = selectedGuide || symptomGuides.find((guide) =>
        guide.keywords.some((keyword) => normalizedQuery.includes(keyword))
    )
    const recommendedMedicines = matchingGuide
        ? medicines.filter((medicine) => matchingGuide.categories.includes(medicine.category)).slice(0, 4)
        : []
    const showsUrgentWarning = urgentSymptoms.some((symptom) => normalizedQuery.includes(symptom))

    const handleGuideSelect = (guide) => {
        setSelectedGuide(guide)
        setQuery(guide.label)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pharmacy-50/30 to-white py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <section className="max-w-3xl mx-auto text-center mb-10">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pharmacy-100 text-pharmacy-700 text-sm font-semibold mb-4">
                        <HeartPulse className="w-4 h-4" />
                        <span>Symptom guidance</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Find a sensible next step</h1>
                    <p className="text-gray-600 text-lg">Tell us what you are experiencing and we will point you toward general medicine categories to discuss with a pharmacist.</p>
                </section>

                <section className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm p-5 sm:p-8 mb-8">
                    <label htmlFor="symptom-search" className="block text-sm font-semibold text-gray-700 mb-2">What are you feeling?</label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            id="symptom-search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setSelectedGuide(null)
                            }}
                            placeholder="Try: fever, allergy, acidity, or dehydration"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {symptomGuides.map((guide) => (
                            <button
                                key={guide.id}
                                onClick={() => handleGuideSelect(guide)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGuide?.id === guide.id ? 'bg-pharmacy-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pharmacy-50 hover:text-pharmacy-700'}`}
                            >
                                {guide.label}
                            </button>
                        ))}
                    </div>
                </section>

                {showsUrgentWarning && (
                    <section className="max-w-3xl mx-auto mb-8 p-5 rounded-2xl border border-red-200 bg-red-50 text-red-900">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                            <div>
                                <h2 className="font-bold mb-1">Get urgent medical help</h2>
                                <p className="text-sm">These symptoms may be serious. Do not self-treat with this guide. Contact local emergency services or seek urgent medical care now.</p>
                            </div>
                        </div>
                    </section>
                )}

                {matchingGuide && !showsUrgentWarning && (
                    <section className="max-w-3xl mx-auto mb-10">
                        <div className="p-5 sm:p-6 rounded-2xl border border-pharmacy-200 bg-pharmacy-50/70">
                            <div className="flex items-start space-x-3">
                                <Stethoscope className="w-6 h-6 text-pharmacy-700 shrink-0" />
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">For {matchingGuide.label.toLowerCase()}</h2>
                                    <p className="text-gray-700 leading-relaxed">{matchingGuide.guidance}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {matchingGuide && !showsUrgentWarning && (
                    <section className="mb-10">
                        <div className="flex items-end justify-between mb-5">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Categories to discuss</h2>
                                <p className="text-gray-600 mt-1">These products match the general symptom category, not a personal diagnosis.</p>
                            </div>
                            <Link to="/medicines" className="hidden sm:inline-flex items-center space-x-2 text-sm font-semibold text-pharmacy-700 hover:text-pharmacy-800">
                                <span>Browse all</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        {loading ? <Loading message="Loading matching medicines..." /> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {recommendedMedicines.map((medicine) => <MedicineCard key={medicine.id} medicine={medicine} />)}
                            </div>
                        )}
                    </section>
                )}

                {!matchingGuide && !loading && (
                    <section className="max-w-3xl mx-auto text-center py-8">
                        <ShieldCheck className="w-10 h-10 text-pharmacy-600 mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Start with a symptom</h2>
                        <p className="text-gray-600">Choose a common symptom above. This tool offers general information only and does not replace a doctor or pharmacist.</p>
                    </section>
                )}

                <section className="max-w-3xl mx-auto border-t border-gray-200 pt-6 text-sm text-gray-600">
                    <p><strong className="text-gray-800">Important:</strong> Do not start antibiotics, change prescription medicines, or combine products based only on this page. Check labels, allergies, age limits, pregnancy warnings, and interactions with a pharmacist or clinician.</p>
                </section>
            </div>
        </div>
    )
}
