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
}: TestCardProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={path} className="block group h-full">
        <div className="test-card h-full relative overflow-hidden flex flex-col">
          {/* Gradient accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

          {/* Status indicator */}
          <div className={`flex items-center gap-2 ${statusInfo.color} mt-auto`}>
            {StatusIcon && <StatusIcon className="h-4 w-4" />}
            <span className="text-xs font-medium">{statusInfo.text}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
