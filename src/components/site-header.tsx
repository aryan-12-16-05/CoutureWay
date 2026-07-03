import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NotificationsBell } from "@/components/notifications-bell";

const NAV = [
  { to: "/shop", label: "Collections" },
  { to: "/custom-tailoring", label: "Custom Tailoring" },
  { to: "/wedding", label: "Wedding" },
  { to: "/corporate", label: "Corporate" },
  { to: "/about", label: "Maison" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? "border-b border-ivory/10 bg-ink/85 backdrop-blur-md" : "bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-serif text-xl uppercase tracking-[0.25em] text-gold">CoutureWay</Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-gold"
              activeProps={{ className: "text-gold" }}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsBell />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-gold md:inline-flex">
                <UserIcon className="size-3.5" /> Account
              </Link>
              <button onClick={signOut} className="hidden text-ivory/40 transition-colors hover:text-gold md:inline-block" aria-label="Sign out">
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-ivory/70 transition-colors hover:text-gold md:inline">
              Sign In
            </Link>
          )}
          <button onClick={() => setOpen((o) => !o)} className="grid size-10 place-items-center text-ivory lg:hidden" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ivory/10 bg-ink lg:hidden">
          <nav className="flex flex-col px-6 py-6">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className="border-b border-ivory/5 py-4 text-sm uppercase tracking-[0.18em] text-ivory/80">
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="border-b border-ivory/5 py-4 text-sm uppercase tracking-[0.18em] text-ivory/80">Account</Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="border-b border-ivory/5 py-4 text-left text-sm uppercase tracking-[0.18em] text-ivory/80">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="border-b border-ivory/5 py-4 text-sm uppercase tracking-[0.18em] text-ivory/80">Sign In</Link>
            )}
            
          </nav>
        </div>
      )}
    </header>
  );
}
