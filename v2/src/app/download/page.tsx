import Image from "next/image";
import { getDownloadables } from "@/lib/data";

export default async function DownloadPage() {
  const downloadables = await getDownloadables();

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Resources
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
          Downloads
        </h1>
        <div className="h-px w-16 bg-border" />
      </div>

      {downloadables.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {downloadables.map((item) => (
            <a
              key={item.id}
              href={item.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <span className="truncate text-sm font-medium">{item.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No downloads available at the moment.
        </p>
      )}
    </div>
  );
}
