import { Button } from "./ui/button";
import { signInWithGoogle, logout, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";

export function Auth() {
  const [user, loading] = useAuthState(auth);

  if (loading) return null;

  return (
    <div className="flex items-center gap-4 py-4 px-6 glass-card mb-6">
      {user ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ""} className="w-8 h-8 rounded-full border-2 border-primary" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-semibold">{user.displayName || user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout()} className="text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="text-center w-full space-y-3">
          <h2 className="text-lg font-bold font-display">Sync Your Data</h2>
          <p className="text-sm text-muted-foreground">Sign in to save your fitness data to the cloud.</p>
          <Button onClick={() => signInWithGoogle()} className="w-full gradient-primary">
            <LogIn className="h-4 w-4 mr-2" />
            Sign in with Google
          </Button>
        </div>
      )}
    </div>
  );
}
