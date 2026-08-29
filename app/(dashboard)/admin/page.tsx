import { Package, Layers, Users, MapPin } from 'lucide-react';
import { getDashboardStats } from '@/services/admin/admin.server';
import { MetricCard } from './components/MetricCard/MetricCard';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Resumen general</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <MetricCard
          title="Productos"
          value={stats.totalProducts}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Categorías"
          value={stats.totalCategories}
          icon={Layers}
          color="yellow"
        />
        <MetricCard
          title="Usuarios"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Distribuidores"
          value={stats.totalDistributors}
          icon={MapPin}
          color="red"
        />
      </div>
    </div>
  );
}
