import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-border mt-auto">
      <div className="container max-w-[1180px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-display font-bold text-xl text-fg">
                Tiff<span className="text-primary">ino</span>
              </span>
            </div>
            <p className="text-xs text-fg-2 leading-relaxed">
              Bringing fresh, homemade meals and restaurant delicacies straight to your doorstep in minutes.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-fg mb-3">
              Explore Cuisines
            </h4>
            <ul className="space-y-2 text-xs text-fg-2">
              <li>
                <Link to="/restaurants?cuisine=Italian" className="hover:text-primary transition-colors">
                  Italian & Pasta
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Indian" className="hover:text-primary transition-colors">
                  Indian & Biryani
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Japanese" className="hover:text-primary transition-colors">
                  Japanese & Ramen
                </Link>
              </li>
              <li>
                <Link to="/restaurants?cuisine=Burgers" className="hover:text-primary transition-colors">
                  Craft Smash Burgers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-fg mb-3">
              For Partners
            </h4>
            <ul className="space-y-2 text-xs text-fg-2">
              <li>
                <Link to="/profile?tab=partner" className="hover:text-primary transition-colors">
                  Partner with Tiffino
                </Link>
              </li>
              <li>
                <Link to="/owner" className="hover:text-primary transition-colors">
                  Restaurant Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-fg mb-3">
              Secure Delivery
            </h4>
            <p className="text-xs text-fg-2 leading-relaxed">
              Cashfree secured payments, instant live order tracking via WebSockets, and contact-free delivery options.
            </p>
            <div className="mt-3 text-[11px] text-fg-3">
              © {new Date().getFullYear()} Tiffino Platform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
