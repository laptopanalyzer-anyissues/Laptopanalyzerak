/**
 * HomepageBackground — Premium layered background for the homepage only.
 * Layers: deep base → tech grid → radial glows → section gradient transitions → vignette
 * Purely decorative, pointer-events-none, aria-hidden.
 */
export function HomepageBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1 — Tech grid (continuous, subtle) */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Layer 2 — Primary glow: top-center, strong in hero area */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[160px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.04) 50%, transparent 80%)",
        }}
      />

      {/* Layer 3 — Accent glow: upper-right, adds depth */}
      <div
        className="absolute top-[15%] -right-20 w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Layer 4 — Mid-page subtle glow: left side around features/why sections */}
      <div
        className="absolute top-[35%] -left-32 w-[450px] h-[450px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Layer 5 — Lower glow: right side around blog/privacy sections */}
      <div
        className="absolute top-[60%] -right-24 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--accent) / 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Layer 6 — Bottom glow: CTA/FAQ area */}
      <div
        className="absolute bottom-[5%] left-1/3 w-[500px] h-[350px] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Layer 7 — Top vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, transparent 60%, hsl(var(--background) / 0.4) 100%)",
        }}
      />

      {/* Layer 8 — Bottom vignette for grounding */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 85%, hsl(var(--background) / 0.6) 100%)",
        }}
      />
    </div>
  );
}
