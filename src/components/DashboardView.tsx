import { Flame, Drumstick, Wheat, Droplets, Timer, History } from "lucide-react";
import { StatCard } from "./StatCard";
import type { FoodEntry, WorkoutEntry, DailyGoals } from "@/lib/fitness-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DashboardViewProps {
  foodEntries: FoodEntry[];
  workoutEntries: WorkoutEntry[];
  goals: DailyGoals;
}

export function DashboardView({ foodEntries, workoutEntries, goals }: DashboardViewProps) {
  function getToday() {
    return new Date().toISOString().split("T")[0];
  }

  const todayFood = foodEntries.filter(e => e.date === getToday());
  const todayWorkouts = workoutEntries.filter(e => e.date === getToday());

  const totals = todayFood.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const workoutMinutes = todayWorkouts.reduce((acc, e) => acc + e.duration, 0);
  const caloriesBurned = todayWorkouts.reduce((acc, e) => acc + e.caloriesBurned, 0);

  // Generate 7-day data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dayCalories = foodEntries
      .filter(e => e.date === dateStr)
      .reduce((sum, e) => sum + e.calories, 0);

    return { name: dayName, calories: dayCalories };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Daily Overview</h1>
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

      {/* 7-Day Chart */}
      <div className="glass-card p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <History className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Weekly Progress</h2>
        </div>
        <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 10}}
                />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{backgroundColor: '#1A1C1E', borderRadius: '8px', border: 'none', color: '#fff'}}
                />
                <ReferenceLine y={goals.calories} stroke="#8B5CF6" strokeDasharray="3 3" />
                <Bar 
                    dataKey="calories" 
                    fill="url(#colorCal)" 
                    radius={[4, 4, 0, 0]} 
                />
                <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                </linearGradient>
                </defs>
            </BarChart>
            </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-center text-muted-foreground">The dashed line represents your daily calorie goal.</p>
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
      {todayFood.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold font-display mb-3">Today's Meals</h2>
          <div className="space-y-2">
            {todayFood.slice(-3).reverse().map((entry) => (
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
