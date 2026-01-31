import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { BookOpen, Target, Users, CheckCircle, Shield, RefreshCw, AlertTriangle, Star } from "lucide-react";

const EditorialPolicy = () => {
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
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Editorial Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <section className="mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  At LaptopAnalyzer, our mission is to provide accurate, helpful, and accessible information about laptop hardware diagnostics. We are committed to creating content that empowers users to understand their devices, make informed decisions, and troubleshoot issues effectively.
                </p>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Editorial Standards</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All content published on LaptopAnalyzer adheres to the following standards:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Accuracy</h3>
                      <p className="text-muted-foreground text-sm">All technical information is verified through testing, research, and consultation with reliable sources. We cite our sources when referencing external data or studies.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Objectivity</h3>
                      <p className="text-muted-foreground text-sm">Our content is written to inform, not to sell. We present facts objectively and clearly distinguish between facts and opinions.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Clarity</h3>
                      <p className="text-muted-foreground text-sm">We write in clear, accessible language that can be understood by users of all technical levels. Technical jargon is explained when used.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-foreground">Relevance</h3>
                      <p className="text-muted-foreground text-sm">Content is focused on topics relevant to our users' needs—laptop diagnostics, troubleshooting, and hardware understanding.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Content Creation Process</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our content goes through a rigorous creation and review process:
                </p>
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Research", desc: "Topics are thoroughly researched using primary sources, technical documentation, and industry best practices." },
                    { step: "2", title: "Writing", desc: "Content is written by knowledgeable writers with technical backgrounds in hardware and software." },
                    { step: "3", title: "Technical Review", desc: "Technical accuracy is verified by team members with expertise in the subject matter." },
                    { step: "4", title: "Editorial Review", desc: "Content is reviewed for clarity, grammar, and adherence to our style guide." },
                    { step: "5", title: "Publication", desc: "Content is published with proper formatting, metadata, and accessibility considerations." },
                    { step: "6", title: "Ongoing Updates", desc: "Published content is regularly reviewed and updated to maintain accuracy." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                        {item.step}
                      </span>
                      <div>
                        <span className="font-semibold text-foreground">{item.title}:</span>
                        <span className="text-muted-foreground ml-1">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Editorial Independence</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We maintain strict separation between our editorial content and any commercial relationships:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">No paid editorial:</strong> Our diagnostic tools and educational content are never influenced by advertisers or sponsors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Transparent partnerships:</strong> When content involves affiliate relationships or sponsorships, it is clearly disclosed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">User-first approach:</strong> All content decisions are made based on user benefit, not commercial gain.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Honest assessments:</strong> We provide honest information even if it doesn't favor products we may have affiliate relationships with.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Content Updates & Corrections</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are committed to maintaining accurate and up-to-date content:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Regular reviews:</strong> Content is periodically reviewed for accuracy, especially as technology evolves.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Transparent corrections:</strong> When errors are found, we correct them promptly and note significant corrections.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Date stamps:</strong> All content includes a "last updated" date so users know how current the information is.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">User feedback:</strong> We welcome user reports of errors or outdated information.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <h2 className="text-xl font-semibold text-foreground m-0">Content Limitations</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We recognize the limitations of our content:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">Not professional repair advice:</strong> Our content is educational and should not replace consultation with qualified technicians for serious hardware issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">Browser-based limitations:</strong> Our diagnostic tools operate within browser capabilities and may not detect all hardware issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-1">•</span>
                    <span><strong className="text-foreground">General guidance:</strong> Specific device behavior may vary based on manufacturer, model, and configuration.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-8 p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Types of Content We Publish</h2>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Diagnostic Tools:</strong> Interactive browser-based tests for laptop hardware components.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Educational Articles:</strong> Guides explaining how laptop components work and common issues.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">Troubleshooting Guides:</strong> Step-by-step instructions for diagnosing and addressing common problems.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">How-To Content:</strong> Practical guides for using our diagnostic tools effectively.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong className="text-foreground">FAQs:</strong> Answers to commonly asked questions about laptop diagnostics.</span>
                  </div>
                </div>
              </section>

              <section className="p-6 rounded-xl bg-card border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Our Editorial Team</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about our editorial policy, want to report an error, or have suggestions for content, please contact us at:
                </p>
                <p className="text-foreground font-medium mt-2">
                  editorial@laptopanalyzer.com
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

export default EditorialPolicy;
