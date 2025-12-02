-- Seed Data for Abalawe

-- Categories (Implicit in products for now, but good to have consistent)

-- Products
INSERT INTO public.products (name, slug, description, price, currency, image_urls, category, stock_quantity, is_active)
VALUES
  (
    'Premium Leather Backpack',
    'premium-leather-backpack',
    'Handcrafted from full-grain leather, this backpack is designed to last a lifetime. Features a padded laptop compartment and multiple organizational pockets.',
    129.99,
    'USD',
    ARRAY['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    'Accessories',
    50,
    true
  ),
  (
    'Minimalist Watch',
    'minimalist-watch',
    'A sleek and modern timepiece for the everyday professional. Water-resistant and features a genuine leather strap.',
    199.50,
    'USD',
    ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80'],
    'Watches',
    30,
    true
  ),
  (
    'Wireless Noise-Cancelling Headphones',
    'wireless-headphones',
    'Immerse yourself in music with our industry-leading noise cancellation technology. 30-hour battery life.',
    249.00,
    'USD',
    ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    'Electronics',
    100,
    true
  ),
  (
    'Organic Cotton T-Shirt',
    'organic-cotton-tshirt',
    'Made from 100% organic cotton, this t-shirt is soft, breathable, and eco-friendly. Available in multiple colors.',
    35.00,
    'USD',
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    'Apparel',
    200,
    true
  );
