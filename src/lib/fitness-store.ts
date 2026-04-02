import { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
  userId: string;
}

export interface WorkoutEntry {
  id: string;
  name: string;
  type: "strength" | "cardio" | "flexibility" | "hiit";
  duration: number;
  caloriesBurned: number;
  date: string;
  completed: boolean;
  userId: string;
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workoutMinutes: number;
  waterGlasses: number;
  steps: number;
}

const DEFAULT_GOALS: DailyGoals = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fat: 70,
  workoutMinutes: 45,
  waterGlasses: 8,
  steps: 10000,
};

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function useFoodEntries() {
  const [user] = useAuthState(auth);
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(collection(db, "food-entries"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FoodEntry));
      setEntries(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const addEntry = async (entry: Omit<FoodEntry, "id" | "date" | "userId">) => {
    if (!user) return;
    await addDoc(collection(db, "food-entries"), {
      ...entry,
      date: getToday(),
      userId: user.uid
    });
  };

  const removeEntry = async (id: string) => {
    await deleteDoc(doc(db, "food-entries", id));
  };

  const todayEntries = entries.filter((e) => e.date === getToday());

  return { entries, todayEntries, addEntry, removeEntry };
}

export function useWorkoutEntries() {
  const [user] = useAuthState(auth);
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const q = query(collection(db, "workout-entries"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as WorkoutEntry));
      setEntries(docs);
    });

    return () => unsubscribe();
  }, [user]);

  const addEntry = async (entry: Omit<WorkoutEntry, "id" | "date" | "userId">) => {
    if (!user) return;
    await addDoc(collection(db, "workout-entries"), {
      ...entry,
      date: getToday(),
      completed: false,
      userId: user.uid
    });
  };

  const toggleComplete = async (id: string) => {
    const entryRef = doc(db, "workout-entries", id);
    const entry = entries.find(e => e.id === id);
    if (entry) {
      await updateDoc(entryRef, { completed: !entry.completed });
    }
  };

  const removeEntry = async (id: string) => {
    await deleteDoc(doc(db, "workout-entries", id));
  };

  const todayEntries = entries.filter((e) => e.date === getToday());

  return { entries, todayEntries, addEntry, toggleComplete, removeEntry };
}

export function useDailyStats() {
    const [user] = useAuthState(auth);
    const [stats, setStats] = useState({ water: 0, steps: 0 });
  
    useEffect(() => {
      if (!user) return;
      const docRef = doc(db, "daily-stats", `${user.uid}_${getToday()}`);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setStats(doc.data() as { water: number; steps: number });
        } else {
          setStats({ water: 0, steps: 0 });
        }
      });
      return () => unsubscribe();
    }, [user]);
  
    const updateStats = async (newStats: Partial<{ water: number; steps: number }>) => {
      if (!user) return;
      const docRef = doc(db, "daily-stats", `${user.uid}_${getToday()}`);
      await setDoc(docRef, { ...stats, ...newStats }, { merge: true });
    };
  
    return { ...stats, updateStats };
  }

export function useDailyGoals() {
  const [user] = useAuthState(auth);
  const [goals, setGoals] = useState<DailyGoals>(DEFAULT_GOALS);

  useEffect(() => {
    if (!user) {
      setGoals(DEFAULT_GOALS);
      return;
    }

    const goalRef = doc(db, "user-goals", user.uid);
    const getGoals = async () => {
      const snapshot = await getDoc(goalRef);
      if (snapshot.exists()) {
        setGoals(snapshot.data() as DailyGoals);
      }
    };
    getGoals();
  }, [user]);

  const saveGoals = async (newGoals: DailyGoals) => {
    if (!user) return;
    const goalRef = doc(db, "user-goals", user.uid);
    await setDoc(goalRef, newGoals);
    setGoals(newGoals);
  };

  return { goals, setGoals: saveGoals };
}
