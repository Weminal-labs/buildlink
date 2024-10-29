import type { Metadata } from "next";
import localFont from "next/font/local";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { WalletProvider } from "@/components/providers/near-wallet-provider";
import "@near-wallet-selector/modal-ui/styles.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
  title: "BuildLink",
  description: "Made with ♥︎ by Weminal labs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletProvider>
            <SidebarProvider>
              <Toaster />
              <main className="flex-1">{children}</main>
            </SidebarProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
