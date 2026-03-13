import Link from "next/link";
import { requireAdmin } from "@/lib/auth-server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  Package,
  FolderTree,
  Paintbrush,
  Layers,
  Image,
  Users,
  Download,
  Mail,
  Info,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/fabrics", label: "Fabrics", icon: Paintbrush },
  { href: "/admin/materials", label: "Materials", icon: Layers },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/about", label: "About", icon: Info },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-56 shrink-0 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b px-4 py-3">
            <Link href="/admin" className="text-sm font-semibold tracking-tight">
              NEVERLAND Admin
            </Link>
          </div>
          <nav className="flex-1 space-y-0.5 px-2 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-12 items-center border-b bg-background px-4 lg:hidden">
          <AdminSidebar />
          <span className="ml-3 text-sm font-semibold tracking-tight">
            NEVERLAND Admin
          </span>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
