import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/page-hero";
import { Package, Calendar, Ruler, Heart, User, Bell } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Account — CoutureWay" },
      { name: "description", content: "Manage your CoutureWay orders, appointments, measurements, and notifications." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

const TABS = [
  { id: "orders", label: "Orders", Icon: Package },
  { id: "appointments", label: "Appointments", Icon: Calendar },
  { id: "measurements", label: "Measurements", Icon: Ruler },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "wishlist", label: "Wishlist", Icon: Heart },
  { id: "profile", label: "Profile", Icon: User },
] as const;

function DashboardPage() {
  const { user, profile, refresh } = useAuth();
  const [active, setActive] = useState<string>("orders");

  return (
    <div>
      <PageHero
        eyebrow="My Account"
        title={<>Welcome, <em className="text-gold">{profile?.full_name?.split(" ")[0] ?? "client"}.</em></>}
        description="Your orders, fittings, and measurements — all in one place."
      />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside>
            <ul className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <li key={id}>
                  <button onClick={() => setActive(id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[11px] uppercase tracking-[0.22em] transition-colors ${
                    active === id ? "bg-gold/10 text-gold" : "text-ivory/60 hover:text-ivory"
                  }`}>
                    <Icon className="size-4" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="min-h-[400px] border border-ivory/10 p-8">
            <UserPanel active={active} userId={user!.id} profile={profile} refresh={refresh} />
          </div>
        </div>
      </section>
    </div>
  );
}

function UserPanel({ active, userId, profile, refresh }: { active: string; userId: string; profile: any; refresh: () => Promise<void> }) {
  const qc = useQueryClient();

  const orders = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => (await api.get<any[]>("/orders")) ?? [],
    enabled: active === "orders",
  });

  const appts = useQuery({
    queryKey: ["appointments", userId],
    queryFn: async () => (await api.get<any[]>("/appointments?order=asc")) ?? [],
    enabled: active === "appointments",
  });

  const measurements = useQuery({
    queryKey: ["measurements", userId],
    queryFn: async () => await api.get<any | null>("/measurements"),
    enabled: active === "measurements",
  });

  const notifications = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => (await api.get<any[]>("/notifications?limit=20")) ?? [],
    enabled: active === "notifications",
  });

  useEffect(() => {
    // Flask backend has no realtime channel — poll for new notifications instead.
    const interval = setInterval(
      () => qc.invalidateQueries({ queryKey: ["notifications", userId] }),
      30_000,
    );
    return () => clearInterval(interval);
  }, [userId, qc]);

  if (active === "orders") return (
    <div>
      <h3 className="mb-6 font-serif text-2xl">Your Orders</h3>
      {orders.isLoading ? <Skel /> : (orders.data?.length ?? 0) === 0 ? <Empty text="No orders yet." cta={<Link to="/shop" className="text-gold">Browse Collections →</Link>} /> : (
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-[0.2em] text-ivory/40">{["Order", "Status", "Total", "Placed"].map((c) => <th key={c} className="border-b border-ivory/10 pb-3">{c}</th>)}</tr></thead>
          <tbody>{orders.data!.map((o: any) => (
            <tr key={o.id} className="border-b border-ivory/5">
              <td className="py-4 font-medium">{o.order_number}</td>
              <td className="py-4"><StatusPill status={o.status} /></td>
              <td className="py-4 text-ivory/80">${(o.total_cents / 100).toFixed(2)}</td>
              <td className="py-4 text-ivory/50">{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  );

  if (active === "appointments") return (
    <div>
      <div className="mb-6 flex items-center justify-between"><h3 className="font-serif text-2xl">Appointments</h3><Link to="/booking" className="text-[10px] uppercase tracking-[0.25em] text-gold">+ New booking</Link></div>
      {appts.isLoading ? <Skel /> : (appts.data?.length ?? 0) === 0 ? <Empty text="No appointments." cta={<Link to="/booking" className="text-gold">Book a session →</Link>} /> : (
        <ul className="space-y-3">{appts.data!.map((a: any) => (
          <li key={a.id} className="border border-ivory/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-serif text-lg">{a.service}</p>
                <p className="mt-1 text-xs text-ivory/50">{a.scheduled_date} · {a.scheduled_time} · {a.address}</p>
              </div>
              <StatusPill status={a.status} />
            </div>
          </li>
        ))}</ul>
      )}
    </div>
  );

  if (active === "measurements") return <MeasurementsForm userId={userId} initial={measurements.data} loading={measurements.isLoading} onSaved={() => qc.invalidateQueries({ queryKey: ["measurements", userId] })} />;

  if (active === "notifications") return (
    <div>
      <h3 className="mb-6 font-serif text-2xl">Notifications</h3>
      {notifications.isLoading ? <Skel /> : (notifications.data?.length ?? 0) === 0 ? <Empty text="No notifications yet." /> : (
        <ul className="space-y-3">{notifications.data!.map((n: any) => (
          <li key={n.id} className={`border p-5 ${n.read_at ? "border-ivory/5 opacity-60" : "border-gold/30"}`}>
            <p className="font-medium">{n.title}</p>
            {n.body && <p className="mt-1 text-sm text-ivory/60">{n.body}</p>}
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ivory/30">{new Date(n.created_at).toLocaleString()}</p>
          </li>
        ))}</ul>
      )}
    </div>
  );

  if (active === "profile") return <ProfileForm initial={profile} onSaved={refresh} />;

  return <Empty text="Saved looks from the customizer will appear here." cta={<Link to="/shop" className="text-gold">Browse Collections →</Link>} />;
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "border-ivory/30 text-ivory/60", paid: "border-gold text-gold",
    confirmed: "border-gold text-gold", in_production: "border-amber-400/40 text-amber-300",
    shipped: "border-blue-400/40 text-blue-300", delivered: "border-emerald-400/40 text-emerald-300",
    cancelled: "border-red-400/40 text-red-300", completed: "border-emerald-400/40 text-emerald-300",
    refunded: "border-ivory/30 text-ivory/40",
  };
  return <span className={`inline-block border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${map[status] ?? "border-ivory/20"}`}>{status.replace("_", " ")}</span>;
}

function Skel() { return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-ivory/5" />)}</div>; }
function Empty({ text, cta }: { text: string; cta?: React.ReactNode }) { return <div className="py-10 text-center"><p className="text-sm text-ivory/50">{text}</p>{cta && <p className="mt-4 text-[11px] uppercase tracking-[0.22em]">{cta}</p>}</div>; }

function MeasurementsForm({ userId, initial, loading, onSaved }: { userId: string; initial: any; loading: boolean; onSaved: () => void }) {
  const [m, setM] = useState({ chest_cm: "", waist_cm: "", hips_cm: "", sleeve_cm: "", inseam_cm: "", shoulder_cm: "", neck_cm: "" });
  useEffect(() => { if (initial) setM({ chest_cm: initial.chest_cm ?? "", waist_cm: initial.waist_cm ?? "", hips_cm: initial.hips_cm ?? "", sleeve_cm: initial.sleeve_cm ?? "", inseam_cm: initial.inseam_cm ?? "", shoulder_cm: initial.shoulder_cm ?? "", neck_cm: initial.neck_cm ?? "" }); }, [initial]);
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const payload: any = { label: "Primary" };
    for (const [k, v] of Object.entries(m)) payload[k] = v === "" ? null : Number(v);
    try {
      await api.put("/measurements", payload);
      toast.success("Measurements saved."); onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save measurements");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <Skel />;
  return (
    <form onSubmit={submit}>
      <h3 className="mb-6 font-serif text-2xl">Saved Measurements (cm)</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(m).map(([k, v]) => (
          <div key={k}>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-gold">{k.replace("_cm", "")}</label>
            <input type="number" step="0.5" value={v as string} onChange={(e) => setM({ ...m, [k]: e.target.value })} className="w-full border border-ivory/15 bg-transparent p-3 text-sm focus:border-gold focus:outline-none" />
          </div>
        ))}
      </div>
      <button disabled={saving} className="mt-8 bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ink disabled:opacity-50">{saving ? "Saving…" : "Save Measurements"}</button>
    </form>
  );
}

function ProfileForm({ initial, onSaved }: { initial: any; onSaved: () => Promise<void> }) {
  const [p, setP] = useState({ full_name: "", phone: "", shipping_address: "", city: "", country: "", postal_code: "" });
  useEffect(() => { if (initial) setP({ full_name: initial.full_name ?? "", phone: initial.phone ?? "", shipping_address: initial.shipping_address ?? "", city: initial.city ?? "", country: initial.country ?? "", postal_code: initial.postal_code ?? "" }); }, [initial]);
  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await api.put("/profile", p);
      toast.success("Profile updated."); await onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit}>
      <h3 className="mb-6 font-serif text-2xl">Profile</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Object.entries(p).map(([k, v]) => (
          <div key={k}>
            <label className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-gold">{k.replace(/_/g, " ")}</label>
            <input value={v} onChange={(e) => setP({ ...p, [k]: e.target.value })} className="w-full border border-ivory/15 bg-transparent p-3 text-sm focus:border-gold focus:outline-none" />
          </div>
        ))}
      </div>
      <button disabled={saving} className="mt-8 bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-ink disabled:opacity-50">{saving ? "Saving…" : "Save Profile"}</button>
    </form>
  );
}
