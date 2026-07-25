import { useLocation, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/i18n/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const { isEnglish } = useLanguage();

  const homePath = isEnglish ? '/en' : '/';

  return (
    <Layout>
      <SEOHead
        title={isEnglish ? '404 — Page not found' : '404 — Seite nicht gefunden'}
        description={isEnglish ? 'The page you were looking for could not be found.' : 'Die gesuchte Seite konnte nicht gefunden werden.'}
        noIndex
      />

      <section className="relative overflow-hidden min-h-[80vh] flex items-center py-20 sm:py-28">
        <div className="absolute inset-0 grid-pattern opacity-[0.06]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 noise-overlay opacity-[0.04]" />

        <div className="container-section relative w-full">
          <div className="grid grid-cols-12 gap-6 lg:gap-12 items-center">
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-foreground/40" />
                <span className="font-editorial text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  {isEnglish ? 'Error / 404' : 'Fehler / 404'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs break-words">
                <span className="block font-editorial text-xs tracking-[0.2em] uppercase mb-1">
                  {isEnglish ? 'Requested path' : 'Angeforderter Pfad'}
                </span>
                <code className="text-foreground/80 text-xs">{location.pathname}</code>
              </p>
            </aside>

            <div className="col-span-12 lg:col-span-9">
              <div className="font-editorial text-[8rem] sm:text-[12rem] lg:text-[16rem] font-bold leading-none text-aurora tracking-tighter">
                404
              </div>
              <h1 className="mt-4 font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                {isEnglish ? (
                  <>This page <em className="italic text-aurora">drifted off.</em></>
                ) : (
                  <>Diese Seite <em className="italic text-aurora">ist verschwunden.</em></>
                )}
              </h1>
              <p className="mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {isEnglish
                  ? 'The link you followed may be broken, or the page may have been moved. Let\u2019s get you back on track.'
                  : 'Der Link ist möglicherweise defekt oder die Seite wurde verschoben. Wechseln Sie zurück zur Startseite oder starten Sie den Audit.'}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to={homePath}
                  className="group inline-flex items-center gap-3 border-aurora bg-background/40 backdrop-blur-md px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:bg-background/60 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  {isEnglish ? 'Back to Home' : 'Zur Startseite'}
                </Link>
                <Link
                  to={isEnglish ? '/en/audit' : '/audit'}
                  className="group inline-flex items-center gap-3 border border-foreground/40 px-6 py-4 font-editorial text-sm font-semibold tracking-[0.2em] uppercase hover:border-foreground transition-all"
                >
                  {isEnglish ? 'Start free audit' : 'Kostenlosen Audit starten'}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
