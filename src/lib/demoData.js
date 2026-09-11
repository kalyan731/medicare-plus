export const SAMPLE_MEDICINES = [
  {
    id: "med-1",
    name: "Paracetamol 500mg",
    generic_name: "Paracetamol (Acetaminophen) IP 500mg",
    description: "Effective relief from mild to moderate fever, headaches, body ache, toothache, and common cold symptoms. Safe for everyday common ailments.",
    price: 35.00,
    mrp: 45.00,
    discount_percent: 22,
    category: "Pain & Fever",
    stock: 120,
    pack_size: "Strip of 10 Tablets",
    dosage: "1 tablet every 4-6 hours after meals (Max 4g/day)",
    manufacturer: "Cipla Health Ltd.",
    uses: "Relief of mild-to-moderate fever, headache, migraine, muscle ache, backache, arthritis pain, and cold-associated fever.",
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-2",
    name: "Dolo 650 Tablet",
    generic_name: "Paracetamol IP 650mg",
    description: "Fast-acting antipyretic and analgesic prescribed for acute high fever, viral infection body aches, and post-vaccination fever.",
    price: 42.00,
    mrp: 53.00,
    discount_percent: 21,
    category: "Pain & Fever",
    stock: 150,
    pack_size: "Strip of 15 Tablets",
    dosage: "1 tablet 3 times a day as prescribed by physician",
    manufacturer: "Micro Labs Ltd.",
    uses: "Management of acute fever, viral pyrexia, musculoskeletal pains, and headache.",
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-3",
    name: "Cetirizine 10mg",
    generic_name: "Cetirizine Hydrochloride IP 10mg",
    description: "Non-drowsy second-generation antihistamine for allergic rhinitis, perennial allergies, runny nose, sneezing, itchy watery eyes, and skin hives.",
    price: 28.50,
    mrp: 38.00,
    discount_percent: 25,
    category: "Allergy & Cold",
    stock: 95,
    pack_size: "Strip of 10 Tablets",
    dosage: "1 tablet once daily at bedtime with water",
    manufacturer: "Dr. Reddy's Laboratories",
    uses: "Allergic rhinitis, seasonal allergies, hay fever, urticaria (hives), allergic conjunctivitis.",
    image_url: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-4",
    name: "Azithromycin 500mg",
    generic_name: "Azithromycin Dihydrate IP 500mg",
    description: "Broad-spectrum macrolide antibiotic effective against respiratory tract infections, tonsillitis, sinusitis, bronchitis, skin and soft tissue bacterial infections.",
    price: 125.00,
    mrp: 160.00,
    discount_percent: 22,
    category: "Antibiotics",
    stock: 60,
    pack_size: "Strip of 3 Tablets / 5 Tablets",
    dosage: "1 tablet daily 1 hour before or 2 hours after food for 3 to 5 days",
    manufacturer: "Sun Pharmaceutical Industries",
    uses: "Treatment of bacterial respiratory tract infections, pharyngitis, skin infections, and community-acquired pneumonia.",
    image_url: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-5",
    name: "Vitamin C + Zinc Chewable",
    generic_name: "Ascorbic Acid 500mg + Zinc Sulphate 5mg",
    description: "Daily immunity booster tablets with powerful antioxidant action to strengthen white blood cells, fight seasonal illness, and boost vitality.",
    price: 85.00,
    mrp: 110.00,
    discount_percent: 23,
    category: "Vitamins & Supplements",
    stock: 200,
    pack_size: "Bottle of 60 Orange Flavored Chewables",
    dosage: "1 chewable tablet daily after lunch or breakfast",
    manufacturer: "Abbott Healthcare",
    uses: "Nutritional support, immune system enhancement, wound healing, and cellular protection.",
    image_url: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-6",
    name: "ORS Electrolyte Sachet (21.8g)",
    generic_name: "Oral Rehydration Salts IP (WHO Recommended Formula)",
    description: "WHO-compliant balanced oral electrolyte formula for instant restoration of vital body fluids, sodium, and potassium lost during dehydration or diarrhea.",
    price: 22.00,
    mrp: 28.00,
    discount_percent: 21,
    category: "Digestive & Stomach Care",
    stock: 250,
    pack_size: "Single Foil Sachet 21.8g",
    dosage: "Dissolve entire contents of sachet in 1 Litre of clean drinking water",
    manufacturer: "FDC Limited",
    uses: "Rapid rehydration in acute diarrhea, vomiting, heat stroke, and intensive physical exertion.",
    image_url: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-7",
    name: "Ibuprofen 400mg",
    generic_name: "Ibuprofen IP 400mg",
    description: "Non-steroidal anti-inflammatory drug (NSAID) providing swift targeted relief from acute muscular aches, joint inflammation, sprains, and dysmenorrhea.",
    price: 48.00,
    mrp: 60.00,
    discount_percent: 20,
    category: "Pain & Fever",
    stock: 80,
    pack_size: "Strip of 10 Film-Coated Tablets",
    dosage: "1 tablet with food or a glass of milk to prevent gastric irritation",
    manufacturer: "Piramal Healthcare",
    uses: "Inflammatory joint conditions, osteoarthritis, muscular pain, post-operative dental pain, headache.",
    image_url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-8",
    name: "Cough Syrup (Benadryl DR)",
    generic_name: "Dextromethorphan Hydrobromide 10mg / 5ml Syrup",
    description: "Doctor-recommended antitussive dry cough syrup formula that suppresses persistent hacking cough reflexes and soothes irritated throat tissue.",
    price: 95.00,
    mrp: 120.00,
    discount_percent: 21,
    category: "Allergy & Cold",
    stock: 75,
    pack_size: "100ml PET Bottle with Measuring Cup",
    dosage: "5-10ml up to 3 times a day as required",
    manufacturer: "Johnson & Johnson",
    uses: "Non-productive dry cough relief caused by throat tickle, allergens, and common cold.",
    image_url: "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-9",
    name: "Antacid Liquid Gel 200ml",
    generic_name: "Dried Aluminium Hydroxide + Magnesium Hydroxide + Simethicone Suspension",
    description: "Instant cooling dual-action suspension that neutralizes excess stomach acid within minutes while eliminating gas bubbles and indigestion pain.",
    price: 110.00,
    mrp: 140.00,
    discount_percent: 21,
    category: "Digestive & Stomach Care",
    stock: 110,
    pack_size: "200ml Sugar-Free Mint Flavored Bottle",
    dosage: "10ml - 15ml taken after meals or at onset of acidity",
    manufacturer: "Pfizer India Ltd.",
    uses: "Hyperacidity, heartburn, acid indigestion, gas bloating, sour stomach, and GERD symptoms.",
    image_url: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-10",
    name: "Multivitamin & Minerals Capsules",
    generic_name: "Multivitamins, Minerals, Ginseng Extract & Antioxidants",
    description: "Complete daily vitality formulation packed with 21 essential micronutrients, Vitamin B-Complex, Vitamin D3, and Ginseng for sustained all-day energy.",
    price: 199.00,
    mrp: 260.00,
    discount_percent: 23,
    category: "Vitamins & Supplements",
    stock: 90,
    pack_size: "Bottle of 30 Softgel Capsules",
    dosage: "1 softgel daily with water after breakfast",
    manufacturer: "Ranbaxy Laboratories",
    uses: "Daily nutritional support, physical endurance, mental alertness, immunity defense, and bone strength.",
    image_url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-11",
    name: "Omeprazole 20mg",
    generic_name: "Omeprazole Gastro-Resistant Capsules IP 20mg",
    description: "Targeted proton pump inhibitor (PPI) that decreases excess gastric acid production in the stomach, healing peptic ulcers and reflux esophagitis.",
    price: 55.00,
    mrp: 72.00,
    discount_percent: 24,
    category: "Digestive & Stomach Care",
    stock: 130,
    pack_size: "Strip of 15 Enteric Coated Capsules",
    dosage: "1 capsule once daily in the morning at least 30 minutes before breakfast",
    manufacturer: "Zydus Cadila Healthcare",
    uses: "Gastroesophageal reflux disease (GERD), heartburn prevention, gastric and duodenal ulcers.",
    image_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "med-12",
    name: "Bandage & Antiseptic Ointment Kit",
    generic_name: "Povidone Iodine 5% Ointment + Sterile Gauze & Adhesive Dressings",
    description: "Essential home first aid emergency kit containing antimicrobial povidone-iodine cream, sterile dressing pads, and breathable waterproof adhesive strips.",
    price: 75.00,
    mrp: 99.00,
    discount_percent: 24,
    category: "First Aid & Wellness",
    stock: 65,
    pack_size: "Complete Care Kit (1 Tube + 10 Strips + 2 Gauze Rolls)",
    dosage: "Clean the affected area thoroughly and apply ointment before dressing",
    manufacturer: "Dettol Health Solutions",
    uses: "First aid antiseptic management of minor cuts, abrasions, burns, and superficial skin wounds.",
    image_url: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=800&auto=format&fit=crop&q=80"
  }
]

