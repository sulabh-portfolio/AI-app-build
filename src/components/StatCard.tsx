import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn("glass-card p-4 transition-colors", variant === "primary" && "glow-primary border-primary/20")}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{label}</span>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-black font-display", variant === "primary" ? "text-white" : "text-white")}>{value}</span>
        {unit && <span className="text-[10px] uppercase font-bold text-muted-foreground/60">{unit}</span>}
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 rounded-full bg-secondary/50 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full shadow-lg",
              variant === "primary" ? "gradient-primary" : variant === "accent" ? "gradient-accent" : "bg-foreground/40"
            )}
          />
        </div>
      )}
    </motion.div>
  );
}
