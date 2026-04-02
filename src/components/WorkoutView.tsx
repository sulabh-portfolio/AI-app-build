import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Flame, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WorkoutEntry } from "@/lib/fitness-store";
import { cn } from "@/lib/utils";

interface WorkoutViewProps {
  entries: WorkoutEntry[];
  onAdd: (entry: Omit<WorkoutEntry, "id" | "date">) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const TYPES = ["strength", "cardio", "flexibility", "hiit"] as const;
const TYPE_COLORS: Record<string, string> = {
  strength: "bg-primary/20 text-primary",
  cardio: "bg-destructive/20 text-destructive",
  flexibility: "bg-info/20 text-info",
  hiit: "bg-accent/20 text-accent",
};

export function WorkoutView({ entries, onAdd, onToggle, onRemove }: WorkoutViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "strength" as WorkoutEntry["type"],
    duration: "",
    caloriesBurned: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.duration) return;
    onAdd({
      name: form.name,
      type: form.type,
      duration: Number(form.duration),
      caloriesBurned: Number(form.caloriesBurned) || 0,
      completed: false,
    });
    setForm({ name: "", type: "strength", duration: "", caloriesBurned: "" });
    setShowForm(false);
  };

  const completed = entries.filter((e) => e.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Workouts</h1>
        <Button variant="glow" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Workout
        </Button>
      </div>

      {entries.length > 0 && (
        <div className="glass-card p-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Today's progress</span>
          <span className="font-display font-bold text-primary">
            {completed}/{entries.length} completed
          </span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3 animate-slide-up">
          <Input
            placeholder="Workout name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-secondary border-border"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Duration (min)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="bg-secondary border-border"
            />
            <Input
              type="number"
              placeholder="Calories burned"
              value={form.caloriesBurned}
              onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            {TYPES.map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => setForm({ ...form, type })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  form.type === type
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <Button type="submit" variant="glow" className="w-full">
            Add Workout
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "glass-card p-4 flex items-center gap-3 group transition-all",
              entry.completed && "opacity-60"
            )}
          >
            <button onClick={() => onToggle(entry.id)} className="text-primary shrink-0">
              {entry.completed ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("font-medium text-sm", entry.completed && "line-through")}>{entry.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", TYPE_COLORS[entry.type])}>
                  {entry.type}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Timer className="h-3 w-3" />
                  {entry.duration}m
                </span>
                {entry.caloriesBurned > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3" />
                    {entry.caloriesBurned}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => onRemove(entry.id)}
              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-display">No workouts planned</p>
          <p className="text-sm mt-1">Tap "Add Workout" to get started</p>
        </div>
      )}
    </div>
  );
}
