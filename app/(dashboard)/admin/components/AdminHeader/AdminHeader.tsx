'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Menu, X, LogOut } from 'lucide-react';
import styles from './AdminHeader.module.css';

interface AdminHeaderProps {
  userName: string;
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
}

export function AdminHeader({ userName, onToggleSidebar, sidebarOpen }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <button
          className={styles.hamburger}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h1 className={styles.pageTitle}>Administración</h1>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userMenuWrapper} ref={menuRef}>
          <button
            className={styles.userInfo}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <div className={styles.avatar}>{initials}</div>
            <span className={styles.userName}>{userName}</span>
          </button>

          {menuOpen && (
            <div className={styles.dropdown} role="menu">
              <button
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
