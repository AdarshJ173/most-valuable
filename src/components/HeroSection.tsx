"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-[100vh] w-full overflow-hidden bg-[#0a0a0a]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/l1.png"
          alt="Most Valuable Lifestyle"
          fill
          priority
          className="object-cover"
        />
        {/* CSS Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)"
          }}
        />
      </div>


      {/* Content Container */}
      <div className="relative z-20 h-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
        <div className="max-w-[500px]">
          {/* Overline */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C9972B] text-[12px] tracking-[0.15em] uppercase font-medium mb-4"
          >
            NEW ARRIVAL · V2 COLLECTION
          </motion.p>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-white font-bold leading-[0.95] uppercase"
            style={{ fontSize: "clamp(48px, 7vw, 96px)" }}
          >
            MOST <br /> VALUABLE
          </motion.h1>

          {/* Sub-headline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 mt-3 font-normal"
            style={{ fontSize: "clamp(16px, 2vw, 22px)" }}
          >
            Real Gold. Real Rarity.
          </motion.p>

          {/* Body Copy */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/70 text-[15px] leading-[1.7] max-w-[420px] mt-4 font-light"
          >
            Premium streetwear crafted with 24K gold accents. Each piece is one of one. Designed for those who refuse to blend in.
          </motion.p>

          {/* CTA Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-col items-center sm:items-start gap-6"
          >
            <Link 
              href="#products" 
              className="bg-[#C9972B] text-black font-semibold px-9 py-3.5 tracking-[0.05em] uppercase text-[13px] hover:bg-[#b8871f] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Shop the Drop →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
