-- ===================================================
-- MediCare Plus Pharmacy - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor
-- ===================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create PROFILES Table (linked with Supabase Auth user ID)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create MEDICINES Table
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    generic_name TEXT,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    mrp DECIMAL(10, 2),
    discount_percent INTEGER DEFAULT 20,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 100 NOT NULL,
    pack_size TEXT,
    dosage TEXT,
    manufacturer TEXT,
    uses TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create ORDERS Table (linked with Supabase Auth user ID)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    delivery_name TEXT NOT NULL,
    delivery_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_pincode TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'Cash on Delivery' NOT NULL,
    status TEXT DEFAULT 'Placed' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration for projects created before Supabase Auth ownership was enabled.
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
NOTIFY pgrst, 'reload schema';

-- 5. Create ORDER_ITEMS Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    medicine_id TEXT,
    medicine_name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ===================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- MEDICINES Policies (Public read for all users)
DROP POLICY IF EXISTS "Medicines are viewable by everyone" ON public.medicines;
CREATE POLICY "Medicines are viewable by everyone"
ON public.medicines FOR SELECT
USING (true);

-- PROFILES Policies (each user can access only their own profile)
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles insert" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles update" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ORDERS Policies (each user can access only their own orders)
DROP POLICY IF EXISTS "Public orders read" ON public.orders;
DROP POLICY IF EXISTS "Public orders insert" ON public.orders;
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
CREATE POLICY "Users can read their own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());

