import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { NeuralBackdrop } from './neural/NeuralBackdrop';
import { CookieBanner } from './CookieBanner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NeuralBackdrop />
      <Header />
      <main className="relative flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
