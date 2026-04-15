import Layout from '@/components/Layout';
import { useLanguage } from '@/i18n/LanguageContext';
import { AnalysisRequestForm } from '@/components/forms/AnalysisRequestForm';
import SEOHead from '@/components/SEOHead';

export default function ScanPage() {
  const { isEnglish } = useLanguage();

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? 'Free Business Scanner | itsFeierabend' : 'Gratis Business Scanner | itsFeierabend'}
        description={isEnglish ? 'Get a free AI-powered analysis of your website.' : 'Erhalte eine kostenlose KI-gestützte Analyse deiner Website.'}
      />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <AnalysisRequestForm variant="hero" />
        </div>
      </div>
    </Layout>
  );
}
