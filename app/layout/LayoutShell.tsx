'use client';

import { usePathname } from 'next/navigation';
import NavBar from './navBar/NavBar';
import Footer from './footer/Footer';
import WhatsappFlotante from './whatsappFlotante/WhatsappFlotante';


const ADMIN_ROUTES = ['/admin'];

const LEGAL_ROUTES = [
  '/terminos-y-condiciones',
  '/politica-de-privacidad',
  '/politica-de-cambios-y-devoluciones',
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAdminRoute) return <>{children}</>;

  const isLegalRoute = LEGAL_ROUTES.some((route) => pathname === route);

  if (isLegalRoute) return <>{children}</>;

  return (
    <>
      <NavBar />
      {children}
      <Footer />
      <WhatsappFlotante />
    </>
  );
}
