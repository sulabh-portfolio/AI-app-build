import { Flame, Drumstick, Wheat, Droplets, Timer } from "lucide-react";
import { StatCard } from "./StatCard";
import type { FoodEntry, WorkoutEntry, DailyGoals } from "@/lib/fitness-store";

interface DashboardViewProps {
  foodEntries: FoodEntry[];
  workoutEntries: WorkoutEntry[];
  goals: DailyGoals;
}

export function DashboardView({ foodEntries, workoutEntries, goals }: DashboardViewProps) {
  const totals = foodEntries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const workoutMinutes = workoutEntries.reduce((acc, e) => acc + e.duration, 0);
  const caloriesBurned = workoutEntries.reduce((acc, e) => acc + e.caloriesBurned, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Today's Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Main calorie card */}
      <div className="glass-card p-6 glow-primary border-primary/20 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Calories consumed</p>
        <p className="text-5xl font-bold font-display text-gradient">{totals.calories}</p>
        <p className="text-muted-foreground text-sm mt-1">/ {goals.calories} kcal goal</p>
        <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary transition-all duration-700"
            style={{ width: `${Math.min((totals.calories / goals.calories) * 100, 100)}%` }}
          />
        </div>
        {caloriesBurned > 0 && (
          <p className="text-xs text-muted-foreground mt-3">
            🔥 {caloriesBurned} kcal burned from workouts
          </p>
        )}
      </div>

      {/* Macro grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Protein"
          value={totals.protein}
          unit="g"
          icon={<Drumstick className="h-4 w-4" />}
          progress={(totals.protein / goals.protein) * 100}
          variant="primary"
        />
        <StatCard
          label="Carbs"
          value={totals.carbs}
          unit="g"
          icon={<Wheat className="h-4 w-4" />}
          progress={(totals.carbs / goals.carbs) * 100}
          variant="accent"
        />
        <StatCard
          label="Fat"
          value={totals.fat}
          unit="g"
          icon={<Droplets className="h-4 w-4" />}
          progress={(totals.fat / goals.fat) * 100}
        />
        <StatCard
          label="Workout"
          value={workoutMinutes}
          unit="min"
          icon={<Timer className="h-4 w-4" />}
          progress={(workoutMinutes / goals.workoutMinutes) * 100}
          variant="primary"
        />
      </div>

      {/* Recent meals */}
      {foodEntries.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold font-display mb-3">Recent Meals</h2>
          <div className="space-y-2">
            {foodEntries.slice(-3).reverse().map((entry) => (
              <div key={entry.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{entry.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{entry.meal}</p>
                </div>
                <div className="flex items-center gap-1 text-primary font-semibold text-sm">
                  <Flame className="h-3.5 w-3.5" />
                  {entry.calories}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
