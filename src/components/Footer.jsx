import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 text-pharmacy-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">100% Genuine Medicines</h4>
              <p className="text-xs text-slate-400">Directly sourced from certified manufacturers</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 text-pharmacy-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Express Local Delivery</h4>
              <p className="text-xs text-slate-400">Doorstep delivery within your neighborhood</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 text-pharmacy-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">24/7 Pharmacy Support</h4>
              <p className="text-xs text-slate-400">Always available for urgent health needs</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pharmacy-600 to-teal-400 flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white">
                MediCare<span className="text-pharmacy-400">Plus</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your neighbourhood pharmacy committed to delivering trusted, high-grade medicines and healthcare essentials with speed, safety, and care.
            </p>
            <div className="flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-pharmacy-400" />
                <span>+91 98765 43210 (Mon - Sun, 8am - 10pm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-pharmacy-400" />
                <span>support@medicareplus.local</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-pharmacy-400" />
                <span>Main Market, Green Park, New Delhi - 110016</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Quick Links</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-pharmacy-400 transition-colors">Home</Link></li>
              <li><Link to="/medicines" className="hover:text-pharmacy-400 transition-colors">All Medicines</Link></li>
              <li><Link to="/cart" className="hover:text-pharmacy-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/orders" className="hover:text-pharmacy-400 transition-colors">Order History</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Popular Categories</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/medicines?category=Pain%20%26%20Fever" className="hover:text-pharmacy-400 transition-colors">Pain & Fever</Link></li>
              <li><Link to="/medicines?category=Allergy%20%26%20Cold" className="hover:text-pharmacy-400 transition-colors">Allergy & Cold</Link></li>
              <li><Link to="/medicines?category=Digestive%20%26%20Stomach%20Care" className="hover:text-pharmacy-400 transition-colors">Digestive Care</Link></li>
              <li><Link to="/medicines?category=Vitamins%20%26%20Supplements" className="hover:text-pharmacy-400 transition-colors">Vitamins & Supplements</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediCare Plus Pharmacy. All rights reserved. Demo Healthcare Application.</p>
        </div>
      </div>
    </footer>
  )
}
