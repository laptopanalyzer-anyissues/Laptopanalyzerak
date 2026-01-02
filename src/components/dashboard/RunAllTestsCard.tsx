import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Shield, Zap, CheckCircle2 } from "lucide-react";

const RunAllTestsCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
      role="region"
      aria-label="Full System Test"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-accent p-8 md:p-10">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
              <Zap className="h-4 w-4" aria-hidden="true" />
              <span>Complete Diagnostic</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Run All Tests
            </h2>
            
            <p className="text-white/80 mb-6 max-w-md">
              Automatically run every diagnostic test and get a comprehensive laptop health score out of 100.
            </p>
            
            {/* Features */}
            <ul className="flex flex-wrap gap-4 mb-6 justify-center lg:justify-start" aria-label="Features">
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>8 Diagnostic Tests</span>
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Guided Flow</span>
              </li>
              <li className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Health Score</span>
              </li>
            </ul>
            
            {/* CTA Button */}
            <Button 
              asChild 
              size="xl"
              className="bg-white text-primary hover:bg-white/90 hover:text-primary shadow-xl hover:shadow-2xl group touch-target tap-highlight"
            >
              <Link to="/test/full" className="flex items-center gap-2">
                <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:animate-pulse" aria-hidden="true">
                  <Play className="h-4 w-4 text-primary" />
                </span>
                <span className="font-semibold">Start Full System Test</span>
              </Link>
            </Button>
            
            {/* Trust message */}
            <div className="flex items-center gap-2 mt-4 text-white/70 text-xs justify-center lg:justify-start">
              <Shield className="h-3 w-3" aria-hidden="true" />
              <span>All tests run locally. No data is uploaded or stored.</span>
            </div>
          </div>
          
          {/* Right visual */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="relative">
              {/* Animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-2 border-white/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              </div>
              
              {/* Center score preview */}
              <div className="relative w-36 h-36 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">100</div>
                  <div className="text-white/80 text-sm">Health Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RunAllTestsCard;
