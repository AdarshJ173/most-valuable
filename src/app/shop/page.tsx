"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { products } from "@/data/products";
import { RaffleCountdownTimer } from "@/components/RaffleCountdownTimer";
import InstagramLink from "@/components/InstagramLink";

type VariantState = Record<string, string>; // productId -> variantId

function mediaUrl(path: string) {
  // Map /media/* -> /socoldblooded-attachments/*
  if (path.startsWith("/media/")) {
    return path.replace("/media/", "/socoldblooded-attachments/");
  }
  return path;
}

function StatusBadge({ status }: { status: "sold_out" | "coming_soon" | "available" }) {
  if (status === "available") return null;
  const label = status === "sold_out" ? "SOLD OUT" : "COMING SOON";
  return (
    <span className="rounded-full border border-gray-300 bg-gray-100 px-3 py-1 text-xs uppercase tracking-wide text-gray-700">
      {label}
    </span>
  );
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
  const [selected, setSelected] = useState<VariantState>(initial);
  const [loadingQty, setLoadingQty] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  function handleBuyClick(quantity: number) {
    // Redirect to checkout page with quantity parameter
    window.location.href = `/checkout?quantity=${quantity}`;
  }

  // Parallax scroll effect
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const currentHeaderOpacity = isMounted ? headerOpacity : 1;
  return (
    <main className="relative min-h-screen bg-white text-black">
      {/* ============================================
          HERO SECTION - EDITORIAL LUXURY DESIGN
          ============================================ */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
        {/* Full-Screen Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: imageY, scale: imageScale }}
        >
          <Image
            src="/l1.png"
            alt="Most Valuable"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* Grain texture */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%2525%27 height=%27100%2525%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")'
          }}
        />

        {/* ---- TOP NAV: Pill-shaped centered nav ---- */}
        <motion.div
          className="absolute top-6 left-0 right-0 z-30 flex items-center justify-center"
          style={{ opacity: currentHeaderOpacity }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-full px-1.5 py-1.5 border border-white/15 shadow-2xl">
            <Link href="/" className="px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/10">
              Home
            </Link>
            <Link href="/shop" className="px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white bg-white/15 rounded-full font-medium">
              Shop
            </Link>
            <Link href="#products" className="px-4 sm:px-5 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/10">
              Collection
            </Link>
          </div>
        </motion.div>

        {/* ---- BRAND MARK: Top-left logo ---- */}
        <motion.div
          className="absolute top-6 left-6 sm:left-10 z-30"
          style={{ opacity: currentHeaderOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/">
            <Image
              src="/LogoWhite.png"
              alt="Most Valuable"
              width={90}
              height={30}
              className="h-5 sm:h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
              priority
            />
          </Link>
        </motion.div>

        {/* ---- MAIN TYPOGRAPHY: Bold editorial overlay ---- */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pointer-events-none">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              className="mb-6 select-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className="block text-[14vw] sm:text-[10vw] md:text-[8vw] lg:text-[7vw] font-bold leading-[0.9] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Most
              </span>
              <span
                className="block text-[16vw] sm:text-[11vw] md:text-[9vw] lg:text-[8vw] font-light italic leading-[0.95] text-white/90"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Valuable
              </span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base text-white/60 font-light max-w-md leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Premium streetwear crafted with real gold accents.
              Designed for those who refuse to blend in.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                href="#products"
                className="group inline-flex items-center gap-3 bg-white text-black px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium hover:bg-amber-400 hover:text-black transition-all duration-500 shadow-lg"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Shop Now
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 transition-all duration-500"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2"
          style={{ opacity: currentHeaderOpacity }}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/40" style={{ fontFamily: "var(--font-space)" }}>Scroll</span>
          <div className="w-[1px] h-6 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* ============================================
          PRODUCTS SECTION - CATEGORIZED LUXURY LAYOUT
          ============================================ */}
      <section id="products" className="relative z-20 w-full bg-[#fafafa]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 pb-24 sm:pb-32">

          {/* Category Navigation - Sticky */}
          <motion.div
            className="flex items-center justify-center gap-8 sm:gap-12 mb-12 sm:mb-16 py-4 border-b border-black/10"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="#collection" className="group text-[10px] sm:text-xs uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors duration-300">
              <span className="group-hover:underline underline-offset-8 decoration-black/30">The Collection</span>
              <span className="ml-2 text-black/30">({products.filter(p => p.status === "available").length})</span>
            </a>
            <a href="#coming-soon" className="group text-[10px] sm:text-xs uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors duration-300">
              <span className="group-hover:underline underline-offset-8 decoration-black/30">Coming Soon</span>
              <span className="ml-2 text-black/30">({products.filter(p => p.status === "coming_soon").length})</span>
            </a>
            <a href="#the-vault" className="group text-[10px] sm:text-xs uppercase tracking-[0.3em] text-black/60 hover:text-black transition-colors duration-300">
              <span className="group-hover:underline underline-offset-8 decoration-black/30">The Vault</span>
              <span className="ml-2 text-black/30">({products.filter(p => p.status === "sold_out").length})</span>
            </a>
          </motion.div>

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
                    Signature Drops
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
                          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-black font-medium truncate">{p.name}</h3>
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




        {/* The Vault - Premium Sold Out Section */}
        {products.filter(p => p.status === "sold_out").length > 0 && (
          <div id="the-vault" className="relative py-20 px-4 sm:px-6 -mx-3 sm:-mx-4 mt-16 scroll-mt-24">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-900" />

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

            <div className="relative z-10 max-w-7xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-amber-500/70 mb-4 font-light">
                  Archive Collection
                </p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white tracking-tight mb-4">
                  THE VAULT
                </h2>
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mb-6" />
                <p className="text-neutral-500 text-sm sm:text-base font-light tracking-wide">
                  Past Exclusives • Sold Out Forever
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-5xl mx-auto">
                {products.filter(p => p.status === "sold_out").map((p) => {
                  const mediaArr = p.media || [];
                  const idxForCard = slideIndex[p.id] ?? 0;
                  const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

                  return (
                    <div
                      key={p.id}
                      className="group relative"
                    >
                      {/* Card Container */}
                      <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 rounded-lg overflow-hidden transition-all duration-500 group-hover:border-amber-500/30 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.1)]">

                        {/* Gold Ribbon - SOLD OUT */}
                        <div className="absolute top-4 right-4 z-20">
                          <span className="bg-gradient-to-r from-amber-600 to-amber-500 text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-lg">
                            Sold Out
                          </span>
                        </div>

                        {/* Image Container */}
                        <div className="relative aspect-square w-full overflow-hidden bg-neutral-900">
                          {/* Grayscale to color effect */}
                          <div
                            className="absolute inset-0 flex transition-transform duration-500 ease-out will-change-transform"
                            style={{ transform: `translateX(-${(idxForCard % (mediaArr.length || 1)) * 100}%)` }}
                          >
                            {(mediaArr.length ? mediaArr : [currentMedia]).map((m, i) => (
                              <div key={i} className="relative h-full w-full shrink-0 grow-0 basis-full">
                                <Media
                                  src={m}
                                  alt={p.name}
                                  className={`grayscale group-hover:grayscale-0 transition-all duration-700 ${p.id === "p4"
                                    ? "scale-[1.3] md:scale-[1.35]"
                                    : p.id === "p5"
                                      ? "scale-[1.6] md:scale-[1.3]"
                                      : "scale-100 object-contain"
                                    }`}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Subtle vignette overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Product Info */}
                        <div className="p-5 sm:p-6 text-center border-t border-neutral-800/50">
                          <h3 className="text-sm sm:text-base font-light text-white uppercase tracking-[0.2em] mb-2">
                            {p.name}
                          </h3>
                          {p.price && (
                            <p className="text-amber-500/80 text-sm font-light line-through decoration-amber-500/40">
                              {p.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="text-center mt-16">
                <p className="text-neutral-500 text-sm mb-6 font-light">
                  Don&apos;t miss the next drop
                </p>
                <Link
                  href="/"
                  className="inline-block border border-amber-500/50 text-amber-500 px-8 py-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] hover:bg-amber-500 hover:text-black transition-all duration-500 rounded"
                >
                  Get Notified
                </Link>
              </div>
            </div>
          </div>
        )}

      </section>


      {/* Section 3 - Black Background (Brand Story) */}
      <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-12 font-light">
            The Vision
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight leading-[1.3] mb-12">
            &ldquo;Value isn&apos;t just what you wear.<br />
            <span className="text-white/50">It&apos;s what you embody.&rdquo;</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-12">
            Most Valuable represents the intersection of luxury streetwear and tangible worth.
            Every piece in our collection contains real gold, bridging the gap between fashion and investment.
          </p>
          <div className="flex items-center justify-center gap-12 pt-8">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-light text-white mb-2">24K</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Pure Gold</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-light text-white mb-2">100%</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Premium Cotton</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-light text-white mb-2">1:1</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Limited Pieces</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 - White Background (Coming Soon Grid) */}
      <section id="coming-soon" className="min-h-screen bg-white text-black py-24 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6">Preview</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight">Coming Soon</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {products.filter(p => p.status === "coming_soon").map((p) => {
              const mediaArr = p.media || [];
              const idxForCard = slideIndex[p.id] ?? 0;
              const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

              return (
                <div key={p.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-6">
                    {/* Sliding track with auto-scroll */}
                    <div
                      className="absolute inset-0 flex transition-transform duration-1000 ease-out will-change-transform"
                      style={{ transform: `translateX(-${(idxForCard % (mediaArr.length || 1)) * 100}%)` }}
                    >
                      {(mediaArr.length ? mediaArr : [currentMedia]).map((m, i) => (
                        <div key={i} className="relative h-full w-full shrink-0 grow-0 basis-full">
                          <Media
                            src={m}
                            alt={p.name}
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs sm:text-sm font-normal text-black uppercase tracking-[0.15em] mb-2">{p.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Coming Soon</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5 - Newsletter Section */}
      <section className="bg-black text-white py-24 sm:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">Stay Connected</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-tight mb-8">
            Join The<br />Movement
          </h2>
          <p className="text-white/40 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-12">
            Be the first to know about exclusive drops, limited editions, and members-only access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              suppressHydrationWarning
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border border-white/20 px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button suppressHydrationWarning className="bg-white text-black px-8 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-white/90 transition-all duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-white/30 mt-6 tracking-wide">
            By subscribing, you agree to our Privacy Policy
          </p>
        </div>
      </section>

      {/* ============================================
          FOOTER - ALAÏA INSPIRED MINIMAL
          ============================================ */}
      <footer className="relative bg-black text-white overflow-hidden">
        {/* Minimal Top Content */}
        <div className="relative z-10 pt-12 pb-4 px-6 text-center">
          <a
            href="https://instagram.com/mostvaluableco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/50 hover:text-white transition-colors duration-300"
          >
            @mostvaluableco
          </a>
        </div>

        {/* Massive Brand Typography - THE MAIN EVENT (Marquee Animation) */}
        <div className="relative z-0 pb-4 sm:pb-6 overflow-hidden border-t border-white/5 pt-8">
          <motion.div 
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...Array(4)].map((_, i) => (
              <span
                key={i}
                className="text-[18vw] sm:text-[16vw] md:text-[14vw] font-extralight tracking-[0.05em] text-white leading-[0.85] select-none uppercase px-12"
              >
                Most Valuable
              </span>
            ))}
          </motion.div>
        </div>

        {/* Copyright - Tiny at bottom */}
        <div className="relative z-10 pb-4 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            © 2024 Most Valuable
          </p>
        </div>
      </footer>
    </main>
  );
}

