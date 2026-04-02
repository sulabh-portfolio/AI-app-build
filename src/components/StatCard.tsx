import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  progress?: number; // 0-100
  variant?: "default" | "primary" | "accent";
}

export function StatCard({ label, value, unit, icon, progress, variant = "default" }: StatCardProps) {
  return (
    <div className={cn("glass-card p-4 animate-slide-up", variant === "primary" && "glow-primary border-primary/20")}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold font-display", variant === "primary" && "text-gradient")}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              variant === "primary" ? "gradient-primary" : variant === "accent" ? "gradient-accent" : "bg-foreground/40"
            )}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
