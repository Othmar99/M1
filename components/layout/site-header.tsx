"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/contexts/auth-context"

export function SiteHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="text-xl font-bold">mycompAIny</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/#features" className="text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="/#pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
          <Link href="/#faq" className="text-muted-foreground hover:text-foreground">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}