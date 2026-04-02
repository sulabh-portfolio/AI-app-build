import { useState } from "react";
import { Plus, Trash2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FoodEntry } from "@/lib/fitness-store";

interface DietViewProps {
  entries: FoodEntry[];
  onAdd: (entry: Omit<FoodEntry, "id" | "date">) => void;
  onRemove: (id: string) => void;
}

const MEALS = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_EMOJI: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

export function DietView({ entries, onAdd, onRemove }: DietViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    meal: "lunch" as FoodEntry["meal"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.calories) return;
    onAdd({
      name: form.name,
      calories: Number(form.calories),
      protein: Number(form.protein) || 0,
      carbs: Number(form.carbs) || 0,
      fat: Number(form.fat) || 0,
      meal: form.meal,
    });
    setForm({ name: "", calories: "", protein: "", carbs: "", fat: "", meal: "lunch" });
    setShowForm(false);
  };

  const grouped = MEALS.map((meal) => ({
    meal,
    items: entries.filter((e) => e.meal === meal),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Diet Tracker</h1>
        <Button variant="glow" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add Food
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3 animate-slide-up">
          <Input
            placeholder="Food name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-secondary border-border"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Calories"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              className="bg-secondary border-border"
            />
            <Input
              type="number"
              placeholder="Protein (g)"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
              className="bg-secondary border-border"
            />
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
              className="bg-secondary border-border"
            />
            <Input
              type="number"
              placeholder="Fat (g)"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex gap-2">
            {MEALS.map((meal) => (
              <button
                type="button"
                key={meal}
                onClick={() => setForm({ ...form, meal })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  form.meal === meal
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {MEAL_EMOJI[meal]} {meal}
              </button>
            ))}
          </div>
          <Button type="submit" variant="glow" className="w-full">
            Add Entry
          </Button>
        </form>
      )}

      {grouped.map(({ meal, items }) =>
        items.length > 0 ? (
          <div key={meal}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {MEAL_EMOJI[meal]} {meal}
            </h2>
            <div className="space-y-2">
              {items.map((entry) => (
                <div key={entry.id} className="glass-card p-3 flex items-center justify-between group">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{entry.name}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>P: {entry.protein}g</span>
                      <span>C: {entry.carbs}g</span>
                      <span>F: {entry.fat}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-primary font-semibold text-sm">
                      <Flame className="h-3.5 w-3.5" />
                      {entry.calories}
                    </span>
                    <button
                      onClick={() => onRemove(entry.id)}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}

      {entries.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-display">No meals logged yet</p>
          <p className="text-sm mt-1">Tap "Add Food" to start tracking</p>
        </div>
      )}
    </div>
  );
}
