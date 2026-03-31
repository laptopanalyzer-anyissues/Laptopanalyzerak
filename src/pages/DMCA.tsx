import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Copyright, FileText, Mail, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="DMCA Policy — LaptopAnalyzer"
        description="DMCA takedown policy for Laptop Analyzer. Learn how to report copyright infringement and our process for handling DMCA notices."
        canonicalPath="/dmca"
      />
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
                <Copyright className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  DMCA & Copyright Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Copyright Notice</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  © {new Date().getFullYear()} LaptopAnalyzer. All Rights Reserved. All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, is the property of LaptopAnalyzer or its content suppliers and is protected by international copyright laws.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">DMCA Compliance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopAnalyzer respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement committed using our website that are reported to our designated Copyright Agent.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Filing a DMCA Notice</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that content available on or through our website infringes one or more of your copyrights, please notify our Copyright Agent by sending a DMCA Notice containing the following information:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">1</span>
                    <span><strong className="text-foreground">Identification of the copyrighted work</strong> claimed to have been infringed, or if multiple copyrighted works are covered by a single notification, a representative list of such works.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">2</span>
                    <span><strong className="text-foreground">Identification of the material</strong> that is claimed to be infringing or to be the subject of infringing activity, including information reasonably sufficient to permit us to locate the material (e.g., URL of the page).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">3</span>
                    <span><strong className="text-foreground">Your contact information</strong>, including your name, address, telephone number, and email address.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">4</span>
                    <span><strong className="text-foreground">A statement</strong> that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">5</span>
                    <span><strong className="text-foreground">A statement</strong> that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of the copyright that is allegedly infringed.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">6</span>
                    <span><strong className="text-foreground">Your physical or electronic signature</strong> (typing your full legal name is acceptable).</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Designated Copyright Agent</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Please send your DMCA Notice to our designated Copyright Agent at:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground font-medium">LaptopAnalyzer - Copyright Agent</p>
                  <p className="text-muted-foreground">Email: dmca@laptopanalyzer.com</p>
                  <p className="text-muted-foreground">Subject Line: DMCA Takedown Request</p>
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Response Time</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Upon receiving a valid DMCA notice, we will respond within 48-72 business hours. If we determine that the reported content infringes copyright, we will remove or disable access to the material and notify the user who posted the content.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Counter-Notification</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you believe that your content was removed or disabled by mistake or misidentification, you may file a counter-notification with us. Your counter-notification must include:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Your physical or electronic signature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Identification of the material that has been removed or disabled and the location at which the material appeared before it was removed or disabled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Your name, address, telephone number, and a statement that you consent to the jurisdiction of the federal court in your district</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Repeat Infringer Policy</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  In accordance with the DMCA and other applicable law, LaptopAnalyzer has adopted a policy of terminating, in appropriate circumstances and at our sole discretion, users who are deemed to be repeat infringers. We may also, at our sole discretion, limit access to the Site and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Questions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this DMCA & Copyright Policy, please contact us at:
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

export default DMCA;
