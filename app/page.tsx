import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product/product-card'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch featured products from Supabase
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

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
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {featuredProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {!featuredProducts?.length && (
            <p className="col-span-full text-center text-muted-foreground">No featured products found.</p>
          )}
        </div>
      </section>

      {/* Categories Grid (Visual Only) */}
      <section className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Electronics',
              image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Apparel',
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
            },
            {
              name: 'Accessories',
              image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=800&q=80',
            },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              className="group relative h-64 overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-colors group-hover:bg-black/50">
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
