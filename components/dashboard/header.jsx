"use client"

import { useState } from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "./sidebar"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {isSearchOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-2/3 lg:w-1/3"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full justify-start text-muted-foreground md:w-2/3 lg:w-1/3"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Search...
          </Button>
        )}
      </div>

      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
      </Button>
    </header>
  )
}
