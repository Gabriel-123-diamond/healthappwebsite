import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Global Health AI",
  description: "AI-Powered Orthodox & Herbal Health Search",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 font-sans">
        <AuthProvider>
          <Navbar />
          <div className="pt-0 md:pt-16 pb-16 md:pb-0 min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}