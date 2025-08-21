"use client";

import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export function RaffleCountdownTimer({ className }: { className?: string }) {
  const raffleConfig = useQuery(api.payments.getRaffleConfig);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    if (!raffleConfig) return;

    const updateTimer = () => {
      const now = Date.now();
      const total = raffleConfig.endDate - now;

      if (total <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      const seconds = Math.floor((total / 1000) % 60);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const days = Math.floor(total / (1000 * 60 * 60 * 24));

      setTimeRemaining({ days, hours, minutes, seconds, total });
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [raffleConfig]);

  if (!raffleConfig) {
    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <div className="h-8 w-20 bg-white/10 rounded animate-pulse" />
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  const isActive = raffleConfig.isActive && timeRemaining.total > 0;
  const hasEnded = timeRemaining.total <= 0;

  if (hasEnded) {
    return (
      <div className={`flex items-center gap-2 text-white/80 ${className || ''}`}>
        <div className="flex items-center gap-1">
          <span className="text-lg">🏁</span>
          <span className="text-sm font-medium">Raffle Ended</span>
        </div>
        {raffleConfig.hasWinner && (
          <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
            Winner Selected
          </div>
        )}
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className={`flex items-center gap-2 text-white/60 ${className || ''}`}>
        <span className="text-lg">⏸️</span>
        <span className="text-sm font-medium">Raffle Inactive</span>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className || ''}`}>
      {/* Timer Icon */}
      <div className="flex items-center gap-1">
        <span className="text-base sm:text-lg animate-pulse">⏰</span>
        <span className="text-xs sm:text-sm font-medium text-white/80 hidden sm:inline">
          Ends in
        </span>
      </div>

      {/* Countdown Display */}
      <div className="flex items-center gap-0.5 sm:gap-1 text-white">
        {/* Days */}
        {timeRemaining.days > 0 && (
          <>
            <div className="text-center min-w-[1.5rem] sm:min-w-[2rem]">
              <div className="text-sm sm:text-lg font-bold font-mono leading-none">
                {formatNumber(timeRemaining.days)}
              </div>
              <div className="text-[8px] sm:text-[10px] text-white/60 uppercase tracking-wider">
                D
              </div>
            </div>
            <span className="text-white/40 text-xs sm:text-sm">:</span>
          </>
        )}

        {/* Hours */}
        <div className="text-center min-w-[1.5rem] sm:min-w-[2rem]">
          <div className="text-sm sm:text-lg font-bold font-mono leading-none">
            {formatNumber(timeRemaining.hours)}
          </div>
          <div className="text-[8px] sm:text-[10px] text-white/60 uppercase tracking-wider">
            H
          </div>
        </div>
        
        <span className="text-white/40 text-xs sm:text-sm">:</span>

        {/* Minutes */}
        <div className="text-center min-w-[1.5rem] sm:min-w-[2rem]">
          <div className="text-sm sm:text-lg font-bold font-mono leading-none">
            {formatNumber(timeRemaining.minutes)}
          </div>
          <div className="text-[8px] sm:text-[10px] text-white/60 uppercase tracking-wider">
            M
          </div>
        </div>

        <span className="text-white/40 text-xs sm:text-sm">:</span>

        {/* Seconds */}
        <div className="text-center min-w-[1.5rem] sm:min-w-[2rem]">
          <div className="text-sm sm:text-lg font-bold font-mono leading-none">
            {formatNumber(timeRemaining.seconds)}
          </div>
          <div className="text-[8px] sm:text-[10px] text-white/60 uppercase tracking-wider">
            S
          </div>
        </div>
      </div>

      {/* Entry Count (optional) */}
      {raffleConfig.totalEntries > 0 && (
        <div className="hidden lg:flex items-center gap-1 ml-2 text-white/60 border-l border-white/20 pl-3">
          <span className="text-xs">🎫</span>
          <span className="text-xs font-medium">
            {raffleConfig.totalEntries} entries
          </span>
        </div>
      )}
    </div>
  );
}

export default RaffleCountdownTimer;
