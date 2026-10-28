import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import AppShell from "@/components/AppShell";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Nexora | Agentic Workspace",
  description: "Your AI workspace for intelligent agents and automated workflows.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider appearance={{ theme: dark , variables: { colorPrimary: "oklch(0.74 0.16 55.4)" }, }}>
      <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <AppShell>{children}</AppShell>
        </TooltipProvider>
        <Toaster richColors />
      </body>
    </html>
    </ClerkProvider>
  );
}
