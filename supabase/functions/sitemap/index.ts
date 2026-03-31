import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://laptopanalyzer.com";

const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/test/display", priority: "0.9", changefreq: "monthly" },
  { loc: "/test/keyboard", priority: "0.9", changefreq: "monthly" },
  { loc: "/test/camera", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/microphone", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/audio", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/network", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/touchpad", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/ports", priority: "0.8", changefreq: "monthly" },
  { loc: "/test/full", priority: "0.9", changefreq: "monthly" },
  { loc: "/blog", priority: "0.8", changefreq: "weekly" },
  { loc: "/about", priority: "0.7", changefreq: "monthly" },
  { loc: "/contact", priority: "0.6", changefreq: "monthly" },
  { loc: "/privacy-policy", priority: "0.5", changefreq: "yearly" },
  { loc: "/terms-of-service", priority: "0.5", changefreq: "yearly" },
  { loc: "/disclaimer", priority: "0.5", changefreq: "yearly" },
  { loc: "/dmca", priority: "0.4", changefreq: "yearly" },
  { loc: "/accessibility", priority: "0.5", changefreq: "yearly" },
  { loc: "/affiliate-disclosure", priority: "0.4", changefreq: "yearly" },
  { loc: "/editorial-policy", priority: "0.5", changefreq: "yearly" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic blog posts
    if (posts) {
      for (const post of posts) {
        const lastmod = (post.updated_at || post.published_at || today).split("T")[0];
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
});
