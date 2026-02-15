import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavWrapper from "./components/NavWrapper";
import { Providers } from "./providers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Creative Portfolio - Design & Development",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <NavWrapper>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-all duration-300">
              <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <a href="/" className="text-xl font-bold tracking-tight hover:opacity-60 transition-opacity">
                  PORTFOLIO-DEMO
                </a>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="flex gap-8 text-sm text-gray-600 dark:text-gray-400">
                    <a href="/works" className="hover:text-black dark:hover:text-white transition-colors">Works</a>
                    <a href="/exhibitions" className="hover:text-black dark:hover:text-white transition-colors">Exhibitions</a>
                    <a href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</a>
                    <a href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Mobile Navigation */}
                <MobileMenu />
              </nav>
            </header>
          </NavWrapper>
          <NavWrapper>
            <div className="pt-0" />
          </NavWrapper>
          <main>
            {children}
          </main>
          <NavWrapper>
            <footer className="border-t border-gray-100 dark:border-gray-800 mt-4">
              <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
                © PORTFOLIO-DEMO
              </div>
            </footer>
          </NavWrapper>
        </Providers>
      </body>
    </html>
  );
}
