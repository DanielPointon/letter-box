import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/navbar";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { ReviewsProvider } from "@/context/reviewsContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <nav style={{"zIndex": "1000"}} className="fixed w-full z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex h-28 items-center justify-between">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 shadow-lg">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Insightify
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">Advanced Customer Insights Platform</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center">
                <div className="flex items-center space-x-8 mr-10">
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-lg">
                    Dashboard
                  </Link>
                </div>

                <div className="flex items-center space-x-2 py-3 px-5 bg-gray-800/50 rounded-lg border border-gray-700">
                  <span className="text-sm text-gray-300">
                    Powered by <span className="font-semibold text-blue-400">Gemini Nano</span>
                  </span>
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-28 min-h-screen bg-gray-900">
          <ReviewsProvider>
            {children}
          </ReviewsProvider>
        </main>
      </body>
    </html>
  );
}