import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardBody, CardImage } from "@/components/ui/card";

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-20">
      <div className="container-xl space-y-20">

        {/* Header */}
        <div className="border-b border-[var(--color-border)] pb-10">
          <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
            Design System
          </h1>
          <p className="mt-3 text-[var(--color-muted)]">
            Lucrezia — Styleguide & Design Tokens
          </p>
        </div>

        {/* Typography */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">Tipografia</h2>
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Display — Cormorant Garamond
              </p>
              <p
                className="font-serif leading-none text-[var(--color-foreground)]"
                style={{ fontSize: "var(--text-display)" }}
              >
                Lucrezia
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">H1</p>
              <h1 className="font-serif text-[var(--text-h1)] text-[var(--color-foreground)]">
                Moda italiana di qualità
              </h1>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">H2</p>
              <h2 className="font-serif text-[var(--text-h2)] text-[var(--color-foreground)]">
                La nostra collezione
              </h2>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">H3</p>
              <h3 className="font-serif text-[var(--text-h3)] text-[var(--color-foreground)]">
                Artigianalità italiana
              </h3>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Body — DM Sans
              </p>
              <p className="max-w-prose text-base leading-relaxed text-[var(--color-foreground)]">
                Ogni pezzo è pensato con cura, scelto per la sua qualità e per il suo carattere.
                La moda di Lucrezia è un invito a vestirsi con intenzione, a scegliere meno ma
                meglio.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Small / Label
              </p>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                Nuova collezione primavera 2025
              </p>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">Colori</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {[
              { name: "Background", css: "--color-background", hex: "#FAF7F2" },
              { name: "Foreground", css: "--color-foreground", hex: "#0A2463" },
              { name: "Muted", css: "--color-muted", hex: "#5D564F" },
              { name: "Accent", css: "--color-accent", hex: "#B5654B" },
              { name: "Accent Light", css: "--color-accent-light", hex: "#F0E8E3" },
              { name: "Border", css: "--color-border", hex: "#E6DFD6" },
              { name: "Card Subtle", css: "--color-card-subtle", hex: "#F5F1EB" },
            ].map((color) => (
              <div key={color.css}>
                <div
                  className="mb-2 h-16 border border-[var(--color-border)]"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-xs font-medium text-[var(--color-foreground)]">{color.name}</p>
                <p className="text-xs text-[var(--color-muted)]">{color.hex}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">Bottoni</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Aggiungi al carrello</Button>
            <Button variant="secondary">Scopri di più</Button>
            <Button variant="ghost">Sfoglia la collezione</Button>
            <Button variant="link">Leggi tutto →</Button>
            <Button variant="primary" isLoading>
              Caricamento
            </Button>
            <Button variant="primary" disabled>
              Non disponibile
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">
              Piccolo
            </Button>
            <Button variant="primary" size="md">
              Medio
            </Button>
            <Button variant="primary" size="lg">
              Grande
            </Button>
          </div>
        </section>

        {/* Form elements */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">Moduli</h2>
          <div className="max-w-md space-y-6">
            <Input label="Nome completo" placeholder="Lucrezia Valentino" />
            <Input label="Email" type="email" placeholder="ciao@lucrezia.it" />
            <Input
              label="Con errore"
              placeholder="Inserisci qui"
              error="Questo campo è obbligatorio"
            />
            <Input label="Con suggerimento" placeholder="Inserisci qui" hint="Testo di aiuto." />
            <Textarea label="Messaggio" placeholder="Scrivi il tuo messaggio..." />
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">
            Card prodotto
          </h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardImage>
                  <div className="aspect-[3/4] bg-[var(--color-card-subtle)]" />
                </CardImage>
                <CardBody>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    Categoria
                  </p>
                  <p className="mt-1 font-serif text-lg text-[var(--color-foreground)]">
                    Nome prodotto
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">€ 120,00</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </section>

        {/* Spacing demo */}
        <section>
          <h2 className="mb-8 font-serif text-2xl text-[var(--color-foreground)]">Spaziatura</h2>
          <div className="space-y-4">
            <div className="bg-[var(--color-accent-light)] py-8 text-center text-xs text-[var(--color-accent)]">
              py-8 — 32px
            </div>
            <div className="bg-[var(--color-accent-light)] py-16 text-center text-xs text-[var(--color-accent)]">
              py-16 — 64px
            </div>
            <div className="bg-[var(--color-accent-light)] py-24 text-center text-xs text-[var(--color-accent)]">
              py-24 — 96px (section standard)
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
