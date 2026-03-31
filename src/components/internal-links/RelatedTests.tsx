import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface RelatedTest {
  title: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

interface RelatedTestsProps {
  tests: RelatedTest[];
}

export function RelatedTests({ tests }: RelatedTestsProps) {
  if (tests.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10"
    >
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5">
        Related Tests
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tests.map((test) => (
          <Link
            key={test.path}
            to={test.path}
            className="group flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
          >
            <div className="flex-shrink-0 p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <test.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {test.title}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {test.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
