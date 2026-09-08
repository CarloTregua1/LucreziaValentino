import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { CartLink } from "./cart-count";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { href: "/servizi", label: "Aree di competenza" },
  { href: "/convenzioni", label: "Convenzioni" },
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
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-background)] md:bg-[var(--color-background)]/85 md:backdrop-blur-md">
      <div className="container-xl flex items-center justify-between gap-4 py-5">
        <Link
          href="/"
          className="group flex min-w-0 items-baseline gap-2 text-[var(--color-foreground)]"
        >
          <span className="font-serif text-xl leading-none tracking-tight sm:text-2xl">
            Lucrezia
          </span>
          <span
            aria-hidden
            className="font-serif text-xl leading-none tracking-tight text-[var(--color-accent)] sm:text-2xl"
          >
            Valentino
          </span>
        </Link>

        {/* Desktop nav links */}
        <NavLinks links={NAV_LINKS} />

        <div className="flex shrink-0 items-center gap-5">
          {/* Desktop-only items (always visible on md+) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden bg-[var(--color-foreground)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] lg:inline-block"
            >
              Admin
            </Link>
          )}
          <span className="hidden lg:inline-block">
            <CartLink />
          </span>

          {/* Mobile right-side: admin sees just the Admin button; everyone
              else gets a hamburger that opens the nav drawer. */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="shrink-0 bg-[var(--color-foreground)] px-3 py-1.5 text-xs whitespace-nowrap uppercase tracking-widest text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] lg:hidden"
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
