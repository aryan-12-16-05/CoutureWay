import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

export function BookingFloat() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hiddenRoute = router.state.location.pathname === "/booking";

  return (
    <AnimatePresence>
      {visible && !hiddenRoute && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Link
            to="/booking"
            aria-label="Book a private appointment"
            className="group inline-flex items-center gap-3 bg-gold p-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink shadow-[0_8px_32px_rgba(212,175,55,0.18)] ring-1 ring-gold transition-all hover:bg-ivory hover:text-ink hover:ring-ivory md:px-6 md:py-3.5"
          >
            <Calendar className="size-4 transition-transform group-hover:scale-110" />
            <span className="hidden lg:inline">Book Appointment</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
