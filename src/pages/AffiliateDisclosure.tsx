import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Link2, DollarSign, Shield, AlertCircle, Heart, CheckCircle } from "lucide-react";

const AffiliateDisclosure = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Link2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Affiliate Disclosure
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">FTC Disclosure</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with the Federal Trade Commission's (FTC) guidelines concerning the use of endorsements and testimonials in advertising, we want to be fully transparent about the relationships that may affect the content, topics, or posts made on this website.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Affiliate Relationships</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LaptopAnalyzer may participate in affiliate marketing programs, which means we may earn commissions when you click on links to products or services and make a purchase. This comes at no additional cost to you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Currently, we may participate in affiliate programs including, but not limited to:
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Amazon Associates Program</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Computer hardware manufacturer affiliate programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Software and tool recommendation programs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Other e-commerce and tech-related affiliate networks</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">What This Means for You</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you click on an affiliate link on our website and make a purchase, we may receive a small commission from the retailer or service provider. This is a standard practice across the internet and helps us keep our diagnostic tools free for everyone.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Important: You never pay more
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    The price you pay is always the same whether you use our affiliate link or go directly to the website. The commission comes from the retailer, not from you.
                  </p>
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Our Promise to You</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While we may earn commissions from affiliate links, we are committed to maintaining complete editorial integrity:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Honest Recommendations:</strong> We only recommend products or services that we genuinely believe will benefit our users.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">No Influence on Content:</strong> Affiliate relationships do not influence our diagnostic results, reviews, or recommendations.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">Transparency:</strong> We clearly disclose affiliate relationships when applicable.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <span><strong className="text-foreground">User First:</strong> Our primary goal is to help you diagnose and understand your laptop's hardware, not to sell products.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Advertising Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In addition to affiliate links, we display advertisements on our website through third-party advertising networks, including Google AdSense. These advertisements help fund the development and maintenance of our free diagnostic tools.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We have no control over the specific advertisements shown, as they are served by third-party networks based on your browsing history and interests. For more information about how these ads are personalized, please see our Privacy Policy.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Sponsored Content</h2>
                <p className="text-muted-foreground leading-relaxed">
                  From time to time, we may publish sponsored content or reviews in exchange for compensation. When this occurs, the content will be clearly marked as "Sponsored," "Paid Partnership," or similar disclosure. Our editorial standards remain the same for sponsored content, and we will always provide honest opinions regardless of compensation.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-destructive" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Supporting Our Work</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We are dedicated to providing free, comprehensive laptop diagnostic tools to everyone. Revenue from affiliate partnerships and advertising helps us:
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keep all diagnostic tests 100% free</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Develop new testing features and improvements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Maintain and host our website infrastructure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Create educational content to help users</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We appreciate your support in using our affiliate links when making purchases, as it helps us continue providing these free services.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Questions?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about our affiliate relationships or this disclosure, please contact us at:
                </p>
                <p className="text-foreground font-medium mt-2">
                  partnerships@laptopanalyzer.com
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDisclosure;
