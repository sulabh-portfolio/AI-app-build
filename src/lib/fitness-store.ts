import { useState, useEffect } from "react";

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  type: "strength" | "cardio" | "flexibility" | "hiit";
  duration: number; // minutes
  caloriesBurned: number;
  date: string;
  completed: boolean;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workoutMinutes: number;
}

const DEFAULT_GOALS: DailyGoals = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fat: 70,
  workoutMinutes: 45,
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useFoodEntries() {
  const [entries, setEntries] = useState<FoodEntry[]>(() =>
    loadFromStorage("fitness-food-entries", [])
  );

  useEffect(() => saveToStorage("fitness-food-entries", entries), [entries]);

  const addEntry = (entry: Omit<FoodEntry, "id" | "date">) => {
    setEntries((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID(), date: getToday() },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const todayEntries = entries.filter((e) => e.date === getToday());

  return { entries, todayEntries, addEntry, removeEntry };
}

export function useWorkoutEntries() {
  const [entries, setEntries] = useState<WorkoutEntry[]>(() =>
    loadFromStorage("fitness-workout-entries", [])
  );

  useEffect(() => saveToStorage("fitness-workout-entries", entries), [entries]);

  const addEntry = (entry: Omit<WorkoutEntry, "id" | "date">) => {
    setEntries((prev) => [
      ...prev,
      { ...entry, id: crypto.randomUUID(), date: getToday() },
    ]);
  };

  const toggleComplete = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const todayEntries = entries.filter((e) => e.date === getToday());

  return { entries, todayEntries, addEntry, toggleComplete, removeEntry };
}

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoals>(() =>
    loadFromStorage("fitness-daily-goals", DEFAULT_GOALS)
  );

  useEffect(() => saveToStorage("fitness-daily-goals", goals), [goals]);

  return { goals, setGoals };
}
