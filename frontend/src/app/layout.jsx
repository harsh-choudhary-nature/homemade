import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "@/components/AuthGate/AuthGate";
import { Suspense } from "react";
import Loader from "@/components/Loader/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HomeMade",
  description: "An one stop buying and selling spot for all home-made items",
  icons: {
    icon: "/img/favicon_io/favicon.ico", // relative to /public
  },
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Suspense fallback={<Loader />}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </body>
    </html>
  );
}
