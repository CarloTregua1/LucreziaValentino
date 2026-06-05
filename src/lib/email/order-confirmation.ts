import { resend, FROM_EMAIL, ADMIN_EMAIL } from "./resend";
import type { OrderDoc } from "@/types";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

function formatEur(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function orderHtml(order: OrderDoc): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e6dfd6;color:#0a2463;font-family:Georgia,serif;font-size:16px;">
          ${i.name}
          <div style="color:#7a726a;font-size:13px;margin-top:2px;">Quantità: ${i.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #e6dfd6;text-align:right;color:#0a2463;font-size:14px;">
          ${formatEur(i.subtotalCents)}
        </td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="it">
<body style="margin:0;padding:0;background:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;color:#0a2463;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#b5654b;margin:0 0 12px;">
      Lucrezia · Studio
    </p>
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 8px;color:#0a2463;">
      Grazie per il tuo ordine
    </h1>
    <p style="color:#7a726a;font-size:15px;margin:0 0 32px;">
      Ho ricevuto correttamente il tuo pagamento. Trovi qui sotto il riepilogo.
    </p>

    <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
      ${rows}
      <tr>
        <td style="padding-top:16px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7a726a;">
          Totale (IVA inclusa)
        </td>
        <td style="padding-top:16px;text-align:right;font-family:Georgia,serif;font-size:24px;color:#0a2463;">
          ${formatEur(order.totalCents)}
        </td>
      </tr>
    </table>

    <div style="margin-top:40px;padding:24px;background:#f5f1eb;">
      <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#b5654b;">
        Prossimi passi
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#2a3f72;">
        Ti contatterò personalmente entro 24 ore per organizzare la consulenza o
        consegnarti il materiale digitale. Se hai bisogno di me prima, scrivimi
        rispondendo a questa email.
      </p>
    </div>

    <p style="margin-top:32px;font-size:13px;color:#7a726a;">
      Riferimento ordine: <code style="color:#0a2463;">${order.id}</code>
    </p>
    <p style="margin-top:24px;font-size:13px;color:#7a726a;">
      Puoi consultare tutti i tuoi ordini in
      <a href="${APP_URL}/account/ordini" style="color:#b5654b;">area riservata</a>.
    </p>

    <p style="margin-top:48px;font-family:Georgia,serif;font-style:italic;font-size:18px;color:#b5654b;">
      — Lucrezia
    </p>
  </div>
</body>
</html>`;
}

function adminHtml(order: OrderDoc): string {
  const rows = order.items
    .map((i) => `• ${i.name} × ${i.quantity} — ${formatEur(i.subtotalCents)}`)
    .join("\n");

  return `<p>Nuovo ordine ricevuto.</p>
<pre style="font-family:monospace;font-size:13px;">
ID: ${order.id}
Cliente: ${order.email}
Totale: ${formatEur(order.totalCents)}

${rows}
</pre>
<p><a href="${APP_URL}/admin/ordini/${order.id}">Apri ordine in admin →</a></p>`;
}

export async function sendOrderConfirmationEmail(order: OrderDoc): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject: `Conferma ordine ${order.id.slice(-8).toUpperCase()} · Lucrezia`,
      html: orderHtml(order),
    });
  } catch (e) {
    console.error("Failed to send order confirmation email", e);
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🔔 Nuovo ordine da ${order.email}`,
      html: adminHtml(order),
    });
  } catch (e) {
    console.error("Failed to send admin notification email", e);
  }
}
