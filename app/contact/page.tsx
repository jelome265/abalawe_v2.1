import { Button } from '@/components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata = {
    title: 'Contact Us | Abalawe',
    description: 'Get in touch with our team.',
}

export default function ContactPage() {
    return (
        <div className="container px-4 md:px-6 py-12 max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Have a question or feedback? We&apos;d love to hear from you. Fill out the form below or reach out to us directly.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                            <p className="text-muted-foreground mb-2">Our friendly team is here to help.</p>
                            <a href="mailto:support@abalawe.com" className="font-medium hover:underline">support@abalawe.com</a>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Visit Us</h3>
                            <p className="text-muted-foreground mb-2">Come say hello at our office headquarters.</p>
                            <p className="font-medium">123 Commerce St, Market City, 12345</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                            <Phone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                            <p className="text-muted-foreground mb-2">Mon-Fri from 8am to 5pm.</p>
                            <a href="tel:+15550000000" className="font-medium hover:underline">+1 (555) 000-0000</a>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium">First name</label>
                                <Input id="first-name" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium">Last name</label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
