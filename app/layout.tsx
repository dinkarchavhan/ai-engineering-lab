import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AI Engineering Lab — Learn, visualize, build, deploy",
  description:
    "An interactive AI Engineering learning platform. Twenty-seven tracks from Python and math to multi-agent systems, MCP, and production LLM infrastructure.",
  keywords: [
    "AI engineering",
    "LLM",
    "RAG",
    "agents",
    "PyTorch",
    "transformers",
    "MCP",
    "vector database",
    "fine-tuning",
    "AI production",
  ],
  openGraph: {
    title: "AI Engineering Lab",
    description:
      "Learn AI Engineering from first principles to production — 27 tracks, 60+ projects.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if((t?t==='dark':d))document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
