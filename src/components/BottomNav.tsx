import { LayoutDashboard, Utensils, Dumbbell, Target } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "diet" | "workout" | "goals";

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "diet", label: "Diet", icon: Utensils },
  { id: "workout", label: "Workout", icon: Dumbbell },
  { id: "goals", label: "Goals", icon: Target },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 px-2 pb-safe">
      <div className="mx-auto flex max-w-md justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-all",
              active === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", active === id && "drop-shadow-[0_0_6px_hsl(142_72%_50%/0.5)]")} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
