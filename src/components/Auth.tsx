import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { signInWithGoogle, logout, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogIn, LogOut, User as UserIcon, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Auth() {
  const [user, loading] = useAuthState(auth);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="py-4 px-6 glass-card mb-6 transition-all duration-300">
      {user ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Logged In</p>
              <p className="text-sm font-semibold truncate max-w-[150px]">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout()} className="text-destructive hover:bg-destructive/10 h-8">
            <LogOut className="h-3.5 w-3.5 mr-2" />
            Logout
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-bold font-display">{isSignUp ? "Join Wellness Hub" : "Welcome Back"}</h2>
            <p className="text-xs text-muted-foreground">Sign in to sync your data to the cloud.</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-secondary/30 h-10 text-sm border-none focus-visible:ring-primary/40"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[10px] uppercase tracking-wider text-muted-foreground px-1">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="bg-secondary/30 h-10 text-sm border-none focus-visible:ring-primary/40"
              />
            </div>
            <Button 
              type="submit" 
              disabled={authLoading} 
              className="w-full gradient-primary h-11 text-white font-bold"
            >
              {authLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
              {isSignUp ? <UserPlus className="ml-2 h-4 w-4" /> : <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted/20"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-background px-2 text-muted-foreground">Alternatively</span></div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => signInWithGoogle()} 
            className="w-full border-muted/20 hover:bg-muted/10 h-10 text-sm"
          >
            Sign in with Google
          </Button>

          <p className="text-center text-[11px] text-muted-foreground pt-1">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="ml-1 text-primary hover:underline font-bold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
