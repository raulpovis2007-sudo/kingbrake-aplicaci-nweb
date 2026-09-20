import { db } from '@/lib/db';

export interface DashboardStats {
  totalProducts: number;
  pendingQuotes: number;
  totalUsers: number;
  totalDistributors: number;
}

export interface RecentQuote {
  id: string;
  productName: string;
  productSku: string;
  productPrice: number;
  status: string;
  createdAt: Date;
  user: { name: string; email: string };
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  images: string[];
}

export interface TopQuotedProduct {
  name: string;
  sku: string;
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalProducts, pendingQuotes, totalUsers, totalDistributors] =
    await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.quote.count({ where: { status: 'PENDING' } }),
      db.user.count(),
      db.distributor.count({ where: { isActive: true } }),
    ]);

  return { totalProducts, pendingQuotes, totalUsers, totalDistributors };
}

export async function getRecentQuotes(): Promise<RecentQuote[]> {
  return db.quote.findMany({
    take: 7,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      productName: true,
      productSku: true,
      productPrice: true,
      status: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
    },
  });
}

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  return db.product.findMany({
    where: { isActive: true, stock: { lte: 5 } },
    select: { id: true, name: true, sku: true, stock: true, images: true },
    orderBy: { stock: 'asc' },
    take: 8,
  });
}

export async function getTopQuotedProducts(): Promise<TopQuotedProduct[]> {
  const quotes = await db.quote.groupBy({
    by: ['productName', 'productSku'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  });

  return quotes.map((q) => ({
    name: q.productName,
    sku: q.productSku,
    count: q._count.id,
  }));
}
