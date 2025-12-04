export const metadata = {
    title: 'Shipping Policy | Abalawe',
    description: 'Information about our shipping policies.',
}

export default function ShippingPage() {
    return (
        <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Shipping Policy</h1>

            <div className="prose prose-gray max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">Order Processing</h2>
                    <p className="text-muted-foreground">
                        All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
                        If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Shipping Rates & Delivery Estimates</h2>
                    <p className="text-muted-foreground mb-4">
                        Shipping charges for your order will be calculated and displayed at checkout.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li><strong>Standard Shipping:</strong> 3-5 business days</li>
                        <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
                        <li><strong>Overnight Shipping:</strong> 1 business day</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">International Shipping</h2>
                    <p className="text-muted-foreground">
                        We currently ship to select countries. International shipping rates and delivery times vary by destination.
                        Please note that you may be responsible for customs duties and taxes upon delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">Shipment Confirmation & Order Tracking</h2>
                    <p className="text-muted-foreground">
                        You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).
                        The tracking number will be active within 24 hours.
                    </p>
                </section>
            </div>
        </div>
    )
}
