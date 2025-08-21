"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { RaffleCountdownTimer } from "@/components/RaffleCountdownTimer";

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
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/90">
      {label}
    </span>
  );
}

function Media({ src, alt }: { src: string; alt: string }) {
  const url = mediaUrl(src);
  const isVideo = /\.(mp4|mov)$/i.test(url);
  return isVideo ? (
    <video className="absolute inset-0 h-full w-full object-cover" src={url} autoPlay loop muted playsInline />
  ) : (
    <Image src={url} alt={alt} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover" />
  );
}

export default function ShopPage() {
  // Track selected variant per product (tees 1-3)
  const initial: VariantState = useMemo(() => {
    const map: VariantState = {};
    for (const p of products) {
      if (p.variants?.length) map[p.id] = p.variants[0].id;
    }
    return map;
  }, []);
  const [selected, setSelected] = useState<VariantState>(initial);
  const [loadingQty, setLoadingQty] = useState<number | null>(null);

  function handleBuyClick(quantity: number) {
    // Redirect to checkout page with quantity parameter
    window.location.href = `/checkout?quantity=${quantity}`;
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* No background video on /shop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(800px at 15% 10%, rgba(255, 0, 128, 0.28), transparent 60%)," +
            "radial-gradient(700px at 85% 15%, rgba(0, 200, 255, 0.25), transparent 60%)," +
            "radial-gradient(700px at 20% 85%, rgba(255, 200, 0, 0.22), transparent 60%)," +
            "radial-gradient(900px at 90% 85%, rgba(100, 255, 150, 0.20), transparent 60%)," +
            "linear-gradient(180deg, #0b0f1a 0%, #0d0c1f 40%, #111827 100%)",
          backgroundBlendMode: "screen, screen, screen, screen, normal",
        }}
      />

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10">
          {/* Main Header Row */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row mb-6">
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="MV home" className="inline-flex items-center">
                <Image src="/LogoWhite.png" alt="MV logo" width={200} height={56} className="h-14 w-auto sm:h-16" priority />
              </Link>
              <h1 className="text-3xl font-semibold tracking-tight">Most Valuable — Shop</h1>
            </div>
          </div>

          {/* Raffle Timer Section */}
          <div className="flex justify-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg max-w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-white/80">🎯 Raffle</span>
              </div>
              <RaffleCountdownTimer className="sm:border-l border-white/20 sm:pl-4" />
            </div>
          </div>
        </header>


        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, idx) => {
            const hasVariants = !!p.variants?.length;
            const activeVar = hasVariants ? p.variants!.find(v => v.id === selected[p.id]) ?? p.variants![0] : undefined;
            const firstMedia = hasVariants ? activeVar!.media[0] : p.media?.[0] ?? "";

            return (
              <div
                key={p.id}
                className={`group relative rounded-xl border border-white/10 text-white p-5 shadow-sm transition duration-300 will-change-transform hover:-translate-y-1 hover:shadow-lg focus-within:shadow-lg animate-fade-up animate-delay-${(idx % 5) + 1}`}
                style={{
                  backgroundImage:
                    "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 60%)," +
                    "linear-gradient(180deg, #2a2f3a 0%, #111827 100%)",
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-800/30 ring-1 ring-white/10">
                  {firstMedia && <Media src={firstMedia} alt={p.name} />}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{p.name}</h3>
                    <p className="text-sm text-slate-300 capitalize">{p.category}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {hasVariants && (
                  <div className="mt-3 flex gap-2">
                    {p.variants!.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        aria-label={`Select ${v.color}`}
                        onClick={() => setSelected((s) => ({ ...s, [p.id]: v.id }))}
                        className={`h-8 rounded-full px-3 text-xs font-medium ring-1 ring-white/20 transition ${
                          selected[p.id] === v.id ? "bg-white text-slate-900" : "bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        {v.color}
                      </button>
                    ))}
                  </div>
                )}

                {p.status === "available" && (
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setLoadingQty(1);
                        handleBuyClick(1);
                      }}
                      className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
                    >
                      {loadingQty === 1 ? "Redirecting…" : "+1 entry — $25"}
                    </button>
                    <button
                      onClick={() => {
                        setLoadingQty(5);
                        handleBuyClick(5);
                      }}
                      className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                      {loadingQty === 5 ? "Redirecting…" : "+5 entries — $100"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

