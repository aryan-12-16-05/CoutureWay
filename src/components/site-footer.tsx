import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-ivory/5 bg-ink pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 grid gap-16 md:grid-cols-3">
          <div className="col-span-1">
            <span className="mb-8 block font-serif text-2xl uppercase tracking-[0.25em] text-gold">
              CoutureWay
            </span>
            <p className="max-w-[32ch] text-sm leading-relaxed text-ivory/50">
              Defining the future of luxury tailoring — heritage craftsmanship,
              delivered at your doorstep.
            </p>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h5 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                The House
              </h5>
              <ul className="space-y-4 text-sm text-ivory/60">
                <li><Link to="/about" className="hover:text-ivory">Our Heritage</Link></li>
                <li><Link to="/custom-tailoring" className="hover:text-ivory">The Process</Link></li>
                <li><Link to="/shop" className="hover:text-ivory">Collections</Link></li>
                <li><Link to="/contact" className="hover:text-ivory">Press &amp; Careers</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="mb-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                Client Services
              </h5>
              <ul className="space-y-4 text-sm text-ivory/60">
                <li><Link to="/booking" className="hover:text-ivory">Booking Portal</Link></li>
                <li><Link to="/dashboard" className="hover:text-ivory">My Account</Link></li>
                <li><Link to="/corporate" className="hover:text-ivory">Corporate Orders</Link></li>
                <li><Link to="/wedding" className="hover:text-ivory">Wedding Concierge</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 border-t border-ivory/5 pt-12 md:flex-row">
          <span className="text-[10px] uppercase tracking-[0.2em] text-ivory/30">
            © {new Date().getFullYear()} CoutureWay International. All Rights Reserved.
          </span>
          <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-ivory/30">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
