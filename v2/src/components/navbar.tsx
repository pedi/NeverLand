"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Instagram, Menu, ChevronRight } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

interface NavbarProps {
  categories?: Category[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  const activeCategories = categories.filter((c) => !c.deleted);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(auth);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <span className="text-lg font-light tracking-[0.3em] text-foreground">
            NEVERLAND
          </span>
          <sup className="ml-0.5 text-[9px] font-light text-muted-foreground">
            ®
          </sup>
        </Link>

        <DesktopNav
          categories={activeCategories}
          user={user}
          userProfile={userProfile}
          loading={loading}
          onLogout={handleLogout}
        />

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="https://www.instagram.com/neverland_furniture/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Instagram className="size-4" />
          </a>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden" />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-base font-light tracking-[0.3em]">
                  NEVERLAND<sup className="text-[8px]">®</sup>
                </SheetTitle>
              </SheetHeader>
              <MobileNav
                categories={activeCategories}
                expandedCategory={expandedCategory}
                onToggleCategory={(id) =>
                  setExpandedCategory(expandedCategory === id ? null : id)
                }
                onNavigate={() => setMobileOpen(false)}
                user={user}
                userProfile={userProfile}
                loading={loading}
                onLogout={handleLogout}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function DesktopNav({
  categories,
  user,
  userProfile,
  loading,
  onLogout,
}: {
  categories: Category[];
  user: import("firebase/auth").User | null;
  userProfile: import("@/lib/types").UserProfile | null;
  loading: boolean;
  onLogout: () => void;
}) {
  return (
    <div className="hidden items-center gap-6 lg:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/about"
              className="px-3 py-2 text-sm font-light tracking-wide text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/contact"
              className="px-3 py-2 text-sm font-light tracking-wide text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent px-3 py-2 text-sm font-light tracking-wide text-muted-foreground hover:bg-transparent hover:text-foreground data-popup-open:bg-transparent">
              Catalogue
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-2">
              <ul className="w-56 space-y-0.5">
                <li>
                  <NavigationMenuLink
                    href="/new-arrivals"
                    className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    New Arrivals
                  </NavigationMenuLink>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    {category.subcategories.filter((s) => !s.deleted).length >
                    0 ? (
                      <CatalogueSubMenu category={category} />
                    ) : (
                      <NavigationMenuLink
                        href={`/category/${category.name}`}
                        className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        {category.displayName || category.name}
                      </NavigationMenuLink>
                    )}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/download"
              className="px-3 py-2 text-sm font-light tracking-wide text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
            >
              Download
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <a
        href="https://www.instagram.com/neverland_furniture/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <Instagram className="size-4" />
      </a>

      {!loading && (
        <>
          {userProfile?.superUser && (
            <Link
              href="/admin"
              className="text-sm font-light tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={onLogout}
              className="text-sm font-light tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-light tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Login
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function CatalogueSubMenu({ category }: { category: Category }) {
  const activeSubs = category.subcategories.filter((s) => !s.deleted);
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavigationMenuLink
        href={`/category/${category.name}`}
        className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
      >
        {category.displayName || category.name}
        <ChevronRight className="size-3 text-muted-foreground" />
      </NavigationMenuLink>
      {open && (
        <div className="absolute left-full top-0 z-50 ml-1 min-w-44 rounded-lg border border-border bg-popover p-1 shadow-md">
          {activeSubs.map((sub) => (
            <a
              key={sub.id}
              href={`/subcategory/${sub.name}`}
              className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              {sub.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNav({
  categories,
  expandedCategory,
  onToggleCategory,
  onNavigate,
  user,
  userProfile,
  loading,
  onLogout,
}: {
  categories: Category[];
  expandedCategory: string | null;
  onToggleCategory: (id: string) => void;
  onNavigate: () => void;
  user: import("firebase/auth").User | null;
  userProfile: import("@/lib/types").UserProfile | null;
  loading: boolean;
  onLogout: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-4 pb-6">
      <Link
        href="/about"
        onClick={onNavigate}
        className="py-2.5 text-sm font-light tracking-wide text-foreground"
      >
        About
      </Link>
      <Link
        href="/contact"
        onClick={onNavigate}
        className="py-2.5 text-sm font-light tracking-wide text-foreground"
      >
        Contact
      </Link>

      <div className="py-2">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Catalogue
        </span>
      </div>

      <Link
        href="/new-arrivals"
        onClick={onNavigate}
        className="py-2 pl-3 text-sm font-medium text-foreground"
      >
        New Arrivals
      </Link>

      {categories.map((category) => {
        const activeSubs = category.subcategories.filter((s) => !s.deleted);
        const isExpanded = expandedCategory === category.id;

        if (activeSubs.length === 0) {
          return (
            <Link
              key={category.id}
              href={`/category/${category.name}`}
              onClick={onNavigate}
              className="py-2 pl-3 text-sm text-foreground"
            >
              {category.displayName || category.name}
            </Link>
          );
        }

        return (
          <div key={category.id}>
            <button
              onClick={() => onToggleCategory(category.id)}
              className="flex w-full items-center justify-between py-2 pl-3 text-sm text-foreground"
            >
              {category.displayName || category.name}
              <ChevronRight
                className={`size-3.5 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
            {isExpanded && (
              <div className="ml-3 border-l border-border pl-3">
                {activeSubs.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/subcategory/${sub.name}`}
                    onClick={onNavigate}
                    className="block py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Link
        href="/download"
        onClick={onNavigate}
        className="py-2.5 text-sm font-light tracking-wide text-foreground"
      >
        Download
      </Link>

      <div className="my-2 h-px bg-border" />

      {!loading && (
        <>
          {userProfile?.superUser && (
            <Link
              href="/admin"
              onClick={onNavigate}
              className="py-2.5 text-sm font-light tracking-wide text-foreground"
            >
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                onLogout();
                onNavigate();
              }}
              className="py-2.5 text-left text-sm font-light tracking-wide text-foreground"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={onNavigate}
              className="py-2.5 text-sm font-light tracking-wide text-foreground"
            >
              Login
            </Link>
          )}
        </>
      )}
    </nav>
  );
}
