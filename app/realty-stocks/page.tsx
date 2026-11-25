import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RealtyStocksTicker from '@/components/home/RealtyStocksTicker';
import prisma from '@/lib/db';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Realty Stocks & Real Estate Equities | Nesture Journal',
  description:
    'Monitor key developer equities, real estate indices, and REIT performance.',
  alternates: { canonical: '/realty-stocks' },
};

export const revalidate = 60;

export default async function RealtyStocksPage() {
  const stocks = await prisma.marketData.findMany({
    where: { category: 'STOCK' },
    orderBy: { currentValue: 'desc' },
  });

  return (
    <>
      <Header />
      <RealtyStocksTicker />

      <main className="flex-1 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        <nav className="flex items-center space-x-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-brand">
            Home
          </Link>
          <span>/</span>
          <span className="text-editorialText-primary font-medium">Realty Stocks</span>
        </nav>

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-3 text-amber-800 text-xs font-medium">
          <Info size={18} className="flex-shrink-0 text-amber-600" />
          <span>
            <strong>DEMO DATA — NOT LIVE MARKET INFORMATION.</strong> Listed quotes are mock historical demo figures for local development and UI testing.
          </span>
        </div>

        <div className="border-b border-editorialBorder pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-1.5 h-6 bg-emerald-brand rounded-full"></div>
            <h1 className="font-serif font-bold text-3xl text-editorialText-primary tracking-tight">
              Realty Equities & Listed Developers
            </h1>
          </div>
          <p className="text-sm text-editorialText-secondary">
            Benchmark listed property developers and real estate investment trusts.
          </p>
        </div>

        {/* Equities Table */}
        <div className="bg-white rounded-2xl border border-editorialBorder shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFB] border-b border-editorialBorder text-xs text-editorialText-secondary uppercase">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Symbol</th>
                  <th className="py-3.5 px-6 font-semibold">Developer Name</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Price (INR)</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Day Change</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Movement (%)</th>
                  <th className="py-3.5 px-6 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorialBorder">
                {stocks.map((stk) => {
                  const isPositive = stk.percentChange >= 0;
                  return (
                    <tr key={stk.id} className="hover:bg-softBg transition">
                      <td className="py-4 px-6 font-mono font-bold text-editorialText-primary">
                        {stk.symbol}
                      </td>
                      <td className="py-4 px-6 font-semibold text-editorialText-primary">
                        {stk.name}
                      </td>
                      <td className="py-4 px-6 text-right font-mono font-bold text-editorialText-primary">
                        ₹{stk.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`py-4 px-6 text-right font-mono text-xs font-semibold ${isPositive ? 'text-emerald-brand' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{stk.change.toFixed(2)}
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold ${isPositive ? 'text-emerald-brand' : 'text-red-500'}`}>
                        {isPositive ? '▲ +' : '▼ '}{Math.abs(stk.percentChange).toFixed(2)}%
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-gray-600">
                          DEMO DATA
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
