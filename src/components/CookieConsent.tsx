import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

// Push the user's choice to Google Consent Mode so Analytics/AdSense actually
// honour it. The `default` state (denied) is set in index.html before the tags
// load; this updates it once the user decides.
const updateConsent = (granted: boolean) => {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  const value = granted ? "granted" : "denied";
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
};

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const choice = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!choice) {
      // Small delay to avoid flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    updateConsent(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    updateConsent(false);
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    We use cookies 🍪
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We use Google AdSense, which uses cookies to track users and show personalized ads. 
                    We also use Google Analytics to improve our services. By clicking "Accept All", 
                    you consent to our use of cookies. See our{" "}
                    <Link 
                      to="/privacy-policy" 
                      className="text-primary hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>{" "}
                    for more details.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={acceptCookies} variant="hero" size="sm">
                      Accept All
                    </Button>
                    <Button onClick={declineCookies} variant="outline" size="sm">
                      Decline
                    </Button>
                  </div>
                </div>
                <button
                  onClick={declineCookies}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Close cookie consent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
