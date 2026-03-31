import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Laptop, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { data: blogPosts } = useQuery({
    queryKey: ["footer-blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      return data || [];
    },
  });

  return (
    <footer ref={ref} className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand — spans 4 cols */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                <Laptop className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                LaptopAnalyzer
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-5">
              The most comprehensive laptop diagnostic tool. Test every component
              of your device right in your browser.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" aria-hidden="true" />
              <span>100% Private — No data leaves your device</span>
            </div>
          </div>

          {/* Tests — spans 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Tests
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Test pages">
              <Link to="/test/display" className="footer-link">Display Test</Link>
              <Link to="/test/keyboard" className="footer-link">Keyboard Test</Link>
              <Link to="/test/camera" className="footer-link">Camera Test</Link>
              <Link to="/test/audio" className="footer-link">Audio Test</Link>
              <Link to="/test/microphone" className="footer-link">Microphone Test</Link>
              <Link to="/test/network" className="footer-link">Network Test</Link>
            </nav>
          </div>

          {/* Resources — spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Resources
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Resources">
              <Link to="/blog" className="footer-link">Blog & Guides</Link>
              {blogPosts?.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="footer-link line-clamp-1"
                >
                  {post.title}
                </Link>
              ))}
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </nav>
          </div>

          {/* Legal — spans 3 cols */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Legal
            </h4>
            <nav className="flex flex-col gap-2.5" aria-label="Legal pages">
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
              <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
              <Link to="/dmca" className="footer-link">DMCA & Copyright</Link>
              <Link to="/accessibility" className="footer-link">Accessibility</Link>
              <Link to="/affiliate-disclosure" className="footer-link">Affiliate Disclosure</Link>
              <Link to="/editorial-policy" className="footer-link">Editorial Policy</Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaptopAnalyzer. Free and open for everyone.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <span className="text-border">•</span>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <span className="text-border">•</span>
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
