import Image from "next/image";
import { getIntro } from "@/lib/data";

export default async function ContactPage() {
  const intro = await getIntro("contact");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-light uppercase tracking-[0.4em] text-muted-foreground">
          Get in Touch
        </p>
        <h1 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
          Contact Us
        </h1>
        <div className="h-px w-16 bg-border" />
      </div>

      {intro ? (
        <div className="mt-12 space-y-12">
          {intro.content && (
            <div className="mx-auto max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {intro.content}
            </div>
          )}

          {intro.images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {intro.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
                >
                  <Image
                    src={image.url}
                    alt={`Contact ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          Content coming soon.
        </p>
      )}
    </div>
  );
}
