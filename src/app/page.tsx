"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);
  
  const router = useRouter();
  const addLead = useMutation(api.leads.addLead);

  // Countdown timer effect for redirect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showSuccess && redirectCountdown > 0) {
      interval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            // Redirect to shop page
            router.push('/shop');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showSuccess, redirectCountdown, router]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await addLead({
        email: email.toLowerCase().trim(),
        phone: phone.trim() || undefined,
        source: "landing_page"
      });
      
      setShowSuccess(true);
      setEmail("");
      setPhone("");
      
      // Start countdown timer (4 seconds)
      setRedirectCountdown(4);
      
    } catch (error) {
      console.error("Failed to add lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShopNow = () => {
    window.location.href = "/shop";
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/IMG_7627.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <Image src="/LogoWhite.png" alt="Most Valuable" width={120} height={34} className="h-8 w-auto" priority />
        <nav className="hidden sm:flex items-center space-x-4 text-white/80 text-sm">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
        </nav>
      </header>

      {/* Main content - centered */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6 -mt-16">
        <div className="w-full max-w-md">
          {/* Centered card - completely transparent on mobile, visible on desktop */}
          <div className="bg-transparent sm:bg-white/10 backdrop-blur-none sm:backdrop-blur-md border-transparent sm:border-white/20 rounded-2xl p-8 shadow-none sm:shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-6">
              <Image 
                src="/LogoWhite.png" 
                alt="Most Valuable" 
                width={200} 
                height={56} 
                className="mx-auto h-12 w-auto" 
              />
            </div>

            {/* Tagline */}
            <h1 className="text-white text-center text-xl font-semibold mb-2">
              Timeless pieces for modern living
            </h1>
            
            <p className="text-white/80 text-center text-sm mb-4">
              Enter our exclusive raffle for premium lifestyle products
            </p>
            
            {/* Free Entry Highlight */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur border border-green-400/30 rounded-lg p-3 mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-green-400">✨</span>
                <span className="text-white font-semibold text-sm">FREE RAFFLE ENTRY</span>
                <span className="text-green-400">✨</span>
              </div>
              <p className="text-white/90 text-xs text-center">
                Get 1 free raffle entry just for joining! 🎫
              </p>
            </div>

            {/* Form */}
            {!showSuccess ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Join Waitlist"}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 bg-green-500/20 backdrop-blur border border-green-400/50 rounded-xl mb-4">
                <div className="text-green-400 font-semibold text-lg mb-2">✅ You&apos;re In The Raffle!</div>
                <p className="text-white/90 text-sm mb-2">You&apos;ve been successfully added to our waitlist!</p>
                <div className="bg-white/10 rounded-lg p-2 mb-3">
                  <p className="text-yellow-300 text-sm font-medium">
                    🎫 Free Entry Added!
                  </p>
                  <p className="text-white/80 text-xs">
                    You now have 1 raffle entry
                  </p>
                </div>
                {redirectCountdown > 0 && (
                  <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      <span className="text-white/80 text-sm">Taking you to shop...</span>
                    </div>
                    <div className="text-white font-mono text-xl">
                      {redirectCountdown}
                    </div>
                    <div className="text-white/60 text-xs mt-1 mb-2">
                      Redirecting in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}
                    </div>
                    <button
                      onClick={() => {
                        setRedirectCountdown(0);
                        setShowSuccess(false);
                      }}
                      className="text-xs text-white/60 hover:text-white underline transition-colors"
                    >
                      Cancel redirect
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Shop button */}
            <div className="mt-6">
              <button
                onClick={handleShopNow}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Shop Now
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex justify-center items-center gap-4 mt-6 text-white/70 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-green-400">🔒</span>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-blue-400">⚡</span>
                <span>Instant</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">🏆</span>
                <span>Fair</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-4 text-center text-white/50 text-xs">
        <p>© 2025 Most Valuable. All rights reserved.</p>
      </footer>
    </div>
  );
}
