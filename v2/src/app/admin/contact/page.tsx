import { getIntro } from "@/lib/data";
import { IntroEditor } from "@/components/admin/intro-editor";

export default async function ContactPage() {
  const intro = await getIntro("contact");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Manage contact page content and images.
        </p>
      </div>
      <IntroEditor
        type="contact"
        content={intro?.content ?? ""}
        images={intro?.images ?? []}
      />
    </div>
  );
}
