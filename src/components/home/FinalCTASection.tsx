import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24" aria-labelledby="final-cta-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border p-10 md:p-14 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl" />

          <div className="relative z-10">
            <h2
              id="final-cta-heading"
              className="text-2xl md:text-3xl font-bold text-foreground mb-4"
            >
              Ready to Test Your Laptop?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Full hardware diagnostics in under 5 minutes. Free, private, and browser-based.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/dashboard">
                Start Testing
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
