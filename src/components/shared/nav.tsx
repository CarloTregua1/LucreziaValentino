import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { CartLink } from "./cart-count";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { href: "/servizi", label: "Servizi" },
  { href: "/blog", label: "Blog" },
  { href: "/chi-siamo", label: "Chi sono" },
  { href: "/account/messaggi", label: "Contatti" },
  { href: "/account", label: "Account" },
];

export async function Nav() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const user = session ? await verifySessionCookie(session) : null;
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)]/85 backdrop-blur-md">
      <div className="container-xl flex items-center justify-between py-5">
        <Link
          href="/"
          className="group flex items-baseline gap-2 text-[var(--color-foreground)]"
        >
          <span className="font-serif text-2xl leading-none tracking-tight">
            Lucrezia
          </span>
          <span
            aria-hidden
            className="hidden font-serif italic text-sm text-[var(--color-accent)] sm:inline"
          >
            Valentino
          </span>
        </Link>

        {/* Desktop nav links */}
        <NavLinks links={NAV_LINKS} />

        <div className="flex items-center gap-5">
          {/* Desktop-only items (always visible on md+) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden bg-[var(--color-foreground)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] md:inline-block"
            >
              Admin
            </Link>
          )}
          <span className="hidden md:inline-block">
            <CartLink />
          </span>

          {/* Mobile right-side: admin sees just the Admin button; everyone
              else gets a hamburger that opens the nav drawer. */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="bg-[var(--color-foreground)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] md:hidden"
            >
              Admin
            </Link>
          ) : (
            <MobileMenu links={NAV_LINKS} />
          )}
        </div>
      </div>
    </header>
  );
}
