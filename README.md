# MediCare Plus

A full-stack neighborhood pharmacy web application built with React, Vite, Supabase, and Tailwind CSS.

## 🚀 Features

- **User Authentication**: Secure email/password signup and login with Supabase Auth
- **Medicine Catalog**: Browse and search medicines with category filtering
- **Medicine Details**: View detailed product information with quantity selection
- **Shopping Cart**: Add to cart with quantity controls, persistent via localStorage
- **Checkout**: Complete order placement with delivery details and Cash on Delivery payment
- **Order History**: View past orders with full details and status tracking
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Protected Routes**: Authentication-required pages with redirect preservation
- **Demo Mode**: Graceful fallback with sample data when Supabase is not configured

## 📋 Technology Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom pharmacy theme
- **Backend**: Supabase (Auth + PostgreSQL)
- **State Management**: React Context API (AuthContext, CartContext)
- **Icons**: Lucide React
- **Deployment**: GitHub Codespaces / Local

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with your actual Supabase credentials from [supabase.com](https://supabase.com).

### 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the `supabase_schema.sql` file from this project
4. Copy and paste the entire SQL content into the SQL Editor
5. Click **Run** to execute the schema

This will create:
- `profiles` table (user profiles)
- `medicines` table (product catalog)
- `orders` table (order records)
- `order_items` table (order line items)
- Row Level Security (RLS) policies
- Automatic profile creation trigger
- 12 sample medicines

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the Codespaces forwarded URL).

## 📁 Project Structure

```
medicare-plus/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Loading.jsx
│   │   ├── MedicineCard.jsx
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/              # React Context providers
│   │   ├── AuthContext.jsx   # Authentication state
│   │   └── CartContext.jsx   # Shopping cart state
│   ├── lib/                  # Utilities and configs
│   │   ├── demoData.js       # Sample medicines for demo mode
│   │   └── supabase.js       # Supabase client
│   ├── pages/                # Route pages
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MedicineDetails.jsx
│   │   ├── Medicines.jsx
│   │   ├── OrderDetails.jsx
│   │   ├── Orders.jsx
│   │   └── Signup.jsx
│   ├── App.jsx               # Main app with routing
│   ├── index.css             # Tailwind directives
│   └── main.jsx              # React entry point
├── .env.example              # Environment variables template
├── supabase_schema.sql       # Database schema
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

## ✅ Testing Checklist

### Core User Flows

1. **User Registration**
   - [ ] Navigate to `/signup`
   - [ ] Fill in full name, email, phone, password, confirm password
   - [ ] Click "Create Account"
   - [ ] Verify redirect to home page
   - [ ] Verify user profile is created in Supabase

2. **User Login**
   - [ ] Navigate to `/login`
   - [ ] Enter email and password
   - [ ] Click "Sign In"
   - [ ] Verify redirect to home page (or originally requested page)
   - [ ] Verify session persists after page refresh

3. **Browse Medicines**
   - [ ] Navigate to `/medicines`
   - [ ] Verify all medicines are displayed
   - [ ] Test search functionality (type medicine name)
   - [ ] Test category filtering (All, Pain Relief, Cold & Flu, etc.)
   - [ ] Verify results update correctly

4. **View Medicine Details**
   - [ ] Click on any medicine card
   - [ ] Verify medicine details page opens
   - [ ] Check image, name, price, description, category, manufacturer
   - [ ] Test quantity selector (increase/decrease)
   - [ ] Click "Add to Cart"
   - [ ] Verify success notification appears

5. **Shopping Cart**
   - [ ] Navigate to `/cart`
   - [ ] Verify added items are displayed
   - [ ] Test quantity increase/decrease buttons
   - [ ] Test "Remove" button
   - [ ] Verify subtotal and total calculations
   - [ ] Verify delivery fee logic (free over ₹500, else ₹40)
   - [ ] Refresh page and verify cart persists (localStorage)

6. **Checkout (Protected)**
   - [ ] Click "Proceed to Checkout" from cart
   - [ ] If not logged in, verify redirect to `/login`
   - [ ] After login, verify redirect back to checkout
   - [ ] Fill in delivery details (name, phone, address, city, pincode)
   - [ ] Verify "Cash on Delivery" payment method is selected
   - [ ] Review order summary
   - [ ] Click "Place Order"
   - [ ] Verify order is created in Supabase `orders` and `order_items` tables
   - [ ] Verify cart is cleared
   - [ ] Verify redirect to order details page

7. **Order Details**
   - [ ] Verify success banner appears (if just placed)
   - [ ] Check order ID, status, date, total amount
   - [ ] Verify ordered items list with quantities and prices
   - [ ] Check delivery information display
   - [ ] Check payment method and status

8. **Order History**
   - [ ] Navigate to `/orders`
   - [ ] Verify all user's orders are listed (newest first)
   - [ ] Click "View Details" on any order
   - [ ] Verify correct order details page opens
   - [ ] Refresh page and verify orders persist

9. **Session Persistence**
   - [ ] Log in
   - [ ] Add items to cart
   - [ ] Refresh the page
   - [ ] Verify user is still logged in
   - [ ] Verify cart items persist

10. **Logout**
    - [ ] Click user menu in navbar
    - [ ] Click "Logout"
    - [ ] Verify redirect to home page
    - [ ] Verify navbar shows "Sign In" and "Sign Up" buttons
    - [ ] Verify protected routes redirect to login

### Security & Row Level Security (RLS)

- [ ] User A cannot view User B's orders
- [ ] Unauthenticated users are redirected from protected routes
- [ ] Order creation requires authentication
- [ ] Profile creation is automatic on signup

### Responsive Design

- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet (768px - 1023px)
- [ ] Test on desktop (1024px+)
- [ ] Verify navbar mobile drawer works
- [ ] Verify all forms are usable on mobile

### Error Handling

- [ ] Test signup with existing email (should show error)
- [ ] Test login with wrong password (should show error)
- [ ] Test checkout with empty cart (should show empty state)
- [ ] Test viewing non-existent order ID (should show not found)
- [ ] Test without Supabase configured (should show demo mode with warnings)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🚨 Important Notes

- **Demo Mode**: Without Supabase configured, the app shows sample medicines and displays warnings. Authentication and order placement require Supabase.
- **Cart Persistence**: The shopping cart uses `localStorage`, so it persists across page refreshes but is device-specific.
- **Cash on Delivery**: Currently, only Cash on Delivery payment method is implemented.
- **Row Level Security**: Supabase RLS policies ensure users can only access their own orders and profiles.

## 🎨 Design Features

- Custom teal/pharmacy color palette (50-900 shades)
- Rounded corners (rounded-xl, rounded-2xl, rounded-3xl)
- Subtle shadows and hover effects
- Loading states for all async operations
- Success/error notifications with icons
- Responsive grid layouts
- Trust badges in footer

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🐛 Troubleshooting

### "Supabase is not configured" error
- Verify `.env` file exists in project root
- Check that environment variables are correctly formatted
- Restart the development server after creating `.env`

### Orders not appearing
- Verify RLS policies are enabled in Supabase
- Check that `supabase_schema.sql` was executed completely
- Verify user is logged in with the correct account

### Cart is empty after refresh
- Check browser console for localStorage errors
- Verify browser allows localStorage (not in private mode)

## 📝 License

This project is for educational and demonstration purposes.

## 👨‍💻 Development

Built as a demonstration of a complete full-stack pharmacy e-commerce application with authentication, database integration, and modern React patterns.
