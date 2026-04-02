import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DailyGoals } from "@/lib/fitness-store";
import { toast } from "sonner";

interface GoalsViewProps {
  goals: DailyGoals;
  onSave: (goals: DailyGoals) => void;
}

export function GoalsView({ goals, onSave }: GoalsViewProps) {
  const [form, setForm] = useState(goals);

  const handleSave = () => {
    onSave(form);
    toast.success("Goals updated!");
  };

  const fields: { key: keyof DailyGoals; label: string; unit: string }[] = [
    { key: "calories", label: "Daily Calories", unit: "kcal" },
    { key: "protein", label: "Protein", unit: "g" },
    { key: "carbs", label: "Carbohydrates", unit: "g" },
    { key: "fat", label: "Fat", unit: "g" },
    { key: "workoutMinutes", label: "Workout Duration", unit: "min" },
    { key: "waterGlasses", label: "Water Intake", unit: "glasses" },
    { key: "steps", label: "Daily Steps", unit: "steps" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display">Daily Goals</h1>

      <div className="space-y-4">
        {fields.map(({ key, label, unit }) => (
          <div key={key} className="glass-card p-4">
            <label className="text-sm text-muted-foreground font-medium">{label}</label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                type="number"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                className="bg-secondary border-border text-lg font-display font-bold"
              />
              <span className="text-muted-foreground text-sm w-10">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <Button variant="glow" className="w-full" onClick={handleSave}>
        <Save className="h-4 w-4" />
        Save Goals
      </Button>
    </div>
  );
}
