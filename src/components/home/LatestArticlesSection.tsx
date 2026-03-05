import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LatestArticlesSection() {
  const { data: posts } = useQuery({
    queryKey: ["latest-blog-posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("title, slug, excerpt, published_at, blog_categories(name)")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(4);
      return data || [];
    },
  });

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30" aria-labelledby="latest-articles">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>From Our Blog</span>
          </div>
          <h2 id="latest-articles" className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Guides & How-To Articles
          </h2>
          <p className="text-muted-foreground text-lg">
            Learn how to test, diagnose, and troubleshoot your laptop hardware.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                className="glass-card rounded-xl p-6 flex flex-col gap-3 h-full group hover:border-primary/30 transition-all duration-200 block"
              >
                {post.blog_categories && (
                  <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-1 self-start">
                    {(post.blog_categories as any).name}
                  </span>
                )}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                {post.published_at && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto pt-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/blog" className="inline-flex items-center gap-2">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
