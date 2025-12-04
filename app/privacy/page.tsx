export const metadata = {
    title: 'Privacy Policy | Abalawe',
    description: 'Our commitment to protecting your privacy.',
}

export default function PrivacyPage() {
    return (
        <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>

            <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                    <p className="text-muted-foreground">
                        Welcome to Abalawe. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
                    <p className="text-muted-foreground">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Identity Data (name, username)</li>
                        <li>Contact Data (email, address, phone number)</li>
                        <li>Financial Data (payment details)</li>
                        <li>Transaction Data (details about payments and orders)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
                    <p className="text-muted-foreground">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>
            </div>
        </div>
    )
}
