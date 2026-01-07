import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Scale, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const TermsOfService = () => {
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
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Terms of Service
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to LaptopCheck. By accessing or using our website and diagnostic tools, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service. These terms apply to all visitors, users, and others who access or use our service.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Description of Service</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LaptopCheck provides free, browser-based diagnostic tools to help users test and verify the functionality of their laptop hardware components. Our service includes tests for:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Display quality and pixel defects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Keyboard functionality and key registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Camera and microphone operation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Audio output and speaker testing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Network speed and connectivity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>USB, Bluetooth, and other port detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Touchpad and trackpad functionality</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Use License</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily access and use LaptopCheck for personal, non-commercial diagnostic purposes. This license does not include:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Modifying or copying our materials for redistribution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Using our materials for commercial purposes without permission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Attempting to reverse engineer any software on our website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Removing any copyright or proprietary notations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Transferring the materials to another person or mirroring on another server</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This license shall automatically terminate if you violate any of these restrictions and may be terminated by LaptopCheck at any time.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Disclaimer</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-foreground">LaptopCheck is provided "as is" without warranties of any kind.</strong> We make no warranties, expressed or implied, and hereby disclaim all other warranties including:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span>Implied warranties of merchantability or fitness for a particular purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span>Non-infringement of intellectual property or other proprietary rights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span>Accuracy, reliability, or completeness of diagnostic results</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Our diagnostic tests provide general guidance based on browser APIs and may not detect all hardware issues. For comprehensive hardware diagnostics, we recommend consulting with a qualified technician.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Limitations of Liability</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall LaptopCheck or its operators be liable for any damages (including, without limitation, damages for loss of data, profit, or due to business interruption) arising out of the use or inability to use our diagnostic tools, even if we have been notified of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties or liability for incidental or consequential damages, these limitations may not apply to you.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Accuracy of Materials</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials appearing on LaptopCheck's website could include technical, typographical, or photographic errors. We do not warrant that any of the materials are accurate, complete, or current. We may make changes to the materials at any time without notice. However, we do not make any commitment to update the materials.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Links to Third-Party Sites</h2>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopCheck has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by LaptopCheck. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use LaptopCheck:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>For any unlawful purpose or to solicit others to perform unlawful acts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To violate any international, federal, provincial, or state regulations, rules, laws, or ordinances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To infringe upon or violate our intellectual property rights or the rights of others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To submit false or misleading information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To upload or transmit viruses or any other type of malicious code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>To interfere with or circumvent the security features of our service</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Modifications</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopCheck may revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service. We encourage you to periodically review these terms to stay informed of any updates.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-foreground font-medium mt-2">
                  legal@laptopcheck.org
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

export default TermsOfService;
