import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAHAAYA — From messy situations to clear actions",
  description:
    "SAHAAYA uses Gemini to transform messy real-world information into structured, cautious, actionable next steps.",
  keywords: [
    "SAHAAYA",
    "Gemini AI",
    "Social Good",
    "Decision Support",
    "Emergency Navigation",
    "Verified Action",
  ],
  authors: [{ name: "SAHAAYA Core Team" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='m9 12 2 2 4-4'/></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

const themeInitScript = `
  (function() {
    try {
      var saved = localStorage.getItem('sahaaya_theme');
      var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) || (saved === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className="font-sans antialiased bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white min-h-screen flex flex-col transition-colors duration-200"
      >
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
