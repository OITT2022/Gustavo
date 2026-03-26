import { Badge } from "@/components/ui/badge";

const statusConfig = {
  AVAILABLE: { label: "Available", variant: "success" as const },
  SOLD: { label: "Sold", variant: "danger" as const },
  RESERVED: { label: "Reserved", variant: "warning" as const },
  HIDDEN: { label: "Hidden", variant: "default" as const },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: "default" as const,
  };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
