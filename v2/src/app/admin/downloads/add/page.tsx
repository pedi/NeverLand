import { DownloadAddForm } from "@/components/admin/download-add-form";

export default function AddDownloadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Add Download</h1>
        <p className="text-sm text-muted-foreground">
          Add a new downloadable resource with thumbnail.
        </p>
      </div>
      <DownloadAddForm />
    </div>
  );
}
