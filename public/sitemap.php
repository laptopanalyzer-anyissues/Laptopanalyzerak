<?php
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');

$url = 'https://bcgiweqxociljuheyxwz.supabase.co/functions/v1/sitemap';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZ2l3ZXF4b2NpbGp1aGV5eHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxODcwNTksImV4cCI6MjA4Mjc2MzA1OX0.2iada8dArrf7In9eJTskKvnE8uzexoisc-XBBfl0tGA',
    'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZ2l3ZXF4b2NpbGp1aGV5eHd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxODcwNTksImV4cCI6MjA4Mjc2MzA1OX0.2iada8dArrf7In9eJTskKvnE8uzexoisc-XBBfl0tGA'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    echo $response;
} else {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>';
}
