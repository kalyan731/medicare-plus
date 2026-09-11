import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  Package,
  Pill,
  Home,
  HeartPulse,
  FolderOpen
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const { getCartCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const cartCount = getCartCount()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'My Files', path: '/files', icon: FolderOpen },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-pharmacy-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-pharmacy-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pharmacy-800 to-teal-600 bg-clip-text text-transparent">
                MediCare<span className="text-teal-500">Plus</span>
              </span>
              <span className="block text-[10px] text-gray-400 -mt-1 font-medium tracking-wider uppercase">
                Trusted Pharmacy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'text-pharmacy-700 bg-pharmacy-50'
                    : 'text-gray-600 hover:text-pharmacy-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              )
            })}

            {/* Orders link (if logged in) */}
            {user && (
              <Link
                to="/orders"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/orders')
                  ? 'text-pharmacy-700 bg-pharmacy-50'
                  : 'text-gray-600 hover:text-pharmacy-600 hover:bg-gray-50'
                  }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-gray-700 hover:text-pharmacy-600 hover:bg-pharmacy-50 transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pharmacy-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Auth Actions */}
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5">
                  <div className="w-8 h-8 rounded-lg bg-pharmacy-100 text-pharmacy-700 flex items-center justify-center font-bold text-sm">
                    {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-800 leading-tight truncate max-w-[120px]">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate max-w-[120px]">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pharmacy-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-pharmacy-600 hover:bg-pharmacy-700 rounded-lg shadow-sm shadow-pharmacy-600/30 transition-all hover:shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-pharmacy-50 hover:text-pharmacy-600"
          >
            <Home className="w-5 h-5 text-gray-400" />
            <span>Home</span>
          </Link>
          <Link
            to="/medicines"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-pharmacy-50 hover:text-pharmacy-600"
          >
            <Pill className="w-5 h-5 text-gray-400" />
            <span>Medicines</span>
          </Link>
          <Link
            to="/files"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-pharmacy-50 hover:text-pharmacy-600"
          >
            <FolderOpen className="w-5 h-5 text-gray-400" />
            <span>My Files</span>
          </Link>

          {user && (
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-pharmacy-50 hover:text-pharmacy-600"
            >
              <Package className="w-5 h-5 text-gray-400" />
              <span>My Orders</span>
            </Link>
          )}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-800">
                    {profile?.full_name || 'Signed in user'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-pharmacy-600 hover:bg-pharmacy-700 rounded-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
