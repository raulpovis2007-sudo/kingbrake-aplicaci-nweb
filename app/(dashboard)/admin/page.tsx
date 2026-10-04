import Link from 'next/link';
import {
  Package,
  ClipboardList,
  Users,
  MapPin,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react';
import {
  getDashboardStats,
  getRecentQuotes,
  getTopQuotedProducts,
} from '@/services/admin/admin.server';
import { MetricCard } from './components/MetricCard/MetricCard';
import styles from './Dashboard.module.css';

const STATUS_MAP: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: 'Pendiente', className: 'pending', icon: Clock },
  CONFIRMED: { label: 'Confirmado', className: 'confirmed', icon: CheckCircle },
  DELIVERED: { label: 'Entregado', className: 'delivered', icon: Truck },
  CANCELLED: { label: 'Cancelado', className: 'cancelled', icon: XCircle },
};

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export default async function AdminDashboardPage() {
  const [stats, recentQuotes, topQuoted] = await Promise.all([
    getDashboardStats(),
    getRecentQuotes(),
    getTopQuotedProducts(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Resumen general de King Brake</p>
      </div>

      {/* Metric cards */}
      <div className={styles.metricsGrid}>
        <MetricCard title="Productos activos" value={stats.totalProducts} icon={Package} color="blue" />
        <MetricCard title="Cotizaciones pendientes" value={stats.pendingQuotes} icon={ClipboardList} color="yellow" />
        <MetricCard title="Usuarios registrados" value={stats.totalUsers} icon={Users} color="green" />
        <MetricCard title="Distribuidores" value={stats.totalDistributors} icon={MapPin} color="red" />
      </div>

      {/* Recent quotes */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <ClipboardList size={18} />
            Últimas cotizaciones
          </h2>
          <Link href="/admin/cotizaciones" className={styles.cardLink}>
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <p className={styles.emptyText}>Aún no hay cotizaciones.</p>
        ) : (
          <div className={styles.quoteList}>
            {recentQuotes.map((q) => {
              const st = STATUS_MAP[q.status] || STATUS_MAP.PENDING;
              const Icon = st.icon;
              return (
                <Link href="/admin/cotizaciones" key={q.id} className={styles.quoteRow}>
                  <div className={styles.quoteInfo}>
                    <span className={styles.quoteName}>{q.user.name}</span>
                    <span className={styles.quoteProduct}>{q.productName}</span>
                  </div>
                  <div className={styles.quoteMeta}>
                    <span className={`${styles.quoteBadge} ${styles[st.className]}`}>
                      <Icon size={12} />
                      {st.label}
                    </span>
                    <span className={styles.quoteTime}>{timeAgo(q.createdAt)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Top quoted products */}
      {topQuoted.length > 0 && (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <TrendingUp size={18} />
              Productos más cotizados
            </h2>
          </div>
          <div className={styles.topList}>
            {topQuoted.map((p, i) => (
              <div key={p.sku} className={styles.topRow}>
                <span className={styles.topRank}>#{i + 1}</span>
                <div className={styles.topInfo}>
                  <span className={styles.topName}>{p.name}</span>
                  <span className={styles.topSku}>{p.sku}</span>
                </div>
                <span className={styles.topCount}>
                  {p.count} cotización{p.count !== 1 ? 'es' : ''}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
