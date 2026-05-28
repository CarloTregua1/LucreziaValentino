import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/firebase/auth";
import { CartLink } from "./cart-count";

const NAV_LINKS = [
  { href: "/servizi", label: "Servizi" },
  { href: "/chi-siamo", label: "Chi sono" },
  { href: "/account/messaggi", label: "Contatti" },
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
            studio
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-sm tracking-wide text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden bg-[var(--color-foreground)] px-3 py-1.5 text-xs uppercase tracking-widest text-[var(--color-background)] transition-colors hover:bg-[var(--color-accent)] sm:inline-block"
            >
              Admin
            </Link>
          )}
          <Link
            href="/account"
            className="link-underline hidden text-sm tracking-wide text-[var(--color-foreground-soft)] hover:text-[var(--color-foreground)] sm:inline-block"
          >
            Account
          </Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
