import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import ToastProvider from "@/components/Toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "NOIRÉ — Contemporary Dining",
    template: "%s | NOIRÉ",
  },
  description:
    "NOIRÉ is a contemporary restaurant offering seasonal cuisine, thoughtful hospitality and an intimate dining experience.",
  keywords: [
    "restaurant",
    "fine dining",
    "contemporary cuisine",
    "seasonal menu",
    "NOIRÉ",
  ],
  openGraph: {
    title: "NOIRÉ — Contemporary Dining",
    description:
      "Seasonal ingredients, expressive cooking and an intimate setting in the heart of the city.",
    type: "website",
    locale: "en_US",
    siteName: "NOIRÉ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ToastProvider>
          <div className="site-header">
            <AnnouncementBar />
            <Navbar />
          </div>
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}