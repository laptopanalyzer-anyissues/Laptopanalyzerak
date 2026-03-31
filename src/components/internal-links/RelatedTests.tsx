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
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="mt-8"
    >
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
        Related Tests
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tests.map((test) => (
          <Link
            key={test.path}
            to={test.path}
            className="group flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
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
