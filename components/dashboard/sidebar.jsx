"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, FolderOpen, Calendar, Settings, HelpCircle, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogoAvatar } from "@/components/ui/avatar"

const getLawyerNavItems = () => [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cases", href: "/dashboard/cases", icon: FileText },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
]

const getClientNavItems = () => [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Cases", href: "/dashboard/cases", icon: FileText },
  { name: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
]

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()

  // Determine if user is lawyer or client
  const isLawyer = user?.role === "lawyer"
  const navItems = isLawyer ? getLawyerNavItems() : getClientNavItems()

  return (
    <div className="flex h-full w-48 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <LogoAvatar src="/adhivakta_logo_whie.png" alt="Adhivakta Logo" size={56} />
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <nav className="grid gap-1 px-2 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </Button>
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role === "lawyer" ? "Lawyer" : "Client"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
