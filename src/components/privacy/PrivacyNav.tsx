import { motion } from "framer-motion";

const sections = [
  { id: "who-we-are", label: "Who We Are" },
  { id: "info-collect", label: "Data We Collect" },
  { id: "how-we-use", label: "How We Use It" },
  { id: "local-processing", label: "Local Processing" },
  { id: "browser-permissions", label: "Permissions" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "third-party", label: "Third Parties" },
  { id: "advertising", label: "Advertising" },
  { id: "data-retention", label: "Retention" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children" },
  { id: "your-rights", label: "Your Rights" },
  { id: "international", label: "International" },
  { id: "changes", label: "Updates" },
  { id: "contact", label: "Contact" },
];

export function PrivacyNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mb-10 p-5 rounded-2xl bg-card border border-border"
      aria-label="Policy sections"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Jump to section
      </p>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
          >
            {s.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
