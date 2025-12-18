import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";

// Pages
import HomePage from "./pages/HomePage";
import AuditPage from "./pages/AuditPage";
import CallPage from "./pages/CallPage";
import SystemPage from "./pages/SystemPage";
import PricingPage from "./pages/PricingPage";
import FAQPage from "./pages/FAQPage";
import ImprintPage from "./pages/ImprintPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* DE Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gratis-audit" element={<AuditPage />} />
            <Route path="/gratis-call" element={<CallPage />} />
            <Route path="/system" element={<SystemPage />} />
            <Route path="/pakete" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/impressum" element={<ImprintPage />} />
            <Route path="/datenschutz" element={<PrivacyPage />} />
            
            {/* EN Routes */}
            <Route path="/en" element={<HomePage />} />
            <Route path="/en/free-audit" element={<AuditPage />} />
            <Route path="/en/free-call" element={<CallPage />} />
            <Route path="/en/system" element={<SystemPage />} />
            <Route path="/en/pricing" element={<PricingPage />} />
            <Route path="/en/faq" element={<FAQPage />} />
            <Route path="/en/imprint" element={<ImprintPage />} />
            <Route path="/en/privacy" element={<PrivacyPage />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
