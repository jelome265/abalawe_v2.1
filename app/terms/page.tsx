export const metadata = {
    title: 'Terms of Service | Abalawe',
    description: 'Terms and conditions for using our services.',
}

export default function TermsPage() {
    return (
        <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>

            <div className="prose prose-gray max-w-none space-y-6">
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
                    <p className="text-muted-foreground">
                        By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                        If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                    <p className="text-muted-foreground">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Abalawe's website for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">3. Disclaimer</h2>
                    <p className="text-muted-foreground">
                        The materials on Abalawe's website are provided on an 'as is' basis. Abalawe makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                        fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">4. Limitations</h2>
                    <p className="text-muted-foreground">
                        In no event shall Abalawe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                        or due to business interruption) arising out of the use or inability to use the materials on Abalawe's website.
                    </p>
                </section>
            </div>
        </div>
    )
}
