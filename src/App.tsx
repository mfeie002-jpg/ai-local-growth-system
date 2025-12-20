import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import AuditPage from "./pages/AuditPage";
import CallPage from "./pages/CallPage";
import SystemPage from "./pages/SystemPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import ImprintPage from "./pages/ImprintPage";
import PrivacyPage from "./pages/PrivacyPage";
import DemoPage from "./pages/DemoPage";
import AuditReportPage from "./pages/AuditReportPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import UltimatePackagePage from "./pages/UltimatePackagePage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import NotFound from "./pages/NotFound";

// Service Pages
import AIImplementationPage from "./pages/services/AIImplementationPage";
import SEOPage from "./pages/services/SEOPage";
import SEAPage from "./pages/services/SEAPage";
import ReputationPage from "./pages/services/ReputationPage";
import DesignDevelopmentPage from "./pages/services/DesignDevelopmentPage";
import BrandDeploymentPage from "./pages/services/BrandDeploymentPage";
import SocialMediaPage from "./pages/services/SocialMediaPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminLeadDetailPage from "./pages/admin/AdminLeadDetailPage";
import AdminCallsPage from "./pages/admin/AdminCallsPage";
import AdminCallDetailPage from "./pages/admin/AdminCallDetailPage";
import AdminVoiceSetupPage from "./pages/admin/AdminVoiceSetupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* DE Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/gratis-audit" element={<AuditPage />} />
              <Route path="/gratis-audit/report/:token" element={<AuditReportPage />} />
              <Route path="/gratis-call" element={<CallPage />} />
              <Route path="/system" element={<SystemPage />} />
              <Route path="/pakete" element={<PricingPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/impressum" element={<ImprintPage />} />
              <Route path="/datenschutz" element={<PrivacyPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/fallstudien" element={<CaseStudiesPage />} />
              <Route path="/ultimate-package" element={<UltimatePackagePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              
              {/* DE Service Routes */}
              <Route path="/services/ki-implementierung" element={<AIImplementationPage />} />
              <Route path="/services/seo" element={<SEOPage />} />
              <Route path="/services/sea" element={<SEAPage />} />
              <Route path="/services/reputation" element={<ReputationPage />} />
              <Route path="/services/design-entwicklung" element={<DesignDevelopmentPage />} />
              <Route path="/services/brand-deployment" element={<BrandDeploymentPage />} />
              <Route path="/services/social-media" element={<SocialMediaPage />} />
              
              {/* EN Routes */}
              <Route path="/en" element={<HomePage />} />
              <Route path="/en/free-audit" element={<AuditPage />} />
              <Route path="/en/free-audit/report/:token" element={<AuditReportPage />} />
              <Route path="/en/free-call" element={<CallPage />} />
              <Route path="/en/system" element={<SystemPage />} />
              <Route path="/en/pricing" element={<PricingPage />} />
              <Route path="/en/faq" element={<FAQPage />} />
              <Route path="/en/imprint" element={<ImprintPage />} />
              <Route path="/en/privacy" element={<PrivacyPage />} />
              <Route path="/en/demo" element={<DemoPage />} />
              <Route path="/en/case-studies" element={<CaseStudiesPage />} />
              <Route path="/en/ultimate-package" element={<UltimatePackagePage />} />
              <Route path="/en/blog" element={<BlogPage />} />
              <Route path="/en/blog/:slug" element={<BlogPostPage />} />
              
              {/* EN Service Routes */}
              <Route path="/en/services/ai-implementation" element={<AIImplementationPage />} />
              <Route path="/en/services/seo" element={<SEOPage />} />
              <Route path="/en/services/sea" element={<SEAPage />} />
              <Route path="/en/services/reputation" element={<ReputationPage />} />
              <Route path="/en/services/design-development" element={<DesignDevelopmentPage />} />
              <Route path="/en/services/brand-deployment" element={<BrandDeploymentPage />} />
              <Route path="/en/services/social-media" element={<SocialMediaPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/leads" element={<AdminLeadsPage />} />
              <Route path="/admin/leads/:id" element={<AdminLeadDetailPage />} />
              <Route path="/admin/calls" element={<AdminCallsPage />} />
              <Route path="/admin/calls/:id" element={<AdminCallDetailPage />} />
              <Route path="/admin/voice/setup" element={<AdminVoiceSetupPage />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
