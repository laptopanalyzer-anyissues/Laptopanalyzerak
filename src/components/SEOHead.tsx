import { useEffect } from "react";
import { getSEOTitle } from "@/lib/seoTitle";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  structuredData?: object;
}

/**
 * SEOHead Component
 * 
 * Dynamically updates document head with page-specific SEO meta tags.
 * Use this on every page for proper SEO optimization.
 */
export function SEOHead({
  title,
  description,
  keywords,
  canonicalPath = "/",
  ogImage = "https://laptopanalyzer.com/og-image.png",
  ogType = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
  structuredData,
}: SEOHeadProps) {
  const fullTitle = title.includes("LaptopAnalyzer") 
    ? title 
    : `${title} | LaptopAnalyzer`;
  const canonicalUrl = `https://laptopanalyzer.com${canonicalPath}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const updateMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create link tag
    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // Update primary meta tags
    updateMeta("description", description);
    if (keywords) {
      updateMeta("keywords", keywords);
    }

    // Update robots
    updateMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, noai, noimageai");

    // Update canonical
    updateLink("canonical", canonicalUrl);

    // Update Open Graph tags
    updateMeta("og:title", fullTitle, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", canonicalUrl, true);
    updateMeta("og:type", ogType, true);
    updateMeta("og:image", ogImage, true);
    updateMeta("og:site_name", "LaptopAnalyzer - Free Laptop Diagnostic Tool", true);

    // Update Twitter tags
    updateMeta("twitter:title", fullTitle);
    updateMeta("twitter:description", description);
    updateMeta("twitter:url", canonicalUrl);
    updateMeta("twitter:image", ogImage);

    // Article-specific tags
    if (ogType === "article") {
      if (publishedTime) {
        updateMeta("article:published_time", publishedTime, true);
      }
      if (modifiedTime) {
        updateMeta("article:modified_time", modifiedTime, true);
      }
    }

    // Add structured data
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo-page="true"]');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-page", "true");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, publishedTime, modifiedTime, noIndex, structuredData]);

  return null;
}

// Pre-built structured data generators
export const structuredData = {
  /**
   * Generate BreadcrumbList structured data
   */
  breadcrumbs: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://laptopanalyzer.com${item.url}`,
    })),
  }),

  /**
   * Generate HowTo structured data for test pages
   */
  howTo: (
    name: string,
    description: string,
    steps: { name: string; text: string }[]
  ) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }),

  /**
   * Generate SoftwareApplication structured data for individual tests
   */
  softwareApp: (name: string, description: string, category: string) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web-based)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [category],
  }),

  /**
   * Generate Article structured data for blog posts
   */
  article: (
    title: string,
    description: string,
    url: string,
    publishedTime: string,
    modifiedTime?: string,
    image?: string
  ) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://laptopanalyzer.com${url}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    image: image || "https://laptopanalyzer.com/og-image.png",
    author: {
      "@type": "Organization",
      name: "LaptopAnalyzer",
      url: "https://laptopanalyzer.com",
    },
    publisher: {
      "@type": "Organization",
      name: "LaptopAnalyzer",
      url: "https://laptopanalyzer.com",
      logo: {
        "@type": "ImageObject",
        url: "https://laptopanalyzer.com/favicon.png",
      },
    },
  }),
};

export default SEOHead;
