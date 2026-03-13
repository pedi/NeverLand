import { MaterialAddForm } from "@/components/admin/material-add-form";

export default function AddMaterialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Add Material</h1>
        <p className="text-sm text-muted-foreground">
          Upload a new material with image.
        </p>
      </div>
      <MaterialAddForm />
    </div>
  );
}
