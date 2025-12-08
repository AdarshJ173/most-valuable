"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [heroVideoIndex, setHeroVideoIndex] = useState<number>(0);

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

  // Ensure hero videos play when they become active
  useEffect(() => {
    const video1 = document.getElementById('hero-video-1') as HTMLVideoElement;
    const video2 = document.getElementById('hero-video-2') as HTMLVideoElement;

    if (heroVideoIndex === 0 && video1) {
      video1.currentTime = 0;
      video1.play().catch(err => console.log('Video 1 play error:', err));
    } else if (heroVideoIndex === 1 && video2) {
      video2.currentTime = 0;
      video2.play().catch(err => console.log('Video 2 play error:', err));
    }
  }, [heroVideoIndex]);

  function handleBuyClick(quantity: number) {
    // Redirect to checkout page with quantity parameter
    window.location.href = `/checkout?quantity=${quantity}`;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-black">
      {/* Background set to pure white (gradient removed) */}

      {/* Hero Section with Videos - Full Viewport Height */}
      <section className="relative w-full h-screen mb-8 sm:mb-12">
        {/* Logo overlay on top-left */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" aria-label="MV home" className="inline-flex items-center">
            <Image src="/LogoWhite.png" alt="Most Valuable" width={540} height={180} className="h-24 sm:h-28 w-auto drop-shadow-lg" priority />
          </Link>
        </div>

        <div className="absolute inset-0">
          {/* Video 1: Red Hoddie */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${heroVideoIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
            <video
              id="hero-video-1"
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
              onEnded={() => setHeroVideoIndex(1)}
            >
              <source src="/Red Hoddie.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Video 2: Hoodie */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${heroVideoIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
            <video
              id="hero-video-2"
              className="w-full h-full object-cover"
              muted
              playsInline
              autoPlay
              onEnded={() => setHeroVideoIndex(0)}
            >
              <source src="/Hoodie.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none"></div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => setHeroVideoIndex((prev) => prev === 0 ? 1 : 0)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2.5 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Previous video"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => setHeroVideoIndex((prev) => prev === 0 ? 1 : 0)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-2.5 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Next video"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </section>

      <section className="relative z-10 w-full px-3 py-6 sm:px-4">
        {/* Clean product grid matching reference */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {products.map((p, idx) => {
            const hasVariants = !!p.variants?.length;
            const selectedId = selected[p.id];
            const activeVar = hasVariants && selectedId ? p.variants!.find(v => v.id === selectedId) : undefined;
            const mediaArr = hasVariants ? (activeVar?.media ?? (p.media || [])) : (p.media || []);
            const idxForCard = slideIndex[p.id] ?? 0;
            const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

            return (
              <Link
                href={`/product/${p.slug}`}
                key={p.id}
                className="group relative block bg-white transition-opacity duration-200 hover:opacity-90"
              >
                <div className="relative">
                  <div className="block">
                    <div className="relative aspect-square w-full overflow-hidden bg-white">
                      {/* Sliding track */}
                      <div
                        className="absolute inset-0 flex transition-transform duration-500 ease-out will-change-transform"
                        style={{ transform: `translateX(-${(idxForCard % (mediaArr.length || 1)) * 100}%)` }}
                      >
                        {(mediaArr.length ? mediaArr : [currentMedia]).map((m, i) => (
                          <div key={i} className="relative h-full w-full shrink-0 grow-0 basis-full">
                            <Media
                              src={m}
                              alt={p.name}
                              className={
                                // Check if this is any AI-generated image and apply different scaling
                                m.includes("/AI-generated/")
                                  ? "scale-100 object-contain"
                                  : p.id === "raffle"
                                    ? "scale-[1.7] md:scale-[1.3] object-[50%_60%] sm:object-center"
                                    : p.id === "mv-hoodie"
                                      ? "scale-[1.7] md:scale-[1.5] object-center"
                                      : p.id === "mv-tee"
                                        ? "scale-[2.1] md:scale-[1.35] object-[50%_60%] sm:object-center"
                                        : p.id === "p6"
                                          ? "scale-[1.7] md:scale-[1.4]"
                                          : p.id === "p7"
                                            ? "scale-[1.7] md:scale-[1.4] object-[60%_50%]"
                                            : p.id === "p3"
                                              ? "scale-[2.1] md:scale-[1.35] object-[50%_60%] sm:object-center"
                                              : p.id === "p4"
                                                ? "scale-[1.3] md:scale-[1.35]"
                                                : p.id === "p5"
                                                  ? "scale-[1.6] md:scale-[1.3]"
                                                  : ["p1b", "p1w"].includes(p.id)
                                                    ? "scale-[1.1] sm:scale-100"
                                                    : "scale-[1.7] sm:scale-100"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Left/Right click zones for slide */}
                  {mediaArr.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSlideIndex((s) => ({
                            ...s,
                            [p.id]: (idxForCard - 1 + mediaArr.length) % mediaArr.length,
                          }));
                        }}
                        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer"
                      />
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSlideIndex((s) => ({
                            ...s,
                            [p.id]: (idxForCard + 1) % mediaArr.length,
                          }));
                        }}
                        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer"
                      />
                    </>
                  )}
                </div>

                <div className="pt-2 pb-1 px-1">
                  <div className="flex flex-col items-center text-center w-full">
                    <h3 className="text-xs sm:text-sm font-normal text-gray-800 line-clamp-2 leading-tight">{p.name}</h3>
                    {p.price && p.status !== "available" && (
                      <span className="text-xs text-gray-500 mt-1">{p.price}</span>
                    )}
                  </div>
                  <div className="mt-1.5 flex justify-center"><StatusBadge status={p.status} /></div>
                </div>



                {p.status === "available" && (
                  p.id === "raffle" ? (
                    <>
                      {/* Mobile: simple $100 buy button */}
                      <div className="mt-3 sm:hidden flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.location.href = `/product/${p.slug}`;
                          }}
                          className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium transition hover:bg-black/90 active:scale-95"
                        >
                          Buy $100
                        </button>
                      </div>
                      {/* Desktop/tablet: $100 buy button */}
                      <div className="hidden sm:mt-4 sm:block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/product/${p.slug}`;
                          }}
                          className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
                        >
                          Buy $100
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile: simple price display for direct purchase products */}
                      <div className="mt-3 sm:hidden flex justify-center">
                        <span className="text-sm font-medium text-gray-900">{p.price}</span>
                      </div>
                      {/* Desktop: single buy button for direct purchase */}
                      <div className="hidden sm:mt-4 sm:block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // For direct purchase products, redirect to their individual product page
                            window.location.href = `/product/${p.slug}`;
                          }}
                          className="w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
                        >
                          Buy {p.price}
                        </button>
                      </div>
                    </>
                  )
                )}

              </Link>
            );
          })}
        </div>

        {/* Instagram Link */}
        <div className="mt-16 mb-8 flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Connect with us</p>
              <InstagramLink size="lg" className="justify-center" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

