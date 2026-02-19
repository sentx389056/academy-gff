import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {TooltipProvider} from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Академия Госфильмофонда России",
  description:
    "Профессиональное образование в области киноискусства и наследия. Сохраняем традиции и создаём будущее кино.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
      <TooltipProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
      </TooltipProvider>
      </body>
    </html>
  );
}
