"use client";

import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [notifiedProduct, setNotifiedProduct] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email");
      return;
    }
    
    // Check for pending notification
    const pending = localStorage.getItem("pendingNotification");
    if (pending) {
      setNotifiedProduct(pending);
      localStorage.removeItem("pendingNotification");
    }

    // Success state
    setStatus("success");
    setErrorMessage("");
  };

  return (
    <section id="newsletter" className="w-full bg-[#0a0a0a] py-24 sm:py-32 px-5 sm:px-12 flex flex-col items-center scroll-mt-24">
      <div className="w-full max-w-[640px] mx-auto text-center">
        {/* Overline */}
        <p className="text-white/30 text-[11px] tracking-[0.18em] uppercase font-medium mb-3">
          STAY CONNECTED
        </p>

        {/* Heading */}
        <h2 className="text-white font-bold tracking-tight uppercase" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
          Join The Movement
        </h2>

        {/* Subheading */}
        <p className="text-white/50 text-[15px] leading-[1.7] max-w-[480px] mx-auto mt-4 mb-10 font-light">
          Members get 24-hour early access to every drop. Be first.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1 flex flex-col items-start">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              disabled={status === "success"}
              placeholder="Enter your email"
              className={`w-full h-12 bg-white/5 px-4 text-white text-[14px] outline-none transition-all duration-300 border ${
                status === "error" 
                  ? "border-[#E24B4A]" 
                  : "border-white/25 focus:border-[#C9972B]"
              }`}
              style={{ borderRadius: 0 }}
            />
            {status === "error" && (
              <p className="text-[#E24B4A] text-[12px] mt-2 font-medium">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "success"}
            className={`h-12 px-8 text-[12px] font-bold uppercase tracking-[0.1em] transition-all duration-300 whitespace-nowrap ${
              status === "success"
                ? "bg-[#1D9E75] text-white cursor-default"
                : "bg-[#C9972B] text-black hover:bg-[#b8871f]"
            }`}
            style={{ borderRadius: 0 }}
          >
            {status === "success" ? "✓ You&apos;re in" : "Subscribe"}
          </button>
        </form>

        {status === "success" && notifiedProduct && (
          <p className="text-[#C9972B] text-[13px] mt-4 font-medium tracking-[0.05em] uppercase animate-pulse">
            We&apos;ll notify you when {notifiedProduct} is back in stock.
          </p>
        )}

        {/* Privacy Note */}
        <p className="text-white/20 text-[11px] mt-4 font-light">
          By subscribing, you agree to our{" "}
          <a href="#" className="text-white/35 hover:underline transition-all">
            Privacy Policy
          </a>
        </p>
      </div>
    </section>
  );
}
