import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface TestPageCTAProps {
  title?: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
}

export function TestPageCTA({
  title = "Run a Full System Test",
  description = "Check all your hardware in one session — display, keyboard, camera, mic, speakers, network, touchpad, and ports.",
  linkTo = "/test/full",
  linkLabel = "Start Full Test",
}: TestPageCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 rounded-2xl bg-gradient-to-br from-primary/8 via-card to-accent/8 border border-border/60 p-8 text-center"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        {description}
      </p>
      <Button variant="hero" size="lg" asChild>
        <Link to={linkTo}>
          {linkLabel}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </Button>
    </motion.div>
  );
}
