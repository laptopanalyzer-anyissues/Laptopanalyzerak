import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Accessibility as AccessibilityIcon, Eye, Keyboard, Monitor, MessageSquare, CheckCircle, Settings } from "lucide-react";

const Accessibility = () => {
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
                <AccessibilityIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Accessibility Statement
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Our Commitment</h2>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopAnalyzer is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Conformance Status</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities. Conformance with these guidelines helps make the web more user-friendly for everyone.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground font-medium mb-2">Current Status:</p>
                  <p className="text-muted-foreground">We are actively working toward WCAG 2.1 Level AA compliance and regularly audit our site to identify and fix accessibility issues.</p>
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Accessibility Features</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We have implemented the following accessibility features on our website:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Keyboard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Keyboard Navigation</h3>
                      <p className="text-muted-foreground text-sm">All functionality is accessible via keyboard. Use Tab to navigate between elements, Enter or Space to activate buttons, and Escape to close dialogs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Screen Reader Support</h3>
                      <p className="text-muted-foreground text-sm">We use semantic HTML, ARIA labels, and proper heading structure to ensure compatibility with screen readers like NVDA, JAWS, and VoiceOver.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Monitor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Visual Accommodations</h3>
                      <p className="text-muted-foreground text-sm">Our site supports dark and light themes, maintains high color contrast ratios, and scales properly when text size is increased up to 200%.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Reduced Motion</h3>
                      <p className="text-muted-foreground text-sm">We respect the "prefers-reduced-motion" system setting to minimize animations for users who are sensitive to motion.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Specific Measures</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  LaptopAnalyzer takes the following measures to ensure accessibility:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Include accessibility as part of our development process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Provide skip navigation links for keyboard users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use clear and consistent navigation mechanisms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensure all images have appropriate alternative text</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use proper heading hierarchy (H1-H6)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Provide visible focus indicators for all interactive elements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Ensure color is not the only means of conveying information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Provide clear form labels and error messages</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Technical Specifications</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Accessibility of LaptopAnalyzer relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>HTML5</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>CSS3</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>JavaScript (ES6+)</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  These technologies are relied upon for conformance with the accessibility standards used.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Known Limitations</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Despite our best efforts to ensure accessibility, there may be some limitations:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">Display Test:</strong> The dead pixel test requires visual inspection and may not be fully accessible to users with visual impairments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">Audio Test:</strong> The speaker test requires the ability to hear audio output.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">Keyboard Test:</strong> Some assistive technology keyboard shortcuts may conflict with our keyboard testing interface.</span>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We are working to address these limitations and welcome suggestions for improvement.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Assessment Approach</h2>
                <p className="text-muted-foreground leading-relaxed">
                  LaptopAnalyzer assesses the accessibility of our website through the following methods: self-evaluation using automated testing tools (such as axe, WAVE, and Lighthouse), manual testing with keyboard-only navigation, and testing with screen readers.
                </p>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Feedback</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We welcome your feedback on the accessibility of LaptopAnalyzer. Please let us know if you encounter accessibility barriers or have suggestions for improvement:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-foreground font-medium">Email: accessibility@laptopanalyzer.com</p>
                  <p className="text-muted-foreground text-sm mt-2">We try to respond to accessibility feedback within 5 business days.</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Accessibility;
