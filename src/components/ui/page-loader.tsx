import { Laptop } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader = ({ message = "Booting Laptop Analyzer..." }: PageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* Laptop illustration */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute inset-0 -m-8 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />

          {/* Laptop body */}
          <div className="relative">
            {/* Screen */}
            <div className="relative w-44 h-28 sm:w-56 sm:h-36 rounded-t-xl bg-gradient-to-br from-foreground/90 to-foreground border-[3px] border-foreground shadow-xl overflow-hidden">
              {/* Screen content */}
              <div className="absolute inset-1.5 rounded-md bg-background overflow-hidden flex items-center justify-center">
                <Laptop
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse"
                  strokeWidth={1.5}
                />
                {/* Scanning line */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
              </div>
            </div>

            {/* Base */}
            <div className="relative w-52 sm:w-64 h-2 -mx-4 sm:-mx-4 bg-gradient-to-b from-foreground to-foreground/70 rounded-b-xl shadow-lg">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-10 sm:w-12 h-[3px] rounded-b-lg bg-background/30" />
            </div>
            <div className="w-56 sm:w-72 h-1 -mx-6 sm:-mx-8 bg-foreground/70 rounded-b-[10px]" />
          </div>
        </div>

        {/* Brand + message */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg sm:text-xl font-bold gradient-text tracking-tight">
            Laptop Analyzer
          </h2>

          {/* Progress bar */}
          <div className="relative w-56 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-primary via-accent to-primary animate-loader-bar" />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes loader-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-scan-line {
          animation: scan-line 1.8s ease-in-out infinite;
        }
        .animate-loader-bar {
          animation: loader-bar 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
