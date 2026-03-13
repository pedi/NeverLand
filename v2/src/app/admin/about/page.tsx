import { getIntro } from "@/lib/data";
import { IntroEditor } from "@/components/admin/intro-editor";

export default async function AboutPage() {
  const intro = await getIntro("about");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">About</h1>
        <p className="text-sm text-muted-foreground">
          Manage about page content and images.
        </p>
      </div>
      <IntroEditor
        type="about"
        content={intro?.content ?? ""}
        images={intro?.images ?? []}
      />
    </div>
  );
}
