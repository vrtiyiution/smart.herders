// app/layout.js
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import ThemeToggle from "./components/ThemeToggle";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";

const outfit = Outfit({
  subsets: ["latin", "cyrillic"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Smart Herders",
  description: "Малчин, хэрэглэгчдэд зориулсан онлайн зах",
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans min-h-screen bg-background text-foreground tracking-wide transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
              <Navbar />
            </div>

            <main className="pt-24 min-h-screen">
              {children}
            </main>

            <div className="fixed bottom-6 right-6 z-50">
              <ThemeToggle />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}