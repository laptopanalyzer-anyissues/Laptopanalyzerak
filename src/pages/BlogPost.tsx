import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { sanitizeURL } from "@/lib/security";
import { SEOHead, structuredData } from "@/components/SEOHead";
import { getSEOTitle } from "@/lib/seoTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published_at: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          content,
          cover_image,
          published_at,
          blog_categories (
            name,
            slug
          )
        `)
        .eq("slug", slug)
        .eq("published", true)
        .single();
      if (error) throw error;
      return data as BlogPost;
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["related-posts", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, published_at, blog_categories(name)")
        .eq("published", true)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Parse FAQ blocks from content
  const parseFAQs = (content: string) => {
    const faqRegex = /:::faq\n(.+?)\n([\s\S]*?):::/g;
    const faqs: { question: string; answer: string }[] = [];
    let match;
    while ((match = faqRegex.exec(content)) !== null) {
      faqs.push({
        question: match[1].trim(),
        answer: match[2].trim(),
      });
    }
    return faqs;
  };

  // Remove FAQ blocks from main content
  const getMainContent = (content: string) => {
    return content.replace(/:::faq\n[\s\S]*?:::/g, '').trim();
  };

  // Parse inline links [text](url)
  const renderLineWithLinks = (text: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      
      // Sanitize URL to prevent javascript: and data: URI injection
      const sanitizedUrl = sanitizeURL(linkUrl);
      
      // Check if it's an internal path (starts with /)
      const isInternalPath = linkUrl.startsWith('/') && !linkUrl.startsWith('//');
      
      if (sanitizedUrl) {
        // Valid external URL (http/https)
        parts.push(
          <a 
            key={match.index} 
            href={sanitizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            {linkText}
          </a>
        );
      } else if (isInternalPath) {
        // Internal path - safe to use with Link
        parts.push(
          <Link 
            key={match.index} 
            to={linkUrl} 
            className="text-primary hover:underline font-medium"
          >
            {linkText}
          </Link>
        );
      } else {
        // Invalid URL - render as plain text for security
        parts.push(text.slice(match.index, match.index + match[0].length));
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Simple markdown to HTML converter for headings and paragraphs
  const renderContent = (content: string) => {
    const mainContent = getMainContent(content);
    const lines = mainContent.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Detect table block: consecutive lines starting with |
      if (line.trim().startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        // Parse table rows, skip separator rows and empty rows like |||
        const rows = tableLines
          .filter(l => !l.match(/^\|[\s\-:|]*\|[\s\-:|]*\|?$/) && l.replace(/\|/g, '').trim().length > 0)
          .map(l => l.split("|").filter((_, ci) => ci > 0 && ci < l.split("|").length - 1).map(c => c.trim()))
          .filter(r => r.some(c => c.length > 0));
        
        if (rows.length > 0) {
          const headerRow = rows[0];
          const bodyRows = rows.slice(1);
          elements.push(
            <div key={`table-${i}`} className="my-6 overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    {headerRow.map((cell, ci) => (
                      <th key={ci} className="border border-border px-4 py-3 text-left font-semibold text-foreground text-sm">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bodyRows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      {row.map((cell, ci) => (
                        <td key={ci} className="border border-border px-4 py-3 text-muted-foreground text-sm">
                          {renderLineWithLinks(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-semibold text-foreground mt-5 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-foreground mt-10 mb-6">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={i} className="text-muted-foreground mb-2 ml-4">
            {renderLineWithLinks(line.replace("- ", ""))}
          </li>
        );
      } else if (line.match(/^\d+\. /)) {
        elements.push(
          <li key={i} className="text-muted-foreground mb-2 ml-4 list-decimal">
            {renderLineWithLinks(line.replace(/^\d+\. /, ""))}
          </li>
        );
      } else if (line.trim() === "" || line.trim() === "---") {
        elements.push(<div key={i} className="h-1" />);
      } else {
        elements.push(
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">
            {renderLineWithLinks(line)}
          </p>
        );
      }
      i++;
    }
    return elements;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">Back to Articles</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.title}
        description={post.excerpt || `Read about ${post.title} on LaptopAnalyzer blog.`}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        publishedTime={post.published_at || undefined}
        ogImage={post.cover_image || undefined}
        slug={post.slug}
        structuredData={structuredData.article(
          getSEOTitle(post.title, post.slug).replace(" | Laptop Analyzer", ""),
          post.excerpt || "",
          `/blog/${post.slug}`,
          post.published_at || new Date().toISOString(),
          undefined,
          post.cover_image || undefined
        )}
      />
      <Header />
      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" asChild>
              <Link to="/blog" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Link>
            </Button>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {post.blog_categories && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary mb-4">
                <Tag className="h-3 w-3" />
                {post.blog_categories.name}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>
            )}
            {post.published_at && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </div>
            )}
          </motion.header>

          {/* Cover Image */}
          {post.cover_image && (
            <motion.img
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
            />
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {renderContent(post.content)}
          </motion.div>

          {/* FAQ Section - Collapsible Accordion */}
          {parseFAQs(post.content).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-12"
            >
              <Accordion type="single" collapsible className="space-y-4">
                {parseFAQs(post.content).map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="glass-card rounded-xl px-6 border-none"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="font-semibold text-foreground">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          )}

          {/* Related Articles */}
          {relatedPosts && relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="glass-card rounded-xl p-5 flex flex-col gap-2 group hover:border-primary/30 transition-all duration-200"
                  >
                    {(related as any).blog_categories && (
                      <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1 self-start">
                        {(related as any).blog_categories.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm line-clamp-2">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{related.excerpt}</p>
                    )}
                    <span className="text-xs text-primary flex items-center gap-1 mt-auto pt-2">
                      Read more <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-8 bg-muted/50 rounded-2xl border border-border text-center"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {slug === "online-keyboard-test" ? "Ready to Test Your Keyboard?" 
                : slug === "laptop-keyboard-not-working" ? "Check Whether Your Keyboard Is Responding"
                : slug === "touchpad-test-online" ? "Ready to Test Your Touchpad?"
                : slug === "laptop-camera-not-working" ? "Need to Test Your Webcam?"
                : slug === "laptop-camera-not-working-fix-webcam-test" ? "Test Your Webcam Now"
                : slug === "camera-and-mic-test-online" ? "Test Your Camera & Mic"
                : slug === "what-to-check-buying-used-laptop" ? "Run a Full Hardware Check"
                : "Ready to Test Your Laptop?"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {slug === "online-keyboard-test" 
                ? "Check if all your keyboard keys are working properly." 
                : slug === "laptop-keyboard-not-working"
                ? "Run a free keyboard test to see which keys are responding and which are not."
                : slug === "touchpad-test-online"
                ? "Check your touchpad movement, clicks, and gestures instantly."
                : slug === "laptop-camera-not-working"
                ? "Run a free browser-based camera test and find out if your webcam is working properly."
                : slug === "laptop-camera-not-working-fix-webcam-test"
                ? "Verify your webcam works with our instant browser-based camera test."
                : slug === "camera-and-mic-test-online"
                ? "Check your camera and microphone before your next call — no downloads needed."
                : slug === "what-to-check-buying-used-laptop"
                ? "Test display, keyboard, camera, speakers, and more — all in one session."
                : "Run comprehensive hardware diagnostics right in your browser."}
            </p>
            <Button variant="hero" asChild>
              <Link to={
                slug === "online-keyboard-test" ? "/test/keyboard" 
                : slug === "laptop-keyboard-not-working" ? "/test/keyboard"
                : slug === "touchpad-test-online" ? "/test/touchpad" 
                : slug === "laptop-camera-not-working" ? "/test/camera" 
                : slug === "laptop-camera-not-working-fix-webcam-test" ? "/test/camera"
                : slug === "camera-and-mic-test-online" ? "/test/camera"
                : slug === "what-to-check-buying-used-laptop" ? "/test/full"
                : "/dashboard"
              }>
                {slug === "online-keyboard-test" ? "Test Your Keyboard" 
                  : slug === "laptop-keyboard-not-working" ? "Run the Keyboard Test"
                  : slug === "touchpad-test-online" ? "Test Your Touchpad" 
                  : slug === "laptop-camera-not-working" ? "Test Your Camera"
                  : slug === "laptop-camera-not-working-fix-webcam-test" ? "Test Your Camera"
                  : slug === "camera-and-mic-test-online" ? "Test Camera & Mic"
                  : slug === "what-to-check-buying-used-laptop" ? "Run Full System Test"
                  : "Start Testing Now"}
              </Link>
            </Button>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
}