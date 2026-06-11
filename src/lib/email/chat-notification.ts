import { resend, FROM_EMAIL, ADMIN_EMAIL } from "./resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface ChatNotification {
  userId: string;
  userName: string;
  userEmail: string;
  content: string;
}

function chatHtml({ userId, userName, userEmail, content }: ChatNotification): string {
  const safe = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="it">
<body style="margin:0;padding:0;background:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;color:#0a2463;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#b5654b;margin:0 0 12px;">
      Lucrezia · Messaggi
    </p>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 8px;color:#0a2463;">
      Nuovo messaggio da ${userName}
    </h1>
    <p style="color:#7a726a;font-size:14px;margin:0 0 24px;">${userEmail}</p>

    <div style="padding:20px 24px;background:#f5f1eb;border-left:3px solid #b5654b;font-size:15px;line-height:1.6;color:#2a3f72;white-space:pre-wrap;">${safe}</div>

    <p style="margin-top:32px;">
      <a href="${APP_URL}/admin/messaggi/${userId}" style="color:#b5654b;">Rispondi dall'area admin →</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendChatNotificationEmail(data: ChatNotification): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.userEmail,
      subject: `💬 Nuovo messaggio da ${data.userName}`,
      html: chatHtml(data),
    });
  } catch (e) {
    console.error("Failed to send chat notification email", e);
  }
}

/* ─────────────────────────── Admin → customer reply ─────────────────────────── */

interface CustomerReplyNotification {
  userName: string;
  userEmail: string;
  content: string;
}

function customerReplyHtml({ userName, content }: CustomerReplyNotification): string {
  const safe = content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!doctype html>
<html lang="it">
<body style="margin:0;padding:0;background:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;color:#0a2463;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#b5654b;margin:0 0 12px;">
      Lucrezia · Messaggi
    </p>
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 8px;color:#0a2463;">
      Lucrezia ti ha risposto
    </h1>
    <p style="color:#7a726a;font-size:14px;margin:0 0 24px;">Ciao ${userName}, hai un nuovo messaggio.</p>

    <div style="padding:20px 24px;background:#f5f1eb;border-left:3px solid #b5654b;font-size:15px;line-height:1.6;color:#2a3f72;white-space:pre-wrap;">${safe}</div>

    <p style="margin-top:32px;">
      <a href="${APP_URL}/account/messaggi" style="color:#b5654b;">Apri la conversazione →</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendCustomerReplyEmail(data: CustomerReplyNotification): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.userEmail,
      replyTo: ADMIN_EMAIL,
      subject: `Lucrezia ti ha risposto · Messaggi`,
      html: customerReplyHtml(data),
    });
  } catch (e) {
    console.error("Failed to send customer reply email", e);
  }
}
