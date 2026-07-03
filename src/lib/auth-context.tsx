import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth, type ApiUser } from "@/lib/api-client";
import { useRouter } from "@tanstack/react-router";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  shipping_address: string | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  avatar_url: string | null;
};

type Session = { user: ApiUser } | null;

type AuthState = {
  user: ApiUser | null;
  session: Session;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<Session>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAuxiliary = async (u: ApiUser | null) => {
    if (!u) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    try {
      const me = await auth.getMe();
      setProfile((me.profile as Profile | null) ?? null);
      setIsAdmin(me.roles.includes("admin"));
    } catch {
      setProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChange((event, u) => {
      setUser(u);
      setSession(u ? { user: u } : null);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setTimeout(() => { loadAuxiliary(u); router.invalidate(); }, 0);
      }
    });

    auth.getUser().then((u) => {
      setUser(u);
      setSession(u ? { user: u } : null);
      loadAuxiliary(u).finally(() => setLoading(false));
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  };

  const refresh = async () => loadAuxiliary(user);

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
