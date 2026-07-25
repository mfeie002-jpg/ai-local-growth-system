import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/i18n/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UTMTracker } from '@/components/UTMTracker';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { Layout } from '@/components/Layout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const PlatformPage = lazy(() => import('@/pages/PlatformPage'));
const AuditV0Page = lazy(() => import('@/pages/AuditV0Page'));
const AuditV0ResultPage = lazy(() => import('@/pages/AuditV0ResultPage'));
const CaseStudiesPage = lazy(() => import('@/pages/CaseStudiesPage'));
const ImprintPage = lazy(() => import('@/pages/ImprintPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const OAuthConsent = lazy(() => import('@/pages/OAuthConsent'));

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminLeadsPage = lazy(() => import('@/pages/admin/AdminLeadsPage'));
const AdminLeadDetailPage = lazy(() => import('@/pages/admin/AdminLeadDetailPage'));
const AdminCallsPage = lazy(() => import('@/pages/admin/AdminCallsPage'));
const AdminCallDetailPage = lazy(() => import('@/pages/admin/AdminCallDetailPage'));
const AdminVoiceSetupPage = lazy(() => import('@/pages/admin/AdminVoiceSetupPage'));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-background" role="status">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Loading
      </span>
    </div>
  );
}

function PublicRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en" element={<HomePage />} />

        <Route path="/ai-business-audit" element={<PlatformPage page="ai-business-audit" />} />
        <Route path="/en/ai-business-audit" element={<PlatformPage page="ai-business-audit" />} />
        <Route path="/website-audit" element={<PlatformPage page="website-audit" />} />
        <Route path="/en/website-audit" element={<PlatformPage page="website-audit" />} />
        <Route path="/seo-analyse" element={<PlatformPage page="seo-analyse" />} />
        <Route path="/en/seo-analysis" element={<PlatformPage page="seo-analyse" />} />
        <Route path="/ai-visibility" element={<PlatformPage page="ai-visibility" />} />
        <Route path="/en/ai-visibility" element={<PlatformPage page="ai-visibility" />} />
        <Route path="/automation" element={<PlatformPage page="automation" />} />
        <Route path="/en/automation" element={<PlatformPage page="automation" />} />
        <Route path="/leistungen" element={<PlatformPage page="leistungen" />} />
        <Route path="/en/services" element={<PlatformPage page="leistungen" />} />
        <Route path="/fuer-kmu" element={<PlatformPage page="fuer-kmu" />} />
        <Route path="/en/for-smes" element={<PlatformPage page="fuer-kmu" />} />
        <Route path="/partner" element={<PlatformPage page="partner" />} />
        <Route path="/en/partners" element={<PlatformPage page="partner" />} />
        <Route path="/ueber-uns" element={<PlatformPage page="ueber-uns" />} />
        <Route path="/en/about" element={<PlatformPage page="ueber-uns" />} />
        <Route path="/kontakt" element={<PlatformPage page="kontakt" />} />
        <Route path="/en/contact" element={<PlatformPage page="kontakt" />} />
        <Route path="/insights" element={<PlatformPage page="insights" />} />
        <Route path="/en/insights" element={<PlatformPage page="insights" />} />

        <Route path="/audit" element={<Layout><AuditV0Page lang="de" /></Layout>} />
        <Route path="/audit/r/:token" element={<Layout><AuditV0ResultPage lang="de" /></Layout>} />
        <Route path="/en/audit" element={<Layout><AuditV0Page lang="en" /></Layout>} />
        <Route path="/en/audit/r/:token" element={<Layout><AuditV0ResultPage lang="en" /></Layout>} />

        <Route path="/fallstudien" element={<CaseStudiesPage />} />
        <Route path="/en/case-studies" element={<CaseStudiesPage />} />
        <Route path="/impressum" element={<ImprintPage />} />
        <Route path="/en/imprint" element={<ImprintPage />} />
        <Route path="/datenschutz" element={<PrivacyPage />} />
        <Route path="/en/privacy" element={<PrivacyPage />} />

        {/* Retire the unaudited legacy scanner without deleting historical data. */}
        <Route path="/analyse/progress/:token" element={<Navigate to="/audit" replace />} />
        <Route path="/en/analysis/progress/:token" element={<Navigate to="/en/audit" replace />} />
        <Route path="/analyse/:token" element={<Navigate to="/audit" replace />} />
        <Route path="/en/analysis/:token" element={<Navigate to="/en/audit" replace />} />

        {/* Canonicalize legacy public routes into the focused launch architecture. */}
        <Route path="/gratis-audit" element={<Navigate to="/audit" replace />} />
        <Route path="/en/free-audit" element={<Navigate to="/en/audit" replace />} />
        <Route path="/gratis-call" element={<Navigate to="/kontakt" replace />} />
        <Route path="/en/free-call" element={<Navigate to="/en/contact" replace />} />
        <Route path="/pakete" element={<Navigate to="/leistungen" replace />} />
        <Route path="/preise" element={<Navigate to="/leistungen" replace />} />
        <Route path="/en/pricing" element={<Navigate to="/en/services" replace />} />
        <Route path="/system" element={<Navigate to="/ueber-uns" replace />} />
        <Route path="/en/system" element={<Navigate to="/en/about" replace />} />
        <Route path="/faq" element={<Navigate to="/ai-business-audit" replace />} />
        <Route path="/en/faq" element={<Navigate to="/en/ai-business-audit" replace />} />
        <Route path="/ultimate-package" element={<Navigate to="/leistungen" replace />} />
        <Route path="/en/ultimate-package" element={<Navigate to="/en/services" replace />} />
        <Route path="/demo" element={<Navigate to="/audit" replace />} />
        <Route path="/en/demo" element={<Navigate to="/en/audit" replace />} />
        <Route path="/scan" element={<Navigate to="/audit" replace />} />
        <Route path="/en/scan" element={<Navigate to="/en/audit" replace />} />
        <Route path="/investoren" element={<Navigate to="/" replace />} />
        <Route path="/en/investors" element={<Navigate to="/en" replace />} />
        <Route path="/blog" element={<Navigate to="/insights" replace />} />
        <Route path="/blog/:slug" element={<Navigate to="/insights" replace />} />
        <Route path="/en/blog" element={<Navigate to="/en/insights" replace />} />
        <Route path="/en/blog/:slug" element={<Navigate to="/en/insights" replace />} />
        <Route path="/services/ki-implementierung" element={<Navigate to="/automation" replace />} />
        <Route path="/en/services/ai-implementation" element={<Navigate to="/en/automation" replace />} />
        <Route path="/services/seo" element={<Navigate to="/seo-analyse" replace />} />
        <Route path="/en/services/seo" element={<Navigate to="/en/seo-analysis" replace />} />
        <Route path="/services/sea" element={<Navigate to="/leistungen" replace />} />
        <Route path="/en/services/sea" element={<Navigate to="/en/services" replace />} />
        <Route path="/services/reputation" element={<Navigate to="/website-audit" replace />} />
        <Route path="/en/services/reputation" element={<Navigate to="/en/website-audit" replace />} />
        <Route path="/services/design-entwicklung" element={<Navigate to="/website-audit" replace />} />
        <Route path="/en/services/design-development" element={<Navigate to="/en/website-audit" replace />} />
        <Route path="/services/brand-deployment" element={<Navigate to="/leistungen" replace />} />
        <Route path="/en/services/brand-deployment" element={<Navigate to="/en/services" replace />} />
        <Route path="/services/social-media" element={<Navigate to="/leistungen" replace />} />
        <Route path="/en/services/social-media" element={<Navigate to="/en/services" replace />} />

        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
        <Route path="/admin/leads/:id" element={<AdminLeadDetailPage />} />
        <Route path="/admin/calls" element={<AdminCallsPage />} />
        <Route path="/admin/calls/:id" element={<AdminCallDetailPage />} />
        <Route path="/admin/voice/setup" element={<AdminVoiceSetupPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/reports/:id" element={<Navigate to="/admin/reports" replace />} />
        <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <UTMTracker />
              <AnalyticsTracker />
              <PublicRoutes />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
