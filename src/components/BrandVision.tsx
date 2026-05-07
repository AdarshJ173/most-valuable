"use client";

import React from "react";

export default function BrandVision() {
  return (
    <section 
      id="vision" 
      className="w-full bg-[#0a0a0a] border-t border-white/5 py-24 sm:py-32 px-5 sm:px-12 flex flex-col items-center scroll-mt-24"
    >
      <div className="w-full max-w-[760px] mx-auto text-center">
        {/* Overline */}
        <p className="text-white/30 text-[11px] tracking-[0.2em] uppercase font-medium mb-8">
          THE VISION
        </p>

        {/* Quote Block */}
        <div className="flex flex-col gap-2">
          <h2 className="text-white font-bold leading-[1.15] tracking-tight" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
            Value isn&apos;t just what you wear.
          </h2>
          <h2 className="text-white font-bold leading-[1.15] tracking-tight" style={{ fontSize: "clamp(24px, 4vw, 42px)" }}>
            It&apos;s what you embody.
          </h2>
        </div>

        {/* Body Copy */}
        <p className="text-white/55 text-[15px] leading-[1.8] max-w-[560px] mx-auto mt-8 font-light">
          Most Valuable represents the intersection of luxury streetwear and tangible worth. Every piece in our collection contains real gold, bridging the gap between fashion and investment.
        </p>

        {/* Stats Row */}
        <div className="mt-14 w-full flex flex-col sm:flex-row items-center justify-between border-y border-white/5 py-10 sm:py-12 gap-10 sm:gap-0">
          {/* Stat 1: Dominant Gold Hero */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-[#C9972B] font-bold leading-none" style={{ fontSize: "clamp(36px, 5vw, 56px)" }}>
              24K
            </p>
            <p className="text-white/35 text-[10px] tracking-[0.16em] uppercase mt-2 font-medium">
              PURE GOLD
            </p>
          </div>

          <div className="hidden sm:block h-16 w-[1px] bg-white/10" />

          {/* Stat 2 */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              100%
            </p>
            <p className="text-white/35 text-[10px] tracking-[0.16em] uppercase mt-2 font-medium">
              PREMIUM COTTON
            </p>
          </div>

          <div className="hidden sm:block h-16 w-[1px] bg-white/10" />

          {/* Stat 3 */}
          <div className="flex-1 flex flex-col items-center">
            <p className="text-white font-bold leading-none" style={{ fontSize: "clamp(28px, 4vw, 44px)" }}>
              1:1
            </p>
            <p className="text-white/35 text-[10px] tracking-[0.16em] uppercase mt-2 font-medium">
              LIMITED PIECES
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
