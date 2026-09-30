import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thank you for subscribing! Check your inbox for ₹100 off your first order.");
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#0D131F] text-white border-t border-slate-800 mt-auto relative overflow-hidden">
      {/* Ambient Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* Trust & Guarantees Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="container max-w-[1200px] mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300 text-xs font-semibold">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">30-Min Express Delivery</p>
                <p className="text-slate-400 text-[11px]">Real-time live WebSocket GPS tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Sanitized & Sealed</p>
                <p className="text-slate-400 text-[11px]">100% hygienic packaging standard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-lg shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Zero Upfront Partner Fees</p>
                <p className="text-slate-400 text-[11px]">Empowering local home chefs & kitchens</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container max-w-[1200px] mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-black text-xl shadow-glow">
                🍲
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                Tiff<span className="text-primary">ino</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Bringing fresh, homemade meals and restaurant culinary delicacies straight to your doorstep in minutes with real-time live order tracking.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Get ₹100 off your first meal:
              </p>
              <form onSubmit={handleSubscribe} className="flex items-center max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-l-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-primary text-white text-xs font-bold rounded-r-xl shadow-glow hover:opacity-95 transition-opacity shrink-0 flex items-center gap-1"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Col 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/restaurants?cuisine=Italian" className="hover:text-white transition-colors">
                  Wood-Fired Pizza & Pasta
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Indian" className="hover:text-white transition-colors">
                  Royal Dum Biryani
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Japanese" className="hover:text-white transition-colors">
                  Authentic Ramen & Sushi
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Burgers" className="hover:text-white transition-colors">
                  Craft Smash Burgers
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Thali" className="hover:text-white transition-colors">
                  Daily Home Tiffin Thali
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Partners & Admins */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
              Partner & Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/profile?tab=partner" className="hover:text-white transition-colors flex items-center gap-1 text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Register Your Kitchen
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-white transition-colors">
                  Kitchen Live Dashboard
                </Link>
              </li>
              <li>
                <Link to="/owner/menu" className="hover:text-white transition-colors">
                  Menu & Food Item Manager
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-purple-400">
                  Platform Admin Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Address Management
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Terms of Service & Privacy
                </span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  Help Center & FAQs
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Tiffino Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
