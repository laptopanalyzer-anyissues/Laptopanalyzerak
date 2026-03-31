import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

type TestStatus = "pending" | "passed" | "warning" | "failed";

interface TestCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  gradient: string;
  status?: TestStatus;
  index?: number;
  isFocused?: boolean;
}

const statusConfig = {
  pending: { icon: null, text: "Not tested", color: "text-muted-foreground" },
  passed: { icon: CheckCircle2, text: "Passed", color: "text-success" },
  warning: { icon: AlertCircle, text: "Needs attention", color: "text-warning" },
  failed: { icon: XCircle, text: "Failed", color: "text-destructive" },
};

export function TestCard({
  icon: Icon,
  title,
  description,
  path,
  gradient,
  status = "pending",
  index = 0,
  isFocused = false,
}: TestCardProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
      role="listitem"
    >
      <Link 
        to={path} 
        className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`${title}: ${description}. Status: ${statusInfo.text}`}
      >
        <div 
          className={`test-card h-full relative overflow-hidden flex flex-col ${
            isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]" : ""
          }`}
        >
          {/* Gradient accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} ${
              isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} ${
                isFocused ? "scale-110" : "group-hover:scale-110"
              } transition-transform duration-300`}
              aria-hidden="true"
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <ArrowRight 
              className={`h-5 w-5 text-muted-foreground ${
                isFocused ? "opacity-100 translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
              } transition-all duration-300`}
              aria-hidden="true"
            />
          </div>

          <h3 className={`text-lg font-semibold mb-2 transition-colors ${
            isFocused ? "text-primary" : "text-foreground group-hover:text-primary"
          }`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

          {/* Status indicator */}
          <div className={`flex items-center gap-2 ${statusInfo.color} mt-auto`}>
            {StatusIcon && <StatusIcon className="h-4 w-4" aria-hidden="true" />}
            <span className="text-xs font-medium">{statusInfo.text}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
