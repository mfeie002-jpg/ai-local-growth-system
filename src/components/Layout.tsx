import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PromoSection } from './PromoSection';
import { DemoTeaserSection } from './DemoTeaserSection';

interface LayoutProps {
  children: ReactNode;
  showPromo?: boolean;
  showDemoTeaser?: boolean;
}

export function Layout({ children, showPromo = false, showDemoTeaser = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
        {showDemoTeaser && <DemoTeaserSection />}
        {showPromo && <PromoSection />}
      </main>
      <Footer />
    </div>
  );
}
