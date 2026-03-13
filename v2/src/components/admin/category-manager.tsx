"use client";

import { useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import {
  updateCategory,
  toggleCategoryDelete,
  addCategory,
  addSubcategory,
  toggleSubcategoryDelete,
  renameSubcategory,
} from "@/app/admin/categories/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Pencil,
  Plus,
  Eye,
  EyeOff,
  Check,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

function InlineEdit({
  value,
  onSave,
}: {
  value: string;
  onSave: (v: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [pending, startTransition] = useTransition();

  if (!editing) {
    return (
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
      >
        <Pencil />
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Input
        className="h-6 w-36 text-xs"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            startTransition(async () => {
              await onSave(draft);
              setEditing(false);
            });
          }
          if (e.key === "Escape") setEditing(false);
        }}
        autoFocus
        disabled={pending}
      />
      <Button
        variant="ghost"
        size="icon-xs"
        disabled={pending || draft === value}
        onClick={() =>
          startTransition(async () => {
            await onSave(draft);
            setEditing(false);
          })
        }
      >
        <Check />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setEditing(false)}
        disabled={pending}
      >
        <X />
      </Button>
    </span>
  );
}

function SubcategoryRow({
  sub,
  categoryId,
}: {
  sub: { id: string; name: string; deleted: boolean };
  categoryId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-2 py-1 pl-4">
      <div className="flex items-center gap-2 text-sm">
        <span className={sub.deleted ? "text-muted-foreground line-through" : ""}>
          {sub.name}
        </span>
        <Badge variant={sub.deleted ? "destructive" : "secondary"}>
          {sub.deleted ? "Hidden" : "Active"}
        </Badge>
        <InlineEdit
          value={sub.name}
          onSave={async (name) => {
            await renameSubcategory(categoryId, sub.id, name);
          }}
        />
      </div>
      <Button
        variant="ghost"
        size="xs"
        disabled={pending}
        onClick={() =>
          startTransition(() => toggleSubcategoryDelete(categoryId, sub.id))
        }
      >
        {sub.deleted ? <Eye className="mr-1 size-3" /> : <EyeOff className="mr-1 size-3" />}
        {sub.deleted ? "Restore" : "Hide"}
      </Button>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(true);
  const [newSubName, setNewSubName] = useState("");
  const [addingSub, setAddingSub] = useState(false);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronDown /> : <ChevronRight />}
            </Button>
            <CardTitle className="flex items-center gap-2">
              {category.displayName || category.name}
              <Badge variant={category.deleted ? "destructive" : "secondary"}>
                {category.deleted ? "Hidden" : "Active"}
              </Badge>
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              disabled={pending}
              onClick={() =>
                startTransition(() => toggleCategoryDelete(category.id))
              }
            >
              {category.deleted ? <Eye className="mr-1 size-3" /> : <EyeOff className="mr-1 size-3" />}
              {category.deleted ? "Restore" : "Hide"}
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            ID: <code className="rounded bg-muted px-1">{category.name}</code>
            <InlineEdit
              value={category.name}
              onSave={async (name) => {
                await updateCategory(category.id, { name });
              }}
            />
          </span>
          <span>
            Display:{" "}
            <code className="rounded bg-muted px-1">{category.displayName}</code>
            <InlineEdit
              value={category.displayName}
              onSave={async (displayName) => {
                await updateCategory(category.id, { displayName });
              }}
            />
          </span>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-1 pt-2">
          {(category.subcategories || []).length === 0 && (
            <p className="py-2 text-xs text-muted-foreground">
              No subcategories
            </p>
          )}
          {(category.subcategories || []).map((sub) => (
            <SubcategoryRow
              key={sub.id}
              sub={sub}
              categoryId={category.id}
            />
          ))}

          <Separator className="my-2" />

          {addingSub ? (
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSubName.trim()) return;
                startTransition(async () => {
                  await addSubcategory(category.id, newSubName.trim());
                  setNewSubName("");
                  setAddingSub(false);
                });
              }}
            >
              <Input
                className="h-7 w-48 text-xs"
                placeholder="Subcategory name"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                autoFocus
                disabled={pending}
              />
              <Button size="xs" type="submit" disabled={pending || !newSubName.trim()}>
                Add
              </Button>
              <Button
                size="xs"
                variant="ghost"
                type="button"
                onClick={() => {
                  setAddingSub(false);
                  setNewSubName("");
                }}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setAddingSub(true)}
            >
              <Plus className="mr-1 size-3" />
              Add subcategory
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [pending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </span>
        {!showAdd && (
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="mr-1 size-3.5" />
            Add category
          </Button>
        )}
      </div>

      {showAdd && (
        <Card>
          <CardContent className="pt-4">
            <form
              className="flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newName.trim() || !newDisplayName.trim()) return;
                startTransition(async () => {
                  await addCategory(newName.trim(), newDisplayName.trim());
                  setNewName("");
                  setNewDisplayName("");
                  setShowAdd(false);
                });
              }}
            >
              <div className="space-y-1">
                <label className="text-xs font-medium">Name (ID)</label>
                <Input
                  className="h-7 w-48 text-xs"
                  placeholder="e.g. living-room"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  disabled={pending}
                  autoFocus
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Display Name</label>
                <Input
                  className="h-7 w-48 text-xs"
                  placeholder="e.g. Living Room"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  disabled={pending}
                />
              </div>
              <Button
                size="sm"
                type="submit"
                disabled={pending || !newName.trim() || !newDisplayName.trim()}
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setNewName("");
                  setNewDisplayName("");
                }}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}
