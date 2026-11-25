import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const marketData = await prisma.marketData.findMany({
      orderBy: { symbol: 'asc' },
    });

    const stocks = marketData.filter((m) => m.category === 'STOCK');
    const index = marketData.find((m) => m.category === 'INDEX');
    const kpis = marketData.filter((m) => m.category.startsWith('KPI_'));

    return NextResponse.json({
      notice: 'DEMO DATA — NOT LIVE MARKET INFORMATION.',
      stocks,
      index: index
        ? {
            ...index,
            dataPoints: index.dataPoints ? JSON.parse(index.dataPoints) : [],
          }
        : null,
      kpis,
    });
  } catch (error: any) {
    console.error('Market data fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve market data' }, { status: 500 });
  }
}