-- ORDER_ITEMS Policies (only items belonging to the user's orders)
DROP POLICY IF EXISTS "Public order_items read" ON public.order_items;
DROP POLICY IF EXISTS "Public order_items insert" ON public.order_items;
DROP POLICY IF EXISTS "Users can read their order items" ON public.order_items;
CREATE POLICY "Users can read their order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
DROP POLICY IF EXISTS "Users can create their order items" ON public.order_items;
CREATE POLICY "Users can create their order items" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- ===================================================
-- 7. REFRESH MEDICINES SEED DATA (High-Resolution Verified Packaging)
-- ===================================================
DELETE FROM public.medicines;

INSERT INTO public.medicines (name, generic_name, description, price, mrp, discount_percent, category, stock, pack_size, dosage, manufacturer, uses, image_url) VALUES
(
    'Paracetamol 500mg',
    'Paracetamol (Acetaminophen) IP 500mg',
    'Effective relief from mild to moderate fever, headaches, body ache, toothache, and common cold symptoms. Safe for everyday common ailments.',
    35.00,
    45.00,
    22,
    'Pain & Fever',
    120,
    'Strip of 10 Tablets',
    '1 tablet every 4-6 hours after meals (Max 4g/day)',
    'Cipla Health Ltd.',
    'Relief of mild-to-moderate fever, headache, migraine, muscle ache, backache, arthritis pain, and cold-associated fever.',
    'https://share.google/wAf5KSIo4ZCwfuktQ'
),
(
    'Dolo 650 Tablet',
    'Paracetamol IP 650mg',
    'Fast-acting antipyretic and analgesic prescribed for acute high fever, viral infection body aches, and post-vaccination fever.',
    42.00,
    53.00,
    21,
    'Pain & Fever',
    150,
    'Strip of 15 Tablets',
    '1 tablet 3 times a day as prescribed by physician',
    'Micro Labs Ltd.',
    'Management of acute fever, viral pyrexia, musculoskeletal pains, and headache.',
    'https://share.google/oIgyCYgaLrVJZ86y6'
),
(
    'Cetirizine 10mg',
    'Cetirizine Hydrochloride IP 10mg',
    'Non-drowsy second-generation antihistamine for allergic rhinitis, perennial allergies, runny nose, sneezing, itchy watery eyes, and skin hives.',
    28.50,
    38.00,
    25,
    'Allergy & Cold',
    95,
    'Strip of 10 Tablets',
    '1 tablet once daily at bedtime with water',
    'Dr. Reddy''s Laboratories',
    'Allergic rhinitis, seasonal allergies, hay fever, urticaria (hives), allergic conjunctivitis.',
    'https://share.google/EWU8fxEZS5XeIQhIj'
),
(
    'Azithromycin 500mg',
    'Azithromycin Dihydrate IP 500mg',
    'Broad-spectrum macrolide antibiotic effective against respiratory tract infections, tonsillitis, sinusitis, bronchitis, skin and soft tissue bacterial infections.',
    125.00,
    160.00,
    22,
    'Antibiotics',
    60,
    'Strip of 3 Tablets / 5 Tablets',
    '1 tablet daily 1 hour before or 2 hours after food for 3 to 5 days',
    'Sun Pharmaceutical Industries',
    'Treatment of bacterial respiratory tract infections, pharyngitis, skin infections, and community-acquired pneumonia.',
    'https://share.google/00sIoE6A9XqDX1AUj'
),
(
    'Vitamin C + Zinc Chewable',
    'Ascorbic Acid 500mg + Zinc Sulphate 5mg',
    'Daily immunity booster tablets with powerful antioxidant action to strengthen white blood cells, fight seasonal illness, and boost vitality.',
    85.00,
    110.00,
    23,
    'Vitamins & Supplements',
    200,
    'Bottle of 60 Orange Flavored Chewables',
    '1 chewable tablet daily after lunch or breakfast',
    'Abbott Healthcare',
    'Nutritional support, immune system enhancement, wound healing, and cellular protection.',
    'https://share.google/O0mqbq8zlmYPMK5JE'
),
(
    'ORS Electrolyte Sachet (21.8g)',
    'Oral Rehydration Salts IP (WHO Recommended Formula)',
    'WHO-compliant balanced oral electrolyte formula for instant restoration of vital body fluids, sodium, and potassium lost during dehydration or diarrhea.',
    22.00,
    28.00,
    21,
    'Digestive & Stomach Care',
    250,
    'Single Foil Sachet 21.8g',
    'Dissolve entire contents of sachet in 1 Litre of clean drinking water',
    'FDC Limited',
    'Rapid rehydration in acute diarrhea, vomiting, heat stroke, and intensive physical exertion.',
    'https://share.google/IOwkkZqEpNcefQuQB'
),
(
    'Ibuprofen 400mg',
    'Ibuprofen IP 400mg',
    'Non-steroidal anti-inflammatory drug (NSAID) providing swift targeted relief from acute muscular aches, joint inflammation, sprains, and dysmenorrhea.',
    48.00,
    60.00,
    20,
    'Pain & Fever',
    80,
    'Strip of 10 Film-Coated Tablets',
    '1 tablet with food or a glass of milk to prevent gastric irritation',
    'Piramal Healthcare',
    'Inflammatory joint conditions, osteoarthritis, muscular pain, post-operative dental pain, headache.',
    'https://th.bing.com/th/id/OIP.m1XtOMW7fJKWK6dB-htXQwHaGd?w=181&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3'
),
(
    'Cough Syrup (Benadryl DR)',
    'Dextromethorphan Hydrobromide 10mg / 5ml Syrup',
    'Doctor-recommended antitussive dry cough syrup formula that suppresses persistent hacking cough reflexes and soothes irritated throat tissue.',
    95.00,
    120.00,
    21,
    'Allergy & Cold',
    75,
    '100ml PET Bottle with Measuring Cup',
    '5-10ml up to 3 times a day as required',
    'Johnson & Johnson',
    'Non-productive dry cough relief caused by throat tickle, allergens, and common cold.',
    'https://th.bing.com/th/id/OIP.j3TsBGqbY2kugjb3DCeCmgHaHa?w=174&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3'
),
(
    'Antacid Liquid Gel 200ml',
    'Dried Aluminium Hydroxide + Magnesium Hydroxide + Simethicone Suspension',
    'Instant cooling dual-action suspension that neutralizes excess stomach acid within minutes while eliminating gas bubbles and indigestion pain.',
    110.00,
    140.00,
    21,
    'Digestive & Stomach Care',
    110,
    '200ml Sugar-Free Mint Flavored Bottle',
    '10ml - 15ml taken after meals or at onset of acidity',
    'Pfizer India Ltd.',
    'Hyperacidity, heartburn, acid indigestion, gas bloating, sour stomach, and GERD symptoms.',
    'https://share.google/wAf5KSIo4ZCwfuktQ'
),
(
    'Multivitamin & Minerals Capsules',
    'Multivitamins, Minerals, Ginseng Extract & Antioxidants',
    'Complete daily vitality formulation packed with 21 essential micronutrients, Vitamin B-Complex, Vitamin D3, and Ginseng for sustained all-day energy.',
    199.00,
    260.00,
    23,
    'Vitamins & Supplements',
    90,
    'Bottle of 30 Softgel Capsules',
    '1 softgel daily with water after breakfast',
    'Ranbaxy Laboratories',
    'Daily nutritional support, physical endurance, mental alertness, immunity defense, and bone strength.',
    'https://share.google/oIgyCYgaLrVJZ86y6'
),
(
    'Omeprazole 20mg',
    'Omeprazole Gastro-Resistant Capsules IP 20mg',
    'Targeted proton pump inhibitor (PPI) that decreases excess gastric acid production in the stomach, healing peptic ulcers and reflux esophagitis.',
    55.00,
    72.00,
    24,
    'Digestive & Stomach Care',
    130,
    'Strip of 15 Enteric Coated Capsules',
    '1 capsule once daily in the morning at least 30 minutes before breakfast',
    'Zydus Cadila Healthcare',
    'Gastroesophageal reflux disease (GERD), heartburn prevention, gastric and duodenal ulcers.',
    'https://share.google/EWU8fxEZS5XeIQhIj'
),
(
    'Bandage & Antiseptic Ointment Kit',
    'Povidone Iodine 5% Ointment + Sterile Gauze & Adhesive Dressings',
    'Essential home first aid emergency kit containing antimicrobial povidone-iodine cream, sterile dressing pads, and breathable waterproof adhesive strips.',
    75.00,
    99.00,
    24,
    'First Aid & Wellness',
    65,
    'Complete Care Kit (1 Tube + 10 Strips + 2 Gauze Rolls)',
    'Clean the affected area thoroughly and apply ointment before dressing',
    'Dettol Health Solutions',
    'First aid antiseptic management of minor cuts, abrasions, burns, and superficial skin wounds.',
    'https://share.google/00sIoE6A9XqDX1AUj'
);
