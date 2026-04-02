import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DashboardView } from "@/components/DashboardView";
import { DietView } from "@/components/DietView";
import { WorkoutView } from "@/components/WorkoutView";
import { GoalsView } from "@/components/GoalsView";
import { Auth } from "@/components/Auth";
import { useFoodEntries, useWorkoutEntries, useDailyGoals, useDailyStats } from "@/lib/fitness-store";

type Tab = "dashboard" | "diet" | "workout" | "goals";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const food = useFoodEntries();
  const workout = useWorkoutEntries();
  const { goals, setGoals } = useDailyGoals();
  const stats = useDailyStats();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 pt-6 pb-24">
        <Auth />
        {activeTab === "dashboard" && (
          <DashboardView
            foodEntries={food.entries}
            workoutEntries={workout.entries}
            goals={goals}
            stats={stats}
          />
        )}
        {activeTab === "diet" && (
          <DietView
            entries={food.todayEntries}
            onAdd={food.addEntry}
            onRemove={food.removeEntry}
          />
        )}
        {activeTab === "workout" && (
          <WorkoutView
            entries={workout.todayEntries}
            onAdd={workout.addEntry}
            onToggle={workout.toggleComplete}
            onRemove={workout.removeEntry}
          />
        )}
        {activeTab === "goals" && goals && (
          <GoalsView goals={goals} onSave={setGoals} />
        )}
      </div>
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default Index;
