import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper with header and footer
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isScrollStackPage = location.pathname === '/mind-maps';

  return (
    <div className={`flex min-h-screen flex-col ${isScrollStackPage ? 'h-screen overflow-hidden' : ''}`}>
      <Header />
      <main className={`flex-1 ${isScrollStackPage ? '' : 'pt-20'}`}>{children}</main>
      {!isScrollStackPage && <Footer />}
    </div>
  );
}
