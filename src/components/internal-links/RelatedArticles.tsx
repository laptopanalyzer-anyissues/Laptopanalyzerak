import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

interface RelatedArticle {
  title: string;
  slug: string;
  excerpt: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12"
    >
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Helpful Guides
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            to={`/blog/${article.slug}`}
            className="group p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
          >
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
              {article.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {article.excerpt}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Read guide <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