/**
 * Enriches a medicine object (e.g. from Supabase or user input) with
 * high-resolution pharmacy packaging images, generic names, pack sizes,
 * dosage guidelines, manufacturer information, and uses.
 */
export function enrichMedicine(med) {
  if (!med) return null

  // Helper to extract key search tokens
  const cleanName = (med.name || '').toLowerCase().trim()

  const match = SAMPLE_MEDICINES.find((sample) => {
    if (sample.id === med.id) return true
    const sampleName = sample.name.toLowerCase().trim()
    if (sampleName === cleanName) return true
    // Match significant prefix e.g. "Paracetamol", "Dolo", "Cetirizine"
    const samplePrefix = sampleName.split(' ')[0]
    const medPrefix = cleanName.split(' ')[0]
    return samplePrefix && medPrefix && (samplePrefix === medPrefix || cleanName.includes(samplePrefix))
  })

  if (match) {
    return {
      ...match,
      ...med, // preserve live DB id, stock, price, etc.
      // Use verified rich image if DB has placeholder or empty
      image_url: match.image_url,
      generic_name: med.generic_name || match.generic_name,
      pack_size: med.pack_size || match.pack_size,
      dosage: med.dosage || match.dosage,
      manufacturer: med.manufacturer || match.manufacturer,
      uses: med.uses || match.uses,
      mrp: med.mrp || match.mrp,
      discount_percent: med.discount_percent || match.discount_percent
    }
  }

  // Fallback for custom or newly added medicines
  return {
    generic_name: med.name,
    pack_size: 'Standard Pack',
    dosage: 'Take as directed by your physician',
    manufacturer: 'Certified Pharmaceutical Manufacturer',
    uses: `Indicated for therapeutic management in ${med.category || 'General Health'}.`,
    mrp: Number.parseFloat(med.price || 0) * 1.25,
    discount_percent: 20,
    ...med
  }
}

/**
 * Enriches a list of medicines with rich catalog attributes and packaging images
 */
export function enrichMedicines(medicineList) {
  if (!Array.isArray(medicineList)) return []
  return medicineList.map(enrichMedicine)
}
