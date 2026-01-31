import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/SEOHead";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
  blog_categories: {
    name: string;
    slug: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch categories and posts in parallel for faster loading
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Category[];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  const { data: allPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["blog-posts-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image,
          published_at,
          category_id,
          blog_categories (
            name,
            slug
          )
        `)
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data as (BlogPost & { category_id: string | null })[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter posts client-side for instant category switching
  const posts = selectedCategory && categories
    ? allPosts?.filter((post) => {
        const category = categories.find((c) => c.slug === selectedCategory);
        return category ? post.category_id === category.id : true;
      })
    : allPosts;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Laptop Testing Guides & Tips | LaptopAnalyzer Blog"
        description="Learn how to test your laptop hardware with our expert guides. Tips for dead pixel detection, keyboard testing, webcam checks, and more laptop diagnostic tutorials."
        keywords="laptop testing guide, how to test laptop, dead pixel guide, keyboard testing tips, laptop hardware guide, laptop diagnostic tutorial"
        canonicalPath="/blog"
      />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              <span>Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about laptop diagnostics, understand test results, and get tips for buying or maintaining your device.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Articles
            </Button>
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))
            ) : (
              categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))
            )}
          </motion.div>

          {/* Blog Posts Grid */}
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6">
                  <Skeleton className="h-40 w-full rounded-xl mb-4" />
                  <Skeleton className="h-4 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block h-full bg-card rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
                  >
                    {post.cover_image && (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    {post.blog_categories && (
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
                        {post.blog_categories.name}
                      </span>
                    )}
                    <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      {post.published_at && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.published_at)}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {selectedCategory
                  ? "No articles in this category yet. Check back soon!"
                  : "No articles published yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}