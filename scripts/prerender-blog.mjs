/**
 * Post-build script: Pre-renders blog pages as static HTML for SEO.
 * Fetches published blog posts from Supabase and generates full HTML pages
 * in dist/blog/{slug}/index.html so Google can index them without JavaScript.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../dist');

// Supabase config (public/anon - safe to include)
const SUPABASE_URL = 'https://bcgiweqxociljuheyxwz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZ2l3ZXF4b2NpbGp1aGV5eHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxODcwNTksImV4cCI6MjA4Mjc2MzA1OX0.2iada8dArrf7In9eJTskKvnE8uzexoisc-XBBfl0tGA';
const SITE_URL = 'https://laptopanalyzer.com';

async function fetchBlogPosts() {
  const url = `${SUPABASE_URL}/rest/v1/blog_posts?select=id,title,slug,excerpt,content,cover_image,published_at,blog_categories(name,slug)&published=eq.true&order=published_at.desc`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.status}`);
  return res.json();
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function processLineWithLinks(line) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let result = '';
  let lastIdx = 0;
  let match;
  while ((match = linkRegex.exec(line)) !== null) {
    result += escapeHtml(line.slice(lastIdx, match.index));
    const text = escapeHtml(match[1]);
    const url = escapeHtml(match[2]);
    if (match[2].startsWith('/')) {
      result += `<a href="${url}">${text}</a>`;
    } else if (match[2].startsWith('http')) {
      result += `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    } else {
      result += `${text}`;
    }
    lastIdx = match.index + match[0].length;
  }
  result += escapeHtml(line.slice(lastIdx));
  return result;
}

function markdownToHtml(content) {
  if (!content) return '';
  // Remove FAQ blocks for main content
  let main = content.replace(/:::faq\n[\s\S]*?:::/g, '');
  
  const lines = main.split('\n');
  let html = '';
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Detect table block
    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter(l => !l.match(/^\|[\s\-:|]*\|[\s\-:|]*\|?$/) && l.replace(/\|/g, '').trim().length > 0)
        .map(l => l.split('|').filter((_, ci) => ci > 0 && ci < l.split('|').length - 1).map(c => c.trim()))
        .filter(r => r.some(c => c.length > 0));
      
      if (rows.length > 0) {
        const headerRow = rows[0];
        const bodyRows = rows.slice(1);
        html += '<table style="width:100%;border-collapse:collapse;margin:24px 0;border:1px solid #333;">\n';
        html += '<thead><tr style="background:rgba(255,255,255,0.05);">';
        for (const cell of headerRow) {
          html += `<th style="border:1px solid #333;padding:12px;text-align:left;font-weight:600;">${escapeHtml(cell)}</th>`;
        }
        html += '</tr></thead>\n<tbody>\n';
        for (let ri = 0; ri < bodyRows.length; ri++) {
          const bg = ri % 2 === 0 ? '' : ' style="background:rgba(255,255,255,0.02);"';
          html += `<tr${bg}>`;
          for (const cell of bodyRows[ri]) {
            html += `<td style="border:1px solid #333;padding:12px;">${processLineWithLinks(cell)}</td>`;
          }
          html += '</tr>\n';
        }
        html += '</tbody></table>\n';
      }
      continue;
    }
    
    if (line.startsWith('### ')) {
      html += `<h3>${escapeHtml(line.slice(4))}</h3>\n`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${escapeHtml(line.slice(3))}</h2>\n`;
    } else if (line.startsWith('# ')) {
      html += `<h1>${escapeHtml(line.slice(2))}</h1>\n`;
    } else if (line.startsWith('- ')) {
      html += `<li>${escapeHtml(line.slice(2))}</li>\n`;
    } else if (line.match(/^\d+\. /)) {
      html += `<li>${escapeHtml(line.replace(/^\d+\. /, ''))}</li>\n`;
    } else if (line.trim() === '' || line.trim() === '---') {
      html += '<br/>\n';
    } else {
      html += `<p>${processLineWithLinks(line)}</p>\n`;
    }
    i++;
  }
  
  // Parse FAQ blocks
  const faqRegex = /:::faq\n(.+?)\n([\s\S]*?):::/g;
  let faqMatch;
  const faqs = [];
  while ((faqMatch = faqRegex.exec(content)) !== null) {
    faqs.push({ question: faqMatch[1].trim(), answer: faqMatch[2].trim() });
  }
  
  if (faqs.length > 0) {
    html += '<section class="faq-section"><h2>Frequently Asked Questions</h2>\n';
    for (const faq of faqs) {
      html += `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>\n`;
    }
    html += '</section>\n';
  }
  
  return html;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function generateBlogPostHtml(post) {
  const title = escapeHtml(post.title);
  const fullTitle = `${title} | Laptop Analyzer`;
  const description = escapeHtml(post.excerpt || `Read about ${post.title} on LaptopAnalyzer blog.`);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.cover_image || `${SITE_URL}/og-image.png`;
  const publishedAt = post.published_at || new Date().toISOString();
  const categoryName = post.blog_categories?.name || '';
  const articleContent = markdownToHtml(post.content);
  
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || '',
    "url": canonicalUrl,
    "datePublished": publishedAt,
    "dateModified": publishedAt,
    "image": ogImage,
    "author": { "@type": "Organization", "name": "LaptopAnalyzer", "url": SITE_URL },
    "publisher": {
      "@type": "Organization", "name": "LaptopAnalyzer", "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/favicon.png` }
    }
  });

  // Read the built index.html to get asset references (CSS/JS)
  const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  
  // Extract CSS links and JS scripts from built index.html
  const cssLinks = [...indexHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]
    .map(m => `<link rel="stylesheet" crossorigin href="${m[1]}">`).join('\n    ');
  const jsScripts = [...indexHtml.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*>/g)]
    .map(m => `<script type="module" crossorigin src="${m[1]}"></script>`).join('\n    ');
  // Also get modulepreload links
  const preloadLinks = [...indexHtml.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"[^>]*>/g)]
    .map(m => `<link rel="modulepreload" crossorigin href="${m[1]}">`).join('\n    ');

  return `<!doctype html>
<html lang="en">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GCSM48EDHV"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GCSM48EDHV');
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3065774138622922" crossorigin="anonymous"></script>
    
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <title>${fullTitle}</title>
    <meta name="title" content="${fullTitle}" />
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, noai, noimageai" />
    <meta name="author" content="LaptopAnalyzer" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:site_name" content="LaptopAnalyzer - Free Laptop Diagnostic Tool" />
    <meta property="article:published_time" content="${publishedAt}" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    
    <!-- Structured Data -->
    <script type="application/ld+json">${structuredData}</script>
    
    <meta name="theme-color" content="#0d1117" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
    <link rel="manifest" href="/manifest.json" />
    
    ${cssLinks}
    ${preloadLinks}
  </head>
  <body>
    <div id="root">
      <!-- Pre-rendered blog content for SEO crawlers -->
      <article style="max-width:768px;margin:0 auto;padding:80px 16px 64px;">
        <a href="/blog" style="display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;color:#0ea5e9;text-decoration:none;">← Back to Articles</a>
        ${categoryName ? `<span style="display:inline-block;padding:4px 12px;font-size:14px;border-radius:9999px;background:rgba(14,165,233,0.1);color:#0ea5e9;margin-bottom:16px;">${escapeHtml(categoryName)}</span>` : ''}
        <h1 style="font-size:2rem;font-weight:700;margin-bottom:16px;line-height:1.2;">${title}</h1>
        ${post.excerpt ? `<p style="font-size:1.25rem;color:#888;margin-bottom:16px;">${description}</p>` : ''}
        ${post.published_at ? `<time datetime="${publishedAt}" style="font-size:14px;color:#888;">${formatDate(publishedAt)}</time>` : ''}
        ${post.cover_image ? `<img src="${escapeHtml(post.cover_image)}" alt="${title}" style="width:100%;max-height:384px;object-fit:cover;border-radius:16px;margin:24px 0;" loading="lazy" />` : ''}
        <div class="blog-content" style="line-height:1.8;font-size:1.05rem;">
          ${articleContent}
        </div>
      </article>
    </div>
    ${jsScripts}
  </body>
</html>`;
}

async function main() {
  console.log('🔍 Fetching blog posts from database...');
  
  const posts = await fetchBlogPosts();
  console.log(`📝 Found ${posts.length} published blog posts`);
  
  for (const post of posts) {
    const dir = path.join(DIST_DIR, 'blog', post.slug);
    fs.mkdirSync(dir, { recursive: true });
    
    const html = generateBlogPostHtml(post);
    const filePath = path.join(dir, 'index.html');
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`  ✅ Generated: /blog/${post.slug}/index.html`);
  }
  
  // Also generate the blog index page with basic listing
  const blogDir = path.join(DIST_DIR, 'blog');
  if (!fs.existsSync(path.join(blogDir, 'index.html'))) {
    const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
    const cssLinks = [...indexHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)]
      .map(m => `<link rel="stylesheet" crossorigin href="${m[1]}">`).join('\n    ');
    const jsScripts = [...indexHtml.matchAll(/<script[^>]*type="module"[^>]*src="([^"]+)"[^>]*>/g)]
      .map(m => `<script type="module" crossorigin src="${m[1]}"></script>`).join('\n    ');
    const preloadLinks = [...indexHtml.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="([^"]+)"[^>]*>/g)]
      .map(m => `<link rel="modulepreload" crossorigin href="${m[1]}">`).join('\n    ');

    const postLinks = posts.map(p => 
      `<li style="margin-bottom:24px;"><a href="/blog/${p.slug}" style="color:#0ea5e9;font-size:1.2rem;font-weight:600;text-decoration:none;">${escapeHtml(p.title)}</a>${p.excerpt ? `<p style="color:#888;margin-top:4px;">${escapeHtml(p.excerpt)}</p>` : ''}${p.published_at ? `<time style="font-size:13px;color:#666;">${formatDate(p.published_at)}</time>` : ''}</li>`
    ).join('\n');

    const blogIndexHtml = `<!doctype html>
<html lang="en">
  <head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GCSM48EDHV"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GCSM48EDHV');</script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Laptop Testing Guides & Tips | LaptopAnalyzer Blog</title>
    <meta name="description" content="Learn how to test your laptop hardware with our expert guides. Tips for dead pixel detection, keyboard testing, webcam checks, and more laptop diagnostic tutorials." />
    <meta name="robots" content="index, follow, noai, noimageai" />
    <link rel="canonical" href="${SITE_URL}/blog" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE_URL}/blog" />
    <meta property="og:title" content="Laptop Testing Guides & Tips | LaptopAnalyzer Blog" />
    <meta property="og:description" content="Learn how to test your laptop hardware with our expert guides." />
    <meta property="og:image" content="${SITE_URL}/og-image.png" />
    <meta name="theme-color" content="#0d1117" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    ${cssLinks}
    ${preloadLinks}
  </head>
  <body>
    <div id="root">
      <div style="max-width:768px;margin:0 auto;padding:80px 16px 64px;">
        <h1 style="font-size:2.5rem;font-weight:700;text-align:center;margin-bottom:8px;">How It Works</h1>
        <p style="text-align:center;color:#888;margin-bottom:48px;">Learn about laptop diagnostics, understand test results, and get tips for buying or maintaining your device.</p>
        <ul style="list-style:none;padding:0;">${postLinks}</ul>
      </div>
    </div>
    ${jsScripts}
  </body>
</html>`;
    fs.writeFileSync(path.join(blogDir, 'index.html'), blogIndexHtml, 'utf-8');
    console.log('  ✅ Generated: /blog/index.html');
  }
  
  console.log('\n🎉 Blog pre-rendering complete!');
}

main().catch(err => {
  console.error('❌ Pre-render failed:', err);
  process.exit(1);
});
