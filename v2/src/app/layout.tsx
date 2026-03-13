import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";
import { getCategories } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEVERLAND® — Furniture",
  description:
    "Premium furniture crafted with timeless elegance. Explore the NEVERLAND collection.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Navbar categories={categories} />
          <main className="min-h-[calc(100dvh-8rem)]">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
