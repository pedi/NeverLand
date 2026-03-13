import Link from "next/link";
import { getDownloadables } from "@/lib/data";
import { DownloadList } from "@/components/admin/download-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DownloadsPage() {
  const downloadables = await getDownloadables();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Downloads</h1>
          <p className="text-sm text-muted-foreground">
            {downloadables.length} downloadable{downloadables.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button render={<Link href="/admin/downloads/add" />} size="sm">
          <Plus className="mr-1 size-3.5" />
          Add Download
        </Button>
      </div>
      <DownloadList items={downloadables} />
    </div>
  );
}
