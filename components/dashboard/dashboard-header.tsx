"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Brain, Bell, Settings } from "lucide-react"
import { ModeToggle } from "@/components/layout/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span className="text-xl font-bold">mycompAIny</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
            Main Room
          </Link>
          <Link href="/ai-teams" className="text-muted-foreground hover:text-foreground">
            AI Teams
          </Link>
          <Link href="/dashboard/reports" className="text-muted-foreground hover:text-foreground">
            Reports
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm text-muted-foreground">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  )
}