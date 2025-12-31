-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create public read policies (blog is public content)
CREATE POLICY "Blog categories are publicly readable" 
ON public.blog_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Published blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Display Tests', 'display-tests', 'Learn about display testing, dead pixel detection, and screen quality'),
('Audio Tests', 'audio-tests', 'Everything about speaker and microphone testing'),
('Input Devices', 'input-devices', 'Keyboard and touchpad testing guides'),
('Network & Connectivity', 'network-connectivity', 'Network speed testing and port diagnostics'),
('Buying Guides', 'buying-guides', 'Tips for buying new or used laptops'),
('General', 'general', 'General articles about laptop diagnostics');

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category_id, published, published_at) VALUES
(
  'How Dead Pixel Detection Works',
  'how-dead-pixel-detection-works',
  'Learn how our display test identifies stuck and dead pixels on your laptop screen.',
  '# How Dead Pixel Detection Works

Dead pixels are defective pixels on your LCD screen that fail to display the correct color. Our dead pixel test helps you identify these issues quickly.

## Types of Pixel Defects

1. **Dead Pixels** - Permanently black, the pixel is completely non-functional
2. **Stuck Pixels** - Display only one color (red, green, or blue)
3. **Hot Pixels** - Always white or very bright

## How Our Test Works

Our test displays solid colors (red, green, blue, white, black) across your entire screen. Against these solid backgrounds, any defective pixels become immediately visible.

## Tips for Testing

- Test in a dark room for best visibility
- Use fullscreen mode
- Check each color carefully, especially in corners
- Take your time - some defects are subtle',
  (SELECT id FROM public.blog_categories WHERE slug = 'display-tests'),
  true,
  now()
),
(
  'Understanding Network Speed Tests',
  'understanding-network-speed-tests',
  'Discover what download speed, upload speed, ping, and jitter really mean for your connection.',
  '# Understanding Network Speed Tests

Network speed tests measure several key metrics that determine your internet connection quality.

## Key Metrics Explained

### Download Speed
How fast you can pull data from the internet to your device. Important for streaming, downloading files, and browsing.

### Upload Speed
How fast you can send data from your device to the internet. Critical for video calls, uploading files, and live streaming.

### Ping (Latency)
The time it takes for data to travel to a server and back, measured in milliseconds. Lower is better, especially for gaming.

### Jitter
The variation in ping times. High jitter means inconsistent connection quality.

## What Speeds Do You Need?

- **Basic browsing**: 5-10 Mbps
- **HD streaming**: 25 Mbps
- **4K streaming**: 50+ Mbps
- **Online gaming**: Low ping (<50ms) matters more than raw speed',
  (SELECT id FROM public.blog_categories WHERE slug = 'network-connectivity'),
  true,
  now()
),
(
  'Keyboard Testing: A Complete Guide',
  'keyboard-testing-complete-guide',
  'Everything you need to know about testing your laptop keyboard for functionality and responsiveness.',
  '# Keyboard Testing: A Complete Guide

Your laptop keyboard is one of the most used components. Here is how to properly test it.

## What We Test

1. **Key Registration** - Does every key register when pressed?
2. **Key Combinations** - Do modifier keys (Shift, Ctrl, Alt) work properly?
3. **N-Key Rollover** - Can multiple keys be pressed simultaneously?

## Common Issues to Look For

- **Ghost keys** - Keys that register without being pressed
- **Dead keys** - Keys that do not register at all
- **Sticky keys** - Keys that register multiple times
- **Delayed response** - Noticeable lag between press and registration

## Testing Tips

- Press each key individually
- Test all modifier combinations
- Try typing sentences to test natural usage
- Check special keys (Function row, media keys)',
  (SELECT id FROM public.blog_categories WHERE slug = 'input-devices'),
  true,
  now()
),
(
  'What to Check When Buying a Used Laptop',
  'what-to-check-buying-used-laptop',
  'Essential hardware checks to perform before purchasing a second-hand laptop.',
  '# What to Check When Buying a Used Laptop

Buying a used laptop can save you money, but you need to verify the hardware works correctly.

## Essential Checks

### Display
- Run dead pixel tests
- Check for backlight bleeding
- Test at different brightness levels

### Keyboard & Trackpad
- Test every key
- Check trackpad responsiveness
- Verify multi-touch gestures

### Camera & Microphone
- Test video quality
- Check audio recording
- Verify both work in video calls

### Speakers
- Play audio through built-in speakers
- Check for distortion at high volume
- Test stereo separation

### Ports & Connectivity
- Test all USB ports
- Verify charging port condition
- Check WiFi and Bluetooth

### Battery
- Check battery health percentage
- Test actual runtime
- Look for swelling

Our diagnostic suite tests all of these components quickly and thoroughly.',
  (SELECT id FROM public.blog_categories WHERE slug = 'buying-guides'),
  true,
  now()
);