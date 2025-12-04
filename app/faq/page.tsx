export const metadata = {
    title: 'FAQ | Abalawe',
    description: 'Frequently Asked Questions.',
}

export default function FAQPage() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Shipping times vary depending on your location. Typically, orders are processed within 1-2 business days and delivered within 3-7 business days."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unused items in their original packaging. Please visit our Returns page for more information."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to select international destinations. Shipping costs and delivery times will be calculated at checkout."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order has shipped, you will receive an email with a tracking number. You can also track your order status in your account dashboard."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards, PayPal, and PayChangu for secure payments."
        }
    ]

    return (
        <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
                <p className="text-muted-foreground">
                    Find answers to common questions about our products and services.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span>{faq.question}</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                                {faq.answer}
                            </p>
                        </details>
                    </div>
                ))}
            </div>
        </div>
    )
}
