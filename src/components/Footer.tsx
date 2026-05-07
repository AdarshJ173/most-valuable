"use client";

import React from "react";
import Link from "next/link";

const FOOTER_LINKS = {
  shop: [
    { name: "Signature Drops", href: "#collection" },
    { name: "The Vault", href: "#vault" },
    { name: "Coming Soon", href: "#coming-soon" },
  ],
  brand: [
    { name: "Our Story", href: "#vision" },
    { name: "The Vision", href: "#vision" },
  ]
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] pt-16 px-5 sm:px-12 flex flex-col">
      {/* Navigation Grid */}
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16">
        {/* Column 1: Shop */}
        <div className="flex flex-col">
          <h4 className="text-white/35 text-[11px] tracking-[0.14em] uppercase mb-5 font-medium">SHOP</h4>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.shop.map(link => (
              <li key={link.name}>
                <Link href={link.href} className="text-white/60 text-[14px] hover:text-white transition-colors duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Brand */}
        <div className="flex flex-col">
          <h4 className="text-white/35 text-[11px] tracking-[0.14em] uppercase mb-5 font-medium">BRAND</h4>
          <ul className="flex flex-col gap-3">
            {FOOTER_LINKS.brand.map(link => (
              <li key={link.name}>
                <Link href={link.href} className="text-white/60 text-[14px] hover:text-white transition-colors duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social Row */}
      <div className="max-w-[1200px] mx-auto w-full mt-12 flex flex-col sm:flex-row items-center sm:items-center gap-6 sm:gap-4">
        <span className="text-white/30 text-[11px] tracking-[0.12em] uppercase">@MOSTVALUABLECO</span>
        <div className="flex items-center gap-4">
          <Link href="https://instagram.com/mostvaluableco" target="_blank" className="text-white/50 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </Link>
        </div>
      </div>

      {/* Brand Stamp */}
      <div className="w-full mt-12 overflow-hidden pointer-events-none">
        <h2 className="text-center text-white/5 font-extrabold tracking-tighter leading-none select-none uppercase" style={{ fontSize: "clamp(48px, 14vw, 160px)" }}>
          MOST VALUABLE
        </h2>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-white/5 py-5 mt-4">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[12px]">
            &copy; {currentYear} Most Valuable. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-white/20 text-[12px] hover:text-white/50 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/20 text-[12px] hover:text-white/50 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
