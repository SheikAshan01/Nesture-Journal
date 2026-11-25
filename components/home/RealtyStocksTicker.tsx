'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Activity } from 'lucide-react';

interface StockQuote {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  percentChange: number;
}

const DEFAULT_STOCKS: StockQuote[] = [
  { symbol: 'DLF', name: 'DLF Limited', currentValue: 812.40, change: 14.10, percentChange: 1.76 },
  { symbol: 'Godrej Prop', name: 'Godrej Properties', currentValue: 2834.20, change: 58.50, percentChange: 2.11 },
  { symbol: 'Macrotech', name: 'Macrotech Lodha', currentValue: 364.70, change: 3.20, percentChange: 0.88 },
  { symbol: 'Oberoi', name: 'Oberoi Realty', currentValue: 1691.30, change: -7.20, percentChange: -0.42 },
  { symbol: 'Prestige', name: 'Prestige Estates', currentValue: 1428.00, change: 19.60, percentChange: 1.39 },
  { symbol: 'Sobha', name: 'Sobha Limited', currentValue: 1945.50, change: 32.40, percentChange: 1.69 },
  { symbol: 'Brigade', name: 'Brigade Enterprises', currentValue: 1180.20, change: -4.50, percentChange: -0.38 },
  { symbol: 'Phoenix Mills', name: 'Phoenix Mills', currentValue: 1620.00, change: 18.00, percentChange: 1.12 },
];

export default function RealtyStocksTicker() {
  const [stocks, setStocks] = useState<StockQuote[]>(DEFAULT_STOCKS);

  useEffect(() => {
    fetch('/api/market', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data?.stocks?.length) {
          const mapped = data.stocks.map((s: any) => ({
            symbol:
              s.symbol === 'GODREJPROP'
                ? 'Godrej Prop'
                : s.symbol === 'MDBL'
                ? 'Macrotech'
                : s.name.split(' ')[0] || s.symbol,
            name: s.name,
            currentValue: s.currentValue,
            change: s.change,
            percentChange: s.percentChange,
          }));
          setStocks([...mapped, ...DEFAULT_STOCKS.slice(mapped.length)]);
        }
      })
      .catch(() => {});
  }, []);

  // Double the array to provide an uninterrupted continuous CSS marquee loop
  const marqueeStocks = [...stocks, ...stocks];

  return (
    <div className="bg-[#FAFBFB] border-b border-editorialBorder py-2.5 px-3 sm:px-6 lg:px-8 text-xs relative overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 relative">
        {/* Pinned Left Label with Gradient Mask */}
        <div className="z-10 bg-[#FAFBFB] pr-3 flex items-center space-x-2 flex-shrink-0 shadow-[4px_0_8px_-2px_rgba(250,251,251,1)]">
          <div className="flex items-center space-x-1.5 text-editorialText-primary font-bold text-[11px] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <TrendingUp size={14} className="text-emerald-brand flex-shrink-0" />
            <span className="whitespace-nowrap tracking-tight font-serif text-[12px] sm:text-[13px]">
              Realty Stocks
            </span>
            <span className="text-gray-300 font-normal ml-1">|</span>
          </div>
        </div>

        {/* Center Marquee Infinite Moving Ribbon */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker-marquee flex items-center space-x-6 py-0.5">
            {marqueeStocks.map((stk, idx) => {
              const isPositive = stk.percentChange >= 0;
              return (
                <Link
                  key={`${stk.symbol}-${idx}`}
                  href="/realty-stocks"
                  className="flex items-center space-x-1.5 font-sans whitespace-nowrap text-[11px] sm:text-xs hover:bg-emerald-50/70 px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer group"
                >
                  <span className="font-bold text-editorialText-primary group-hover:text-emerald-brand transition">
                    {stk.symbol}
                  </span>
                  <span className="font-mono text-gray-700 font-medium">
                    ₹{stk.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold px-1 rounded ${
                      isPositive ? 'text-emerald-brand bg-emerald-50' : 'text-red-500 bg-red-50'
                    }`}
                  >
                    {isPositive ? '▲ +' : '▼ '}
                    {Math.abs(stk.percentChange).toFixed(2)}%
                  </span>
                  <span className="text-gray-300 ml-2 font-normal">|</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pinned Right CTA with Gradient Mask */}
        <div className="z-10 bg-[#FAFBFB] pl-3 flex items-center space-x-2.5 flex-shrink-0 shadow-[-4px_0_8px_-2px_rgba(250,251,251,1)]">
          <span className="hidden lg:inline-block text-[9px] text-gray-500 font-mono uppercase bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-semibold">
            DEMO DATA
          </span>
          <Link
            href="/realty-stocks"
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border border-emerald-brand/40 text-emerald-brand hover:bg-emerald-brand hover:text-white transition-all duration-200 text-[11px] sm:text-xs font-semibold whitespace-nowrap shadow-xs btn-press"
          >
            <span>View Market</span>
            <ArrowRight size={12} className="flex-shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
