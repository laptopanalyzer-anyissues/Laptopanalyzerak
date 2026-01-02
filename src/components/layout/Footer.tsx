import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Laptop, Shield, Heart } from "lucide-react";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return (
    <footer ref={ref} className="border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Laptop className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">
                LaptopCheck
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-4">
              The most comprehensive laptop diagnostic tool. Test every component
              of your device right in your browser.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>100% Private — All tests run locally</span>
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
                to="/#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/#privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </nav>
          </div>

          {/* Tests */}
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
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex justify-center items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaptopCheck. Free and open for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
