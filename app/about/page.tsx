import Image from 'next/image'

export const metadata = {
    title: 'About Us | Abalawe',
    description: 'Learn more about Abalawe and our mission.',
}

export default function AboutPage() {
    return (
        <div className="container px-4 md:px-6 py-12 max-w-5xl mx-auto">
            <div className="flex flex-col gap-12">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Story</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Redefining the online shopping experience with premium quality and exceptional service.
                    </p>
                </div>

                {/* Content Section 1 */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden">
                        {/* Placeholder for a brand image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/30">
                            Brand Image
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold">Who We Are</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Abalawe was founded with a simple mission: to provide high-quality products that enhance your lifestyle.
                            We believe that shopping should be more than just a transaction; it should be an experience.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Our team is dedicated to curating a collection of items that meet our strict standards for quality,
                            design, and sustainability. We work directly with manufacturers to ensure that every product
                            we sell is something we would be proud to own ourselves.
                        </p>
                    </div>
                </div>

                {/* Content Section 2 */}
                <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                    <div className="space-y-6 order-2 md:order-1">
                        <h2 className="text-3xl font-bold">Our Values</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xl font-bold text-primary">1</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">Quality First</h3>
                                    <p className="text-muted-foreground">We never compromise on the quality of our products.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xl font-bold text-primary">2</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">Customer Obsession</h3>
                                    <p className="text-muted-foreground">Your satisfaction is our top priority.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xl font-bold text-primary">3</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">Sustainability</h3>
                                    <p className="text-muted-foreground">We are committed to responsible business practices.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative aspect-square bg-muted rounded-2xl overflow-hidden order-1 md:order-2">
                        {/* Placeholder for values image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/30">
                            Values Image
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
