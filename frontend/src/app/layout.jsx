import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/components/NavbarWrapper";
import { UserProvider } from "@/contexts/UserContext";
import Loader from "@/components/Loader";
import { Suspense } from "react";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <div className="App">
            <Suspense fallback={<Loader />}>
              <NavbarWrapper />
            </Suspense>
            <main>
              <Suspense fallback={<Loader />}>
                {children}
              </Suspense>
            </main>
            <Footer />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
