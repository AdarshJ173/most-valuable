import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="mx-auto w-full max-w-lg px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Payment successful — you&#39;re entered.
        </h1>
        <p className="mt-4 text-white/80">
          Thank you for purchasing your raffle entries. A receipt has been emailed to you by Stripe.
          Your entries have been recorded — good luck!
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Back to shop
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
