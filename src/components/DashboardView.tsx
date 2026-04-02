import { Flame, Drumstick, Wheat, Droplets, Timer, History, MessageCircle, Share2, Footprints, Info as InfoIcon, Plus, Minus } from "lucide-react";
import { StatCard } from "./StatCard";
import { Button } from "./ui/button";
import type { FoodEntry, WorkoutEntry, DailyGoals } from "@/lib/fitness-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { motion, AnimatePresence } from "framer-motion";

interface DashboardViewProps {
  foodEntries: FoodEntry[];
  workoutEntries: WorkoutEntry[];
  goals: DailyGoals;
  stats: {
    water: number;
    steps: number;
    updateStats: (newStats: Partial<{ water: number; steps: number }>) => Promise<void>;
  };
}

export function DashboardView({ foodEntries, workoutEntries, goals, stats }: DashboardViewProps) {
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

  const handleWhatsAppShare = () => {
    const contact = import.meta.env.VITE_WHATSAPP_CONTACT || "";
    const message = `*My Daily Wellness Summary* 🥗💪
    
🔥 *Calories:* ${totals.calories} / ${goals.calories} kcal
🍗 *Protein:* ${totals.protein}g / ${goals.protein}g
⏳ *Workout:* ${workoutMinutes} / ${goals.workoutMinutes} min
💧 *Water:* ${stats.water} / ${goals.waterGlasses} glasses
👣 *Steps:* ${stats.steps} / ${goals.steps}

Status: ${totals.calories >= goals.calories ? "✅ Goal reached!" : "⏰ Still working on it!"}

_Sent from Daily Wellness Hub_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${contact.replace("+", "")}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white">Daily Overview</h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleWhatsAppShare}
          className="text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all rounded-xl"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Daily Progress Circle / Card */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-card p-8 border-primary/20 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
        
        <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Calories Consumed</p>
        <div className="relative">
            <span className="text-6xl font-black font-display text-white">{totals.calories}</span>
            <span className="text-muted-foreground text-sm ml-2 font-medium">/ {goals.calories} kcal</span>
        </div>
        
        <div className="mt-6 h-3 rounded-full bg-secondary/50 overflow-hidden backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totals.calories / goals.calories) * 100, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full gradient-primary shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          />
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                <Flame className="h-3 w-3 text-orange-500" />
                <span>{caloriesBurned} kcal burned</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                <Timer className="h-3 w-3 text-blue-400" />
                <span>{workoutMinutes} min active</span>
            </div>
        </div>
      </motion.div>

      {/* AI Daily Insight */}
      <div className="premium-gradient p-[1px] rounded-2xl shadow-lg">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse">
                <InfoIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-white leading-none mb-1">AI Daily Coaching</h3>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                    "Increasing your protein intake by 10% today will significantly improve muscle recovery after your HIIT session. Stay hydrated!"
                </p>
            </div>
        </div>
      </div>

      {/* Multi-Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Water Tracker */}
        <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Water</span>
                </div>
                <span className="text-xs font-bold text-white">{stats.water}/{goals.waterGlasses}</span>
            </div>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide">
                {Array.from({ length: Math.max(goals.waterGlasses, stats.water) }).map((_, i) => (
                    <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`h-6 w-3 rounded-full flex-shrink-0 ${i < stats.water ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-secondary/50'}`} 
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-full bg-secondary/30 rounded-lg hover:bg-red-500/10" onClick={() => stats.updateStats({ water: Math.max(0, stats.water - 1)})}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-full bg-secondary/30 rounded-lg hover:bg-blue-500/10" onClick={() => stats.updateStats({ water: stats.water + 1 })}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Steps Tracker */}
        <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Steps</span>
                </div>
                <span className="text-xs font-bold text-white">{stats.steps}</span>
            </div>
            <div className="h-10 flex items-end gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="w-full bg-secondary/40 rounded-t-sm"
                        style={{ height: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-full bg-secondary/30 rounded-lg" onClick={() => stats.updateStats({ steps: Math.max(0, stats.steps - 500)})}>
                    -500
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-full bg-secondary/30 rounded-lg" onClick={() => stats.updateStats({ steps: stats.steps + 500 })}>
                    +500
                </Button>
            </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="glass-card p-5 space-y-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Weekly Progress</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-primary px-0">Detailed Logs</Button>
        </div>
        
        <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D946EF" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600}}
                    dy={10}
                />
                <YAxis hide />
                <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{   backgroundColor: 'rgba(13, 14, 16, 0.95)', 
                                      backdropFilter: 'blur(10px)',
                                      borderRadius: '12px', 
                                      border: '1px solid rgba(255,255,255,0.1)', 
                                      color: '#fff',
                                      fontSize: '12px',
                                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                                    }}
                />
                <ReferenceLine y={goals.calories} stroke="#8B5CF6" strokeDasharray="5 5" strokeOpacity={0.5} />
                <Bar 
                    dataKey="calories" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={24}
                    animationDuration={1500}
                >
                    <LabelList 
                        dataKey="calories" 
                        position="top" 
                        style={{fill: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: 700}}
                        formatter={(val: number) => val === 0 ? '' : val}
                    />
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Macro Grid */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Today's Activities */}
      <AnimatePresence>
        {todayFood.length > 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
            >
            <h2 className="text-lg font-bold font-display text-white">Recent Activities</h2>
            <div className="space-y-3">
                {todayFood.slice(-3).reverse().map((entry, idx) => (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={entry.id} 
                    className="glass-card p-4 flex items-center justify-between group hover:border-primary/40 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center uppercase font-bold text-[10px] text-primary">
                            {entry.meal.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{entry.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{entry.meal}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-white">{entry.calories} kcal</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{entry.protein}g protein</p>
                    </div>
                </motion.div>
                ))}
            </div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
