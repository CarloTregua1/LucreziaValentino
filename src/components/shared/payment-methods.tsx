interface Props {
  /** "dark" for the footer, which sits on the foreground colour. */
  tone?: "light" | "dark";
  /** Adds the explanatory sentence under the badges. */
  detail?: boolean;
  className?: string;
}

/**
 * Stripe Checkout picks the methods it offers from the Dashboard's payment
 * method configuration rather than from anything in this codebase — the
 * session is created without payment_method_types. Card and Klarna are both
 * enabled there; the rest of what Stripe may show varies by country and
 * amount, so only these two are named.
 */
export function PaymentMethods({
  tone = "light",
  detail = false,
  className = "",
}: Props) {
  const muted =
    tone === "dark"
      ? "text-[var(--color-muted-light)]"
      : "text-[var(--color-muted)]";
  const badge =
    tone === "dark"
      ? "border-white/25 text-[var(--color-background)]"
      : "border-[var(--color-border)] text-[var(--color-foreground)]";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={`text-xs uppercase tracking-widest ${muted}`}>
          Pagamenti sicuri
        </span>
        <span className={`border px-2.5 py-1 text-xs tracking-wide ${badge}`}>
          Stripe
        </span>
        <span className={`border px-2.5 py-1 text-xs tracking-wide ${badge}`}>
          Klarna
        </span>
      </div>
      {detail && (
        <p className={`mt-3 text-xs leading-relaxed ${muted}`}>
          Il pagamento è gestito da Stripe. Puoi pagare con carta di credito o
          debito, oppure scegliere Klarna al momento del checkout.
        </p>
      )}
    </div>
  );
}
