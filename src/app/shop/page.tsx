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

  return (
    <main className="relative min-h-screen bg-white text-black">
      {/* Header with Logo */}
      <header className="w-full py-6 px-6">
        <Link href="/" aria-label="MV home" className="inline-flex items-center">
          <Image src="/Logo.png" alt="Most Valuable" width={540} height={180} className="h-16 sm:h-20 w-auto" priority />
        </Link>
      </header>

      <section className="relative z-10 w-full px-3 py-6 sm:px-4">
        {/* Available Products Section */}
        {products.filter(p => p.status === "available").length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center uppercase tracking-wide">
              Shop Now
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
              {products.filter(p => p.status === "available").map((p, idx) => {
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

                    <div className="pt-3 pb-2 px-2">
                      <div className="flex flex-col items-center text-center w-full space-y-1">
                        {/* Product name - uppercase, centered */}
                        <h3 className="text-xs sm:text-sm font-normal text-black uppercase tracking-wide line-clamp-2 leading-tight">
                          {p.name}
                        </h3>

                        {/* Price - always show if available */}
                        {p.status === "available" && p.price && (
                          <p className="text-sm text-gray-900">{p.price}</p>
                        )}
                      </div>
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
          </div>
        )}

        {/* Coming Soon Section */}
        {products.filter(p => p.status === "coming_soon").length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center uppercase tracking-wide">
              Coming Soon
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
              {products.filter(p => p.status === "coming_soon").map((p) => {
                const mediaArr = p.media || [];
                const idxForCard = slideIndex[p.id] ?? 0;
                const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

                return (
                  <div
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
                                  className="scale-100 object-contain"
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

                    <div className="pt-3 pb-2 px-2">
                      <div className="flex flex-col items-center text-center w-full space-y-1">
                        {/* Product name - uppercase, centered */}
                        <h3 className="text-xs sm:text-sm font-normal text-black uppercase tracking-wide line-clamp-2 leading-tight">
                          {p.name}
                        </h3>

                        {/* Coming Soon badge */}
                        <div className="mt-1">
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sold Out Section */}
        {products.filter(p => p.status === "sold_out").length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center uppercase tracking-wide">
              Sold Out
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
              {products.filter(p => p.status === "sold_out").map((p) => {
                const mediaArr = p.media || [];
                const idxForCard = slideIndex[p.id] ?? 0;
                const currentMedia = mediaArr[idxForCard] || mediaArr[0] || "";

                return (
                  <div
                    key={p.id}
                    className="group relative block bg-white opacity-60"
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
                                    p.id === "p4"
                                      ? "scale-[1.3] md:scale-[1.35]"
                                      : p.id === "p5"
                                        ? "scale-[1.6] md:scale-[1.3]"
                                        : "scale-100 object-contain"
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

                    <div className="pt-3 pb-2 px-2">
                      <div className="flex flex-col items-center text-center w-full space-y-1">
                        {/* Product name - uppercase, centered */}
                        <h3 className="text-xs sm:text-sm font-normal text-black uppercase tracking-wide line-clamp-2 leading-tight">
                          {p.name}
                        </h3>

                        {/* Price if available */}
                        {p.price && (
                          <p className="text-sm text-gray-600">{p.price}</p>
                        )}

                        {/* Sold Out badge */}
                        <div className="mt-1">
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

