import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";

export function NotificationsBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get<{ count: number }>("/notifications/unread-count");
        if (!cancelled) setCount(res?.count ?? 0);
      } catch {
        if (!cancelled) setCount(0);
      }
    };
    load();
    // Flask backend has no realtime channel — poll every 30s instead.
    const interval = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [user]);

  if (!user) return null;
  return (
    <Link to="/dashboard" className="relative grid size-10 place-items-center text-ivory/70 hover:text-gold" aria-label="Notifications">
      <Bell className="size-4" />
      {count > 0 && (
        <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-gold text-[9px] font-semibold text-ink">{count}</span>
      )}
    </Link>
  );
}
