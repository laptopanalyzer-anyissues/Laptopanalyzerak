import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Laptop, Shield } from "lucide-react";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Laptop className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                LaptopAnalyzer
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              The most comprehensive laptop diagnostic tool. Test every component
              of your device right in your browser.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>100 Percent Private</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All Tests
              </Link>
              <Link
                to="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Popular Tests */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Popular Tests</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/test/display"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Display Test
              </Link>
              <Link
                to="/test/keyboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Keyboard Test
              </Link>
              <Link
                to="/test/camera"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Camera Test
              </Link>
              <Link
                to="/test/audio"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Audio Test
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link
                to="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/disclaimer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Disclaimer
              </Link>
              <Link
                to="/dmca"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                DMCA & Copyright
              </Link>
              <Link
                to="/accessibility"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Accessibility
              </Link>
              <Link
                to="/affiliate-disclosure"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Affiliate Disclosure
              </Link>
              <Link
                to="/editorial-policy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Editorial Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaptopAnalyzer. Free and open for everyone.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";