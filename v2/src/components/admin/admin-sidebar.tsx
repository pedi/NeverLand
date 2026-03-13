"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowLeft, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function AdminSidebar({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>NEVERLAND Admin</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-0.5 px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                pathname.startsWith(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t px-2 py-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
