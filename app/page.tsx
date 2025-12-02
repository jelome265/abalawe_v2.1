import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'

// Mock data for now - in a real app this would come from Supabase
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Premium Leather Backpack',
    slug: 'premium-leather-backpack',
    price: 129.99,
    currency: 'USD',
    image_urls: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    category: 'Accessories',
  },
  {
    id: '2',
    name: 'Minimalist Watch',
    slug: 'minimalist-watch',
    price: 199.50,
    currency: 'USD',
    image_urls: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80'],
    category: 'Watches',
  },
  {
    id: '3',
    name: 'Wireless Noise-Cancelling Headphones',
    slug: 'wireless-headphones',
    price: 249.00,
    currency: 'USD',
    image_urls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    category: 'Electronics',
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    price: 35.00,
    currency: 'USD',
    image_urls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    category: 'Apparel',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-muted/40 py-24 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Elevate Your Lifestyle
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Discover our curated collection of premium goods. Designed for quality, crafted for you.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">Explore Categories</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Arrivals</h2>
          <Link href="/products" className="text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories Grid (Visual Only) */}
      <section className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Electronics', 'Apparel', 'Accessories'].map((category) => (
            <Link 
              key={category} 
              href={`/categories/${category.toLowerCase()}`}
              className="group relative h-64 overflow-hidden rounded-lg bg-muted"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                <h3 className="text-2xl font-bold text-white">{category}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
