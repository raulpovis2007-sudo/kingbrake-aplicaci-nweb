'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './components/AdminSidebar/AdminSidebar';
import { AdminHeader } from './components/AdminHeader/AdminHeader';
import styles from './AdminLayout.module.css';

interface MaintenanceState {
  enabled: boolean;
  message: string;
}

function MaintenanceBanner() {
  const [state, setState] = useState<MaintenanceState | null>(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/maintenance').then(r => r.ok ? r.json() : null).then(d => {
      if (d) setState(d);
    });
  }, []);

  async function toggle(enable: boolean) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: enable,
          message: enable ? (message.trim() || undefined) : state?.message,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  if (!state) return null;

  if (editing) {
    return (
      <div style={{
        background: '#fef3c7', borderBottom: '1px solid #f59e0b',
        padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center',
        gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.875rem',
      }}>
        <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>Mensaje:</span>
        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Estamos realizando mejoras en nuestro sitio. Volveremos pronto."
          style={{
            flex: 1, minWidth: '200px', padding: '0.375rem 0.625rem',
            border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem',
          }}
        />
        <button
          onClick={() => toggle(true)}
          disabled={saving}
          style={{
            background: '#dc2626', color: '#fff', border: 'none',
            padding: '0.375rem 1rem', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Activando...' : 'Activar'}
        </button>
        <button
          onClick={() => setEditing(false)}
          style={{
            background: 'transparent', border: '1px solid #9ca3af', color: '#374151',
            padding: '0.375rem 1rem', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.8125rem', whiteSpace: 'nowrap',
          }}
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (state.enabled) {
    return (
      <div style={{
        background: '#fef2f2', borderBottom: '2px solid #dc2626',
        padding: '0.625rem 1.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
        fontSize: '0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span style={{ fontWeight: 700, color: '#dc2626' }}>MODO MANTENIMIENTO ACTIVO</span>
          <span style={{ color: '#6b7280', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            — {state.message}
          </span>
        </div>
        <button
          onClick={() => toggle(false)}
          disabled={saving}
          style={{
            background: '#16a34a', color: '#fff', border: 'none',
            padding: '0.375rem 1rem', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.8125rem', whiteSpace: 'nowrap',
          }}
        >
          {saving ? 'Desactivando...' : 'Desactivar'}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
      padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', fontSize: '0.8125rem', color: '#6b7280',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>🔧</span>
        <span>Modo mantenimiento desactivado</span>
      </div>
      <button
        onClick={() => { setMessage(state.message); setEditing(true); }}
        style={{
          background: 'transparent', border: '1px solid #d1d5db', color: '#374151',
          padding: '0.25rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
          fontSize: '0.8125rem', fontWeight: 500,
        }}
      >
        Activar
      </button>
    </div>
  );
}

interface AdminLayoutClientProps {
  userName: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({ userName, children }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem('admin-sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <>
    <MaintenanceBanner />
    <div className={`${styles.container} ${collapsed ? styles.containerCollapsed : ''}`}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      <div className={styles.mainArea}>
        <AdminHeader
          userName={userName}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          sidebarOpen={sidebarOpen}
        />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
    </>
  );
}
