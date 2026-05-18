interface StatusBadgeProps {
  status: "fresh" | "stale" | "old" | "missing";
  label: string;
}

const STATUS_STYLES = {
  fresh: "bg-vf-success/15 text-vf-success border-vf-success/20",
  stale: "bg-vf-warn/15 text-vf-warn border-vf-warn/20",
  old: "bg-vf-danger/15 text-vf-danger border-vf-danger/20",
  missing: "bg-vf-muted/10 text-vf-muted border-vf-muted/15",
} as const;

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium font-mono ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}
