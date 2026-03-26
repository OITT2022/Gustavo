interface AdminHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gallery-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gallery-500">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
