"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { ARTWORK_STATUSES } from "@/lib/constants";

interface ArtworkFiltersProps {
  categories: { value: string; label: string }[];
  mediums: string[];
}

export function ArtworkFilters({ categories, mediums }: ArtworkFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        options={categories}
        placeholder="All Categories"
        value={searchParams.get("category") || ""}
        onChange={(e) => updateFilter("category", e.target.value)}
      />
      <Select
        options={mediums.map((m) => ({ value: m, label: m }))}
        placeholder="All Mediums"
        value={searchParams.get("medium") || ""}
        onChange={(e) => updateFilter("medium", e.target.value)}
      />
      <Select
        options={ARTWORK_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
        placeholder="All Statuses"
        value={searchParams.get("status") || ""}
        onChange={(e) => updateFilter("status", e.target.value)}
      />
    </div>
  );
}
