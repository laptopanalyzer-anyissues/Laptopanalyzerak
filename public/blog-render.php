<?php
/**
 * Blog Static HTML Handler
 * Serves pre-rendered blog HTML files directly.
 * This bypasses .htaccess directory-based routing issues on Hostinger.
 */

$requestUri = $_SERVER['REQUEST_URI'];

// Strip query string and trailing slash
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');

// Handle /blog index
if ($path === '/blog' || $path === '/blog/') {
    $file = __DIR__ . '/blog/index.html';
    if (file_exists($file)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($file);
        exit;
    }
}

// Handle /blog/{slug}
if (preg_match('#^/blog/([a-z0-9\-]+)$#', $path, $matches)) {
    $slug = $matches[1];
    $file = __DIR__ . '/blog/' . $slug . '/index.html';
    if (file_exists($file)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($file);
        exit;
    }
}

// Fallback: serve main SPA index.html
$fallback = __DIR__ . '/index.html';
if (file_exists($fallback)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($fallback);
    exit;
}

http_response_code(404);
echo 'Page not found';
