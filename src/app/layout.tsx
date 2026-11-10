import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Sidebar, SiteName } from "@/components/Sidebar";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.short,
};

// Runs before paint so the saved theme applies without a flash.
// Dark is the default; only an explicit "light" choice turns it off.
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <div className="page-backdrop" aria-hidden="true" />
        <div className="mx-auto grid min-h-screen max-w-6xl grid-rows-[auto_auto_1fr_auto] px-5 sm:px-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
          <SiteName />
          <Navbar />
          <Sidebar />
          {/* The vertical rule starts level with the profile picture, so it
              never meets the line under the navbar. */}
          <main className="relative min-w-0 py-10 lg:py-12 lg:pl-10 lg:before:absolute lg:before:top-8 lg:before:bottom-0 lg:before:left-0 lg:before:w-px lg:before:bg-line">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
