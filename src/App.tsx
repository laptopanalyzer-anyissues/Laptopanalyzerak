import { Suspense, lazy, ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SecurityProvider } from "@/contexts/SecurityContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/ui/page-loader";
import { CookieConsent } from "@/components/CookieConsent";

// Eager load homepage for instant first paint
import Index from "./pages/Index";

// Auto-reload on stale chunk errors (happens after new deployments)
function lazyRetry(factory: () => Promise<{ default: ComponentType<any> }>) {
  return lazy(() =>
    factory().catch((err) => {
      const hasRefreshed = sessionStorage.getItem("chunk_retry");
      if (!hasRefreshed) {
        sessionStorage.setItem("chunk_retry", "1");
        window.location.reload();
        return new Promise(() => {}); // never resolves — page reloads
      }
      sessionStorage.removeItem("chunk_retry");
      throw err;
    })
  );
}

// Lazy load other pages for better bundle splitting
const Dashboard = lazyRetry(() => import("./pages/Dashboard"));
const DisplayTest = lazy(() => import("./pages/tests/DisplayTest"));
const KeyboardTest = lazy(() => import("./pages/tests/KeyboardTest"));
const CameraTest = lazy(() => import("./pages/tests/CameraTest"));
const MicrophoneTest = lazy(() => import("./pages/tests/MicrophoneTest"));
const AudioTest = lazy(() => import("./pages/tests/AudioTest"));
const NetworkTest = lazy(() => import("./pages/tests/NetworkTest"));
const TouchpadTest = lazy(() => import("./pages/tests/TouchpadTest"));
const PortsTest = lazy(() => import("./pages/tests/PortsTest"));
const FullSystemTest = lazy(() => import("./pages/tests/FullSystemTest"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const DMCA = lazy(() => import("./pages/DMCA"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const AffiliateDisclosure = lazy(() => import("./pages/AffiliateDisclosure"));
const EditorialPolicy = lazy(() => import("./pages/EditorialPolicy"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration for high-traffic scenarios
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes to reduce redundant requests
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 2 times with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus in production (reduces unnecessary load)
      refetchOnWindowFocus: import.meta.env.DEV,
      // Don't refetch on reconnect unless data is stale
      refetchOnReconnect: "always",
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SecurityProvider 
          enableClickjackingProtection={true}
          enableCSRFProtection={true}
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/test/display" element={<DisplayTest />} />
                  <Route path="/test/keyboard" element={<KeyboardTest />} />
                  <Route path="/test/camera" element={<CameraTest />} />
                  <Route path="/test/microphone" element={<MicrophoneTest />} />
                  <Route path="/test/audio" element={<AudioTest />} />
                  <Route path="/test/network" element={<NetworkTest />} />
                  <Route path="/test/touchpad" element={<TouchpadTest />} />
                  <Route path="/test/ports" element={<PortsTest />} />
                  <Route path="/test/full" element={<FullSystemTest />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/dmca" element={<DMCA />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/affiliate-disclosure" element={<AffiliateDisclosure />} />
                  <Route path="/editorial-policy" element={<EditorialPolicy />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <CookieConsent />
            </BrowserRouter>
          </TooltipProvider>
        </SecurityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
