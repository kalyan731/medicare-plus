import { HeartPulse, Phone, Mail, MapPin, ShieldCheck, Truck, Clock, ArrowUp, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Value Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <Link
            to="/medicines"
            className="flex items-center space-x-4 bg-slate-800/60 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-pharmacy-500/50 transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 group-hover:bg-pharmacy-500/20 text-pharmacy-400 flex items-center justify-center shrink-0 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-pharmacy-400 transition-colors">
                100% Genuine Medicines
              </h4>
              <p className="text-xs text-slate-400">Directly sourced from certified manufacturers</p>
            </div>
          </Link>

          <Link
            to="/medicines"
            className="flex items-center space-x-4 bg-slate-800/60 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-pharmacy-500/50 transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 group-hover:bg-pharmacy-500/20 text-pharmacy-400 flex items-center justify-center shrink-0 transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-pharmacy-400 transition-colors">
                Express Local Delivery
              </h4>
              <p className="text-xs text-slate-400">Free delivery on orders over ₹500</p>
            </div>
          </Link>

          <a
            href="tel:+919876543210"
            className="flex items-center space-x-4 bg-slate-800/60 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-pharmacy-500/50 transition-all group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-pharmacy-500/10 group-hover:bg-pharmacy-500/20 text-pharmacy-400 flex items-center justify-center shrink-0 transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white group-hover:text-pharmacy-400 transition-colors">
                24/7 Pharmacy Support
              </h4>
              <p className="text-xs text-slate-400">Click to call our certified pharmacists</p>
            </div>
          </a>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pharmacy-600 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:shadow-pharmacy-500/20 transition-all">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-pharmacy-300 transition-colors">
                MediCare<span className="text-pharmacy-400">Plus</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Your neighbourhood pharmacy committed to delivering trusted, high-grade medicines and healthcare essentials with speed, safety, and care.
            </p>
            <div className="flex flex-col space-y-2.5 text-xs text-slate-400">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center space-x-2.5 hover:text-pharmacy-400 transition-colors w-fit"
              >
                <Phone className="w-4 h-4 text-pharmacy-400 shrink-0" />
                <span>+91 98765 43210 (Mon - Sun, 8am - 10pm)</span>
              </a>
              <a
                href="mailto:support@medicareplus.local"
                className="inline-flex items-center space-x-2.5 hover:text-pharmacy-400 transition-colors w-fit"
              >
                <Mail className="w-4 h-4 text-pharmacy-400 shrink-0" />
                <span>support@medicareplus.local</span>
              </a>
              <a
                href="https://maps.google.com/?q=Main+Market+Green+Park+New+Delhi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 hover:text-pharmacy-400 transition-colors w-fit"
              >
                <MapPin className="w-4 h-4 text-pharmacy-400 shrink-0" />
                <span>Main Market, Green Park, New Delhi - 110016</span>
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Quick Links</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/medicines" className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform">
                  All Medicines
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/files" className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex items-center space-x-1 transition-transform">
                  <FileText className="w-3.5 h-3.5 mr-1 text-pharmacy-400" />
                  <span>Prescription & Lab Files</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">Popular Categories</h5>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  to="/medicines?category=Pain%20%26%20Fever"
                  className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform"
                >
                  Pain & Fever
                </Link>
              </li>
              <li>
                <Link
                  to="/medicines?category=Allergy%20%26%20Cold"
                  className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform"
                >
                  Allergy & Cold
                </Link>
              </li>
              <li>
                <Link
                  to="/medicines?category=Digestive%20%26%20Stomach%20Care"
                  className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform"
                >
                  Digestive Care
                </Link>
              </li>
              <li>
                <Link
                  to="/medicines?category=Vitamins%20%26%20Supplements"
                  className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform"
                >
                  Vitamins & Supplements
                </Link>
              </li>
              <li>
                <Link
                  to="/medicines?category=Antibiotics"
                  className="hover:text-pharmacy-400 hover:translate-x-1 inline-flex transition-transform"
                >
                  Antibiotics
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Scroll To Top Button */}
        <div className="pt-8 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MediCare Plus Pharmacy. All rights reserved. Demo Healthcare Application.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
