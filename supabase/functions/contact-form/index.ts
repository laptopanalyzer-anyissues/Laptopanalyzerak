import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── In-memory IP rate limiter ──
const ipBuckets = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT_MAX = 5; // per IP
const RATE_LIMIT_WINDOW_MS = 300_000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
    return false;
  }
  bucket.count++;
  if (bucket.count > RATE_LIMIT_MAX) return true;
  return false;
}

// ── Validation helpers ──
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function hasXSSPatterns(input: string): boolean {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<\s*iframe/i,
    /<\s*object/i,
    /<\s*embed/i,
  ];
  return patterns.some((p) => p.test(input));
}

function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();

    // Honeypot check — bot filled hidden field
    if (body.website && body.website.trim() !== "") {
      // Silently accept but don't process — bots think it worked
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, subject, message } = body;

    // ── Server-side validation ──
    const errors: Record<string, string> = {};

    if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
      errors.name = "Name is required (max 100 characters)";
    }
    if (typeof email !== "string" || !isValidEmail(email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    if (typeof subject !== "string" || subject.trim().length < 1 || subject.trim().length > 200) {
      errors.subject = "Subject is required (max 200 characters)";
    }
    if (
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.trim().length > 5000
    ) {
      errors.message = "Message must be 10–5,000 characters";
    }

    // XSS pattern rejection
    const allValues = [name, email, subject, message].filter(
      (v) => typeof v === "string"
    );
    if (allValues.some(hasXSSPatterns)) {
      errors._form = "Your submission contains content that cannot be processed.";
    }

    if (Object.keys(errors).length > 0) {
      return new Response(
        JSON.stringify({ error: "Validation failed", errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Sanitize for storage ──
    const cleanName = sanitize(name.trim());
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = sanitize(subject.trim());
    const cleanMessage = sanitize(message.trim());

    // ── Store in database ──
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      ip_hash: await hashIP(ip),
      user_agent: (req.headers.get("user-agent") || "").slice(0, 200),
    });

    if (dbError) {
      console.error("DB insert failed:", dbError.message);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contact form error:", (err as Error).message);
    return new Response(
      JSON.stringify({ error: "Invalid request." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/** Hash IP for privacy — store hash, not raw IP */
async function hashIP(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "laptop-analyzer-salt");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}
