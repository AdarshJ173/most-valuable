"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { products } from "@/data/products";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import TheVault from "@/components/TheVault";
import BrandVision from "@/components/BrandVision";
import ComingSoon from "@/components/ComingSoon";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

type VariantState = Record<string, string>; // productId -> variantId

function mediaUrl(path: string) {
  // Map /media/* -> /socoldblooded-attachments/*
  if (path.startsWith("/media/")) {
    return path.replace("/media/", "/socoldblooded-attachments/");
  }
  return path;
}

// Client-only video component to prevent hydration issues
function ClientVideo({ src, className = "" }: { src: string; alt: string; className?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Show a placeholder during SSR
    return <div className={`absolute inset-0 h-full w-full bg-gray-100 ${className}`} />;
  }

  return (
    <video
      className={`absolute inset-0 h-full w-full object-contain ${className}`}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      key={src} // Force re-render on src change to avoid browser extension conflicts
    />
  );
}

function Media({ src, alt, className = "", style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const url = mediaUrl(src);
  const isVideo = /\.(mp4|mov)$/i.test(url);
  return isVideo ? (
    <ClientVideo src={url} alt={alt} className={className} />
  ) : (
    <Image src={url} alt={alt} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className={`object-contain ${className}`} style={style} />
  );
}

export default function ShopPage() {
  // Track selected variant per product
  const initial: VariantState = useMemo(() => {
    // Preselect Black variants for products with variants
    return {
      "mv-hoodie": "mv-hoodie-blk", // MV Members Only Hoodie
      "mv-tee": "mv-tee-blk" // MV Members Only Tee
    };
  }, []);
  const [selected] = useState<VariantState>(initial);
  const [slideIndex, setSlideIndex] = useState<Record<string, number>>({});

  // Auto-slide images every 3s for products that have multiple media
  useEffect(() => {
    const id = setInterval(() => {
      setSlideIndex((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const p of products) {
          const hasVariants = !!p.variants?.length;
          const selectedId = selected[p.id];
          const activeVar = hasVariants && selectedId ? (p.variants!.find(v => v.id === selectedId) ?? undefined) : undefined;
          const mediaArr = hasVariants ? (activeVar?.media ?? (p.media || [])) : (p.media || []);
          if (mediaArr.length > 1) {
            const cur = prev[p.id] ?? 0;
            next[p.id] = (cur + 1) % mediaArr.length;
          }
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [selected]);

  return (
    <main className="relative min-h-screen bg-white text-black">
      {/* ============================================
          HERO SECTION - EDITORIAL LUXURY DESIGN
          ============================================ */}
      <Navbar />
      {/* ============================================
          HERO SECTION - V2 LUXURY DROP
          ============================================ */}
      <HeroSection />

      {/* ============================================
          PRODUCTS SECTION - CATEGORIZED LUXURY LAYOUT
          ============================================ */}
      <section id="collection" className="relative z-20 w-full bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-24 sm:pb-32">


          {/* ============ THE COLLECTION SECTION ============ */}
          {products.filter(p => p.status === "available").length > 0 && (
            <div id="collection" className="mb-20 sm:mb-28 scroll-mt-24">
              <motion.div
                className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-black/40 mb-3">New Arrival • V2 Collection</p>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-black">
                    New Drops
                  </h2>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-[10px] sm:text-xs text-black/40 tracking-wide">
                    {products.filter(p => p.status === "available").length} Limited Pieces
                  </span>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-16 lg:gap-x-12">
                {products.filter(p => p.status === "available").map((p, idx) => {
                  const hasVariants = !!p.variants?.length;
                  const selectedId = selected[p.id];
                  const activeVar = hasVariants && selectedId ? p.variants!.find(v => v.id === selectedId) : undefined;
                  const mediaArr = hasVariants ? (activeVar?.media ?? (p.media || [])) : (p.media || []);
                  const idxForCard = slideIndex[p.id] ?? 0;
                  const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                    >
                      <Link href={`/product/${p.slug}`} className="group block">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-white mb-4 sm:mb-6">
                          <div
                            className="absolute inset-0 flex transition-transform duration-700 ease-out"
                            style={{ transform: `translateX(-${(idxForCard % (mediaArr.length || 1)) * 100}%)` }}
                          >
                            {(mediaArr.length ? mediaArr : [currentMedia]).map((m, i) => (
                              <div key={i} className="relative h-full w-full shrink-0 basis-full">
                                <Media 
                                  src={m} 
                                  alt={p.name} 
                                  className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
                                  style={{ objectFit: 'contain' }}
                                />
                              </div>
                            ))}
                          </div>
                          
                          {/* Subtle border for separation on white background */}
                          <div className="absolute inset-0 border border-black/[0.03] pointer-events-none" />
                          
                          {mediaArr.length > 1 && (
                            <>
                              <button suppressHydrationWarning type="button" aria-label="Previous image" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((s) => ({ ...s, [p.id]: (idxForCard - 1 + mediaArr.length) % mediaArr.length })); }} className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize z-10" />
                              <button suppressHydrationWarning type="button" aria-label="Next image" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((s) => ({ ...s, [p.id]: (idxForCard + 1) % mediaArr.length })); }} className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize z-10" />
                            </>
                          )}
                        </div>

                        <div className="space-y-1 px-1">
                          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-black font-medium truncate group-hover:text-[#C9972B] transition-colors">{p.name}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] sm:text-[11px] text-black/40 tracking-wider font-light">{p.price}</p>
                            <span className="text-[8px] uppercase tracking-[0.2em] text-black/20 font-bold group-hover:text-black/60 transition-colors">View</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

        </div>




        {/* ============================================
            THE VAULT - ARCHIVE COLLECTION
            ============================================ */}
        <TheVault />

      </section>


      {/* ============================================
          BRAND MANIFESTO - THE VISION
          ============================================ */}
      <BrandVision />

      {/* ============================================
          COMING SOON - APPAREL PREVIEW
          ============================================ */}
      <ComingSoon />

      {/* ============================================
          STAY CONNECTED - NEWSLETTER
          ============================================ */}
      <Newsletter />

      {/* ============================================
          FOOTER - LUXURY BRANDED
          ============================================ */}
      <Footer />
    </main>
  );
}

