"use client";

import React from "react";
import Image from "next/image";

const VAULT_ITEMS = [
  {
    name: "MV Camo Backpack",
    price: 300,
    goldWeight: "1.8g 24K gold hardware",
    image: "/bagImg2.jpeg",
    soldOut: true
  },
  {
    name: "MV Camo Duffel",
    price: 1200,
    goldWeight: "4.2g 24K gold hardware",
    image: "/Bag2.jpeg",
    soldOut: true
  }
];

export default function TheVault() {
  const scrollToNewsletter = (productName: string) => {
    // Save the product name to local storage for the newsletter component
    localStorage.setItem("pendingNotification", productName);
    
    const newsletter = document.getElementById("newsletter");
    if (newsletter) {
      newsletter.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="vault" className="w-full bg-[#0a0a0a] py-20 px-5 sm:px-12 flex flex-col items-center scroll-mt-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <p className="text-[#C9972B] text-[11px] tracking-[0.18em] uppercase font-medium">
          ARCHIVE COLLECTION
        </p>
        <h2 className="text-white font-bold tracking-tight uppercase mt-3 mb-3" style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
          THE VAULT
        </h2>
        <div className="w-10 h-[1px] bg-[#C9972B] mx-auto mb-4" />
        <p className="text-white/40 text-[14px] tracking-[0.06em] font-light">
          Past Exclusives · Sold Out Forever
        </p>
      </div>

      {/* Vault Cards Container */}
      <div className="w-full max-w-[860px] grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
        {VAULT_ITEMS.map((item) => (
          <div key={item.name} className="bg-[#141414] border border-white/10 overflow-hidden flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full bg-[#1a1a1a]">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill
                className="object-cover grayscale-[20%]"
              />
              {/* SOLD OUT Badge */}
              <div className="absolute top-0 left-0 bg-black/80 text-white text-[10px] tracking-[0.1em] px-3 py-1.5 uppercase font-bold">
                SOLD OUT
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col">
                <h3 className="text-white text-[13px] font-semibold uppercase tracking-[0.08em] mb-1">
                  {item.name}
                </h3>
                <p className="text-[#C9972B] text-[11px] tracking-[0.06em] mb-1 font-medium">
                  {item.goldWeight}
                </p>
                <p className="text-white/35 text-[13px]">
                  ${item.price.toLocaleString()}
                </p>
              </div>
              
              <button 
                onClick={() => scrollToNewsletter(item.name)}
                className="w-full py-3 border border-white/10 text-white/60 text-[11px] tracking-[0.14em] uppercase hover:bg-white hover:text-black transition-all duration-300 font-medium"
              >
                Notify Me
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
