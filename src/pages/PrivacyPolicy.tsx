import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Cookie, Mail } from "lucide-react";

const PrivacyPolicy = () => {
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
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Our Commitment to Privacy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  At LaptopAnalyzer, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we handle data when you use our laptop diagnostic tool. We believe in complete transparency and want you to feel confident using our service.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Server className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Information We Collect</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">We do not collect any personal information.</strong> LaptopAnalyzer is designed with privacy as a core principle:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">No Account Required:</strong> You can use all our diagnostic tools without creating an account or providing any personal information.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Local Processing:</strong> All hardware tests run entirely in your browser. Your test results, hardware information, and diagnostic data never leave your device.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">No Data Storage:</strong> We do not store, transmit, or have access to any information about your computer or test results.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Browser Permissions</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Some diagnostic tests require browser permissions to function. We only request permissions when necessary:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Camera Access:</strong> Required only for the webcam test. The video stream stays local and is not recorded or transmitted.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Microphone Access:</strong> Required only for the microphone test. Audio is processed locally and never recorded.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">USB/Bluetooth Access:</strong> Required only for port detection tests. Device information is not stored.</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  You can revoke these permissions at any time through your browser settings. We recommend denying permissions you are not comfortable with—the tests will simply be skipped.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Cookie className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Cookies and Tracking</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">We do not use cookies for tracking purposes.</strong> We may use essential cookies only for:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Remembering your theme preference (light/dark mode)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Basic functionality required for the website to operate</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not use analytics cookies, advertising cookies, or any third-party tracking scripts. Your browsing behavior on our site is not monitored or recorded.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our website may include:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Cloudflare:</strong> We use Cloudflare for content delivery and security. Cloudflare may collect limited technical data (IP address, browser type) for security purposes. See <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudflare's Privacy Policy</a>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Google Fonts:</strong> We may load fonts from Google's servers, which involves your browser making requests to Google. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google's Privacy Policy</a>.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopAnalyzer is a general-purpose diagnostic tool and does not target children under 13. Since we do not collect personal information from any users, we do not knowingly collect data from children. If you are a parent or guardian and believe your child has provided personal information to us, please contact us immediately.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Since we do not collect or store personal data, traditional data subject rights (access, deletion, portability) are not applicable. However, you have the right to:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use our service without providing any personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Deny browser permission requests at any time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Contact us with any privacy concerns</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Your continued use of LaptopAnalyzer after any changes indicates your acceptance of the updated policy.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Contact Us</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="text-foreground font-medium mt-2">
                  privacy@laptopanalyzer.com
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

export default PrivacyPolicy;