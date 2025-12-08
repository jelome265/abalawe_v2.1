import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { CartProvider } from "@/components/providers/cart-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Abalawe | Premium E-commerce",
    description: "A modern shopping experience.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
                <CartProvider>
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                    <Toaster richColors position="top-center" />
                </CartProvider>
            </body>
        </html>
    );
}
