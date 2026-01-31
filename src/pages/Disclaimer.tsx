import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { AlertTriangle, Info, Shield, CheckCircle, XCircle } from "lucide-react";

const Disclaimer = () => {
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
              <div className="p-3 rounded-xl bg-warning/10">
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Disclaimer
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">General Information</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The information provided by LaptopAnalyzer ("we," "us," or "our") on laptopanalyzer.com (the "Site") is for general informational and educational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Diagnostic Results Disclaimer</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">Our diagnostic tools are designed to provide general guidance only.</strong> The results of any test performed on this website should not be considered as professional hardware assessment or repair advice. Please be aware that:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Our tests run through web browser APIs and may not detect all hardware issues</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>Results may vary based on browser, operating system, and device configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>A "pass" result does not guarantee hardware is functioning perfectly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>A "fail" result may sometimes be caused by software or driver issues, not hardware failure</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Professional Advice</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  The Site cannot and does not contain professional hardware repair advice. The diagnostic information is provided for general informational and educational purposes only. Before making any purchasing decisions (such as buying a used laptop) or undertaking any repairs, we strongly recommend:
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Consulting with a qualified computer technician for comprehensive diagnostics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Using manufacturer-provided diagnostic tools when available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Seeking professional assessment for any hardware concerns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Not relying solely on our tests for critical hardware decisions</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">No Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">External Links Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Site.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Errors and Omissions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to provide accurate and up-to-date information, this Site may contain typographical errors, inaccuracies, or omissions related to diagnostic procedures, test descriptions, or general information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Fair Use Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This Site may contain copyrighted material, the use of which may not have been specifically authorized by the copyright owner. This material is available in an effort to explain issues relevant to laptop diagnostics and hardware testing. The material contained in this Site is distributed without profit for educational and informational purposes. We believe this constitutes a "fair use" of any such copyrighted material as provided for in section 107 of the US Copyright Law.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Views Expressed Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Site may contain views and opinions which are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company. Comments published by users are their sole responsibility, and the users will take full responsibility for any such comments.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">"Use at Your Own Risk" Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All information in this Site is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information. LaptopAnalyzer will not be liable to you or anyone else for any decision made or action taken in reliance on the information given by the Site or for any consequential, special, or similar damages, even if advised of the possibility of such damages.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Disclaimer, please contact us at:
                </p>
                <p className="text-foreground font-medium mt-2">
                  legal@laptopanalyzer.com
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

export default Disclaimer;
