import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/contexts/auth-context'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'mycompAIny - Virtual AI Departments for Solopreneurs',
  description: 'Transform your solo business with AI-powered virtual departments. Streamline operations, boost efficiency, and scale your business with intelligent automation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.className} overflow-y-auto`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col">
              <SiteHeader />
              <main className="flex-1">
                {children}
              </main>
              <SiteFooter />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}