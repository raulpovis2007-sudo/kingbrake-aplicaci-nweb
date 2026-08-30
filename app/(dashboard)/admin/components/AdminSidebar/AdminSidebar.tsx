'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Layers,
  MapPin,
  Users,
  FileText,
  PlayCircle,
  ImageIcon,
  CalendarDays,
  Settings,
  LogOut,
} from 'lucide-react';
import styles from './AdminSidebar.module.css';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Layers },
  { href: '/admin/distribuidores', label: 'Distribuidores', icon: MapPin },
  { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/reels', label: 'Reels', icon: PlayCircle },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}
        role="navigation"
        aria-label="Menú principal"
      >
        <Link href="/admin" className={styles.logo} onClick={onClose}>
          <div className={styles.logoIcon}>KB</div>
          <div className={styles.logoTextContainer}>
            <div className={styles.logoText}>King Brake</div>
            <div className={styles.logoSub}>Panel Admin</div>
          </div>
        </Link>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                onClick={onClose}
                title={item.label}
              >
                <span className={styles.navIcon}>
                  <Icon size={20} />
                </span>
                <span className={styles.navLinkLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Cerrar sesión"
          >
            <span className={styles.navIcon}>
              <LogOut size={20} />
            </span>
            <span className={styles.logoutText}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
