import { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-vf-border bg-vf-surface p-5 shadow-sm ${className}`}
    >
      {title && (
        <h3 className="text-xs font-semibold text-vf-muted uppercase tracking-wider mb-3 font-mono">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
