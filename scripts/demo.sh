#!/usr/bin/env bash
# Live demo of the "Link di vendita" (direct buy links + QR codes).
# Usage:  npm run demo            (builds first)
#         npm run demo -- --no-build
#
# Runs the site from this laptop in Stripe TEST mode and makes it reachable from
# any phone, so the audience can scan a QR in /admin/link-vendita, land on
# Stripe and pay with the test card 4242 4242 4242 4242 — no real money moves.
#
#  - Public URL: a temporary https://….trycloudflare.com tunnel if `cloudflared`
#    is installed (works on any network, phones on 4G included). Without it,
#    falls back to this Mac's LAN IP — then phones must be on the SAME wifi or
#    hotspot, and venue wifi often blocks device-to-device traffic.
#  - Stripe: `stripe listen` forwards test webhooks here so paid demo orders
#    appear in /admin/ordini. Its signing secret is passed to the app directly;
#    .env is never modified.
#  - The QR codes and copied links point at the public URL for this run only
#    (SHARE_URL). The real site keeps pointing at lucreziavalentino.com.
#
# NOTE: .env connects to the REAL Firestore, so demo orders land in the real
# order list. Remove them afterwards with:
#   node --env-file=.env scripts/delete-test-orders.mjs

set -euo pipefail
cd "$(dirname "$0")/.."
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"

PORT=3000
LOGDIR="$(mktemp -d -t lv-demo)"
PIDS=()
cleanup() {
  echo
  echo "Arresto demo…"
  for pid in "${PIDS[@]:-}"; do [ -n "$pid" ] && kill "$pid" 2>/dev/null || true; done
}
trap cleanup EXIT INT TERM

env_value() { grep -E "^$1=" .env | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

STRIPE_KEY="$(env_value STRIPE_SECRET_KEY)"
case "$STRIPE_KEY" in
  sk_test_*) ;;
  *) echo "✗ STRIPE_SECRET_KEY in .env is not a TEST key — refusing to run a demo with real payments."; exit 1 ;;
esac
command -v stripe >/dev/null || { echo "✗ Stripe CLI not found (expected in ~/.local/bin)."; exit 1; }

if lsof -ti tcp:$PORT >/dev/null 2>&1; then
  echo "✗ Port $PORT is busy (is 'npm run dev' still running?). Stop it and retry."
  exit 1
fi

# 1. Public URL ----------------------------------------------------------------
if command -v cloudflared >/dev/null; then
  echo "→ Apro il tunnel pubblico (cloudflared)…"
  cloudflared tunnel --no-autoupdate --url "http://localhost:$PORT" >"$LOGDIR/tunnel.log" 2>&1 &
  PIDS+=($!)
  PUBLIC_URL=""
  for _ in $(seq 1 30); do
    PUBLIC_URL="$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOGDIR/tunnel.log" | head -1 || true)"
    [ -n "$PUBLIC_URL" ] && break
    sleep 1
  done
  [ -n "$PUBLIC_URL" ] || { echo "✗ Tunnel did not start. Log: $LOGDIR/tunnel.log"; exit 1; }
else
  IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
  [ -n "$IP" ] || { echo "✗ No network address found. Connect to wifi/hotspot, or install cloudflared."; exit 1; }
  PUBLIC_URL="http://$IP:$PORT"
  echo "! cloudflared non installato: uso l'indirizzo locale $PUBLIC_URL"
  echo "  I telefoni devono essere sulla STESSA rete wifi/hotspot di questo Mac."
fi

# 2. Stripe webhooks -------------------------------------------------------------
echo "→ Collego i webhook Stripe (test mode)…"
stripe listen --api-key "$STRIPE_KEY" --forward-to "localhost:$PORT/api/webhooks/stripe" >"$LOGDIR/stripe.log" 2>&1 &
PIDS+=($!)
WHSEC=""
for _ in $(seq 1 30); do
  WHSEC="$(grep -oE 'whsec_[A-Za-z0-9]+' "$LOGDIR/stripe.log" | head -1 || true)"
  [ -n "$WHSEC" ] && break
  sleep 1
done
[ -n "$WHSEC" ] || { echo "✗ stripe listen did not start. Log: $LOGDIR/stripe.log"; exit 1; }

# 3. Build + start -----------------------------------------------------------------
if [ "${1:-}" != "--no-build" ]; then
  echo "→ Compilo il sito (circa un minuto)…"
  npx next build >"$LOGDIR/build.log" 2>&1 || { echo "✗ Build failed. Log: $LOGDIR/build.log"; exit 1; }
fi
echo "→ Avvio il sito…"
STRIPE_WEBHOOK_SECRET="$WHSEC" SHARE_URL="$PUBLIC_URL" \
  npx next start -H 0.0.0.0 -p "$PORT" >"$LOGDIR/next.log" 2>&1 &
PIDS+=($!)
for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://localhost:$PORT/api/health" && break
  sleep 1
done

# A production build marks the login cookie Secure, which Safari won't keep on
# plain http://localhost — so log in through the https tunnel when there is one.
case "$PUBLIC_URL" in
  https://*) ADMIN_BASE="$PUBLIC_URL" ;;
  *) ADMIN_BASE="http://localhost:$PORT"
     echo "! Senza tunnel https, Safari potrebbe non mantenere l'accesso admin: usa Chrome se ce l'hai." ;;
esac

cat <<EOF

────────────────────────────────────────────────────────────
  DEMO PRONTA  (Stripe in modalità TEST — nessun addebito reale)

  Pagina admin:  $ADMIN_BASE/admin/link-vendita   (accedi come admin)
  Indirizzo pubblico: $PUBLIC_URL

  Fai scansionare un QR dalla pagina admin, poi paga con:
    carta 4242 4242 4242 4242 · scadenza futura · CVC 123
  L'ordine compare in $ADMIN_BASE/admin/ordini

  Log: $LOGDIR
  Ctrl+C per terminare.
────────────────────────────────────────────────────────────
EOF

wait
