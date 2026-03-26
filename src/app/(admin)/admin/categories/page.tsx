"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryForm } from "@/components/forms/category-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCategory } from "@/actions/category-actions";
import { Trash2, Plus } from "lucide-react";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Artworks won't be deleted.`)) return;
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Manage gallery categories and periods"
        action={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? "Cancel" : "Add Category"}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <CardContent>
            <h3 className="mb-4 text-lg font-medium text-gallery-900">
              New Category
            </h3>
            <CategoryForm
              onSuccess={() => {
                setShowForm(false);
                fetchCategories();
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <CardContent>
            <p className="text-sm text-gallery-500">Loading...</p>
          </CardContent>
        ) : categories.length === 0 ? (
          <CardContent>
            <p className="text-sm text-gallery-500">No categories yet.</p>
          </CardContent>
        ) : (
          <div className="divide-y divide-gallery-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium text-gallery-900">{cat.name}</p>
                  <p className="text-xs text-gallery-500">
                    /{cat.slug} &middot; Order: {cat.sortOrder}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{cat.type}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
