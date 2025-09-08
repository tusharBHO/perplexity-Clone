// layout.js
'use client'
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { SearchTypeProvider } from "../context/SearchTypeContext";
import { SearchCategoryProvider } from "../context/searchCategoryContext";
import { AiModelProvider } from "../context/aiModelContext";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "../context/ThemeContext"; // 👈 import it
import { ToastProvider } from "../context/ToastContext";
// import RootWrapper from './_components/RootWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname.startsWith("/profile"); // 👈 hides on settings

  return (
    <ClerkProvider>
      <html lang="en">
        {/* <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `   
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    var mql = window.matchMedia('(prefers-color-scheme: dark)');
                    theme = mql.matches ? 'dark' : 'light';
                  }
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
            }}
          />
        </head> */}
        <body
        >
          <ThemeProvider>   {/* 👈 wrap here */}
            {/* <RootWrapper> Wrap here */}
              <ToastProvider> {/* Toast context inside ThemeProvider */}
                <SidebarProvider>
                  <SearchTypeProvider>
                    <SearchCategoryProvider>
                      <AiModelProvider>
                        {!hideSidebar && <AppSidebar />}
                        <Provider>
                          {children}
                        </Provider>
                      </AiModelProvider>
                    </SearchCategoryProvider>
                  </SearchTypeProvider>
                </SidebarProvider>
              </ToastProvider>
            {/* </RootWrapper> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}