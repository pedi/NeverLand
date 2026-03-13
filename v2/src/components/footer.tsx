import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs tracking-widest text-muted-foreground">
          &copy; 2026 NEVERLAND
        </p>
        <a
          href="https://www.instagram.com/neverland_furniture/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Instagram className="size-4" />
        </a>
      </div>
    </footer>
  );
}
