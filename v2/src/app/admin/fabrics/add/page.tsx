import { FabricAddForm } from "@/components/admin/fabric-add-form";

export default function AddFabricPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Add Fabric</h1>
        <p className="text-sm text-muted-foreground">
          Upload a new fabric with image.
        </p>
      </div>
      <FabricAddForm />
    </div>
  );
}
