import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { BookingFloat } from "../components/booking-float";
import { AuthProvider } from "../lib/auth-context";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Error 404</p>
        <h1 className="mt-4 font-serif text-6xl">Lost in the atelier</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you seek has been moved, archived, or never tailored.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block bg-gold px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ivory"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl">Something interrupted the fitting.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again, or return to the maison.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="bg-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ink"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-ivory/30 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em]"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CoutureWay — Tailored To Perfection. Delivered To Your Doorstep." },
      { name: "description", content: "CoutureWay is a luxury fashion-tech maison. Bespoke tailoring, wedding couture, corporate uniforms — measured at your residence." },
      { name: "author", content: "CoutureWay" },
      { name: "theme-color", content: "#0B0B0B" },
      { property: "og:title", content: "CoutureWay — Premium Custom Tailoring" },
      { property: "og:description", content: "Master tailors at your doorstep. Couture, wedding, corporate." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CoutureWay" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@CoutureWay" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CoutureWay",
          description: "Luxury custom tailoring and fashion-tech maison.",
          slogan: "Tailored To Perfection. Delivered To Your Doorstep.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-dvh flex-col bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
          <BookingFloat />
        </div>
        <Toaster theme="dark" position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
