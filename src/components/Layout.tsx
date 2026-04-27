import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PromoSection } from './PromoSection';
import { DemoTeaserSection } from './DemoTeaserSection';
import { NeuralBackdrop } from './neural/NeuralBackdrop';

interface LayoutProps {
  children: ReactNode;
  showPromo?: boolean;
  showDemoTeaser?: boolean;
}

export function Layout({ children, showPromo = false, showDemoTeaser = false }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NeuralBackdrop />
      <Header />
      <main className="relative flex-1">
        {children}
        {showDemoTeaser && <DemoTeaserSection />}
        {showPromo && <PromoSection />}
      </main>
      <Footer />
    </div>
  );
}
