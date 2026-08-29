import { db } from '@/lib/db';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalDistributors: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalProducts, totalCategories, totalUsers, totalDistributors] =
    await Promise.all([
      db.product.count({ where: { isActive: true } }),
      db.category.count(),
      db.user.count(),
      db.distributor.count({ where: { isActive: true } }),
    ]);

  return { totalProducts, totalCategories, totalUsers, totalDistributors };
}
