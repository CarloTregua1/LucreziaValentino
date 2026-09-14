import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "../_components/legal-page";
import { CookiePreferencesButton } from "@/components/shared/cookie-preferences-button";
import { LEGAL_UPDATED_AT } from "@/lib/legal/dates";
import { getTitolare } from "@/lib/legal/titolare";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Quali cookie e strumenti di memorizzazione usa questo sito, a cosa servono, quanto durano e come gestire le tue preferenze.",
  robots: { index: true, follow: true },
};

interface CookieRow {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}

const TECHNICAL_COOKIES: CookieRow[] = [
  {
    name: "session",
    provider: "Questo sito (Firebase Authentication)",
    purpose:
      "Mantiene l’accesso all’area riservata dopo il login. È un cookie httpOnly: non è leggibile dagli script della pagina.",
    duration: "14 giorni",
  },
  {
    name: "__stripe_mid, __stripe_sid e simili",
    provider: "Stripe",
    purpose:
      "Impostati da Stripe sulla propria pagina di pagamento per prevenire le frodi e completare la transazione in sicurezza.",
    duration: "Da sessione a 1 anno, secondo la policy di Stripe",
  },
];

const LOCAL_STORAGE: CookieRow[] = [
  {
    name: "lucrezia-cart",
    provider: "Questo sito",
    purpose:
      "Conserva il contenuto del carrello nel tuo browser, così non si svuota ricaricando la pagina.",
    duration: "Fino alla cancellazione dei dati del browser",
  },
  {
    name: "lv-cookie-consent",
    provider: "Questo sito",
    purpose:
      "Ricorda la scelta espressa nel banner, per non riproporlo a ogni visita.",
    duration: "Fino alla cancellazione dei dati del browser",
  },
];

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="legal-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Nome</th>
            <th scope="col">Fornitore</th>
            <th scope="col">Finalità</th>
            <th scope="col">Durata</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>{row.provider}</td>
              <td>{row.purpose}</td>
              <td>{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function CookiePolicyPage() {
  const titolare = await getTitolare();

  const sections: LegalSection[] = [
    {
      id: "cosa-sono",
      title: "Cosa sono i cookie",
      body: (
        <p>
          I cookie sono piccoli file di testo che un sito salva nel browser di
          chi lo visita. Servono a far funzionare le pagine, a ricordare scelte
          già fatte e, in alcuni casi, a raccogliere informazioni sulla
          navigazione. Accanto ai cookie esistono strumenti analoghi come la
          memoria locale del browser (<em>localStorage</em>), a cui si applicano
          le stesse regole e che per completezza sono elencati qui sotto.
        </p>
      ),
    },
    {
      id: "cosa-usa-il-sito",
      title: "Che cosa usa questo sito",
      body: (
        <>
          <p>
            Questo sito usa <strong>esclusivamente cookie tecnici</strong>,
            necessari a erogare il servizio che hai richiesto.{" "}
            <strong>
              Non sono presenti cookie di profilazione, cookie pubblicitari, pixel
              di tracciamento o strumenti di analisi statistica di terze parti
            </strong>{" "}
            (non sono installati Google Analytics o soluzioni equivalenti). Ai
            sensi dell’art. 122 del Codice Privacy e delle Linee guida del
            Garante del 10 giugno 2021, i cookie tecnici non richiedono il tuo
            consenso preventivo: il banner ha quindi funzione informativa e ti
            consente di esprimere in anticipo una preferenza su eventuali cookie
            non essenziali.
          </p>

          <h3>Cookie tecnici e di sicurezza</h3>
          <CookieTable rows={TECHNICAL_COOKIES} />

          <h3>Memoria locale del browser</h3>
          <CookieTable rows={LOCAL_STORAGE} />

          <p>
            I cookie Stripe vengono impostati sul dominio di Stripe quando vieni
            reindirizzato alla pagina di pagamento; il dettaglio aggiornato è
            consultabile nell’
            <a
              href="https://stripe.com/it/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              informativa privacy di Stripe
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: "terze-parti",
      title: "Contenuti e collegamenti di terze parti",
      body: (
        <p>
          Alcuni contenuti digitali sono ospitati su piattaforme esterne e
          alcune pagine rimandano a siti di terzi (ad esempio il canale
          WhatsApp o le piattaforme dei corsi). Quando segui uno di questi
          collegamenti lasci questo sito: i cookie eventualmente installati
          sono di titolarità del gestore di destinazione, che ne risponde
          tramite la propria informativa. Il titolare di questo sito non ha
          accesso né controllo su tali strumenti.
        </p>
      ),
    },
    {
      id: "gestire",
      title: "Come gestire le tue preferenze",
      body: (
        <>
          <p>
            Puoi rivedere in qualsiasi momento la scelta espressa nel banner:
          </p>
          <p>
            <CookiePreferencesButton />
          </p>
          <p>
            Puoi inoltre bloccare o cancellare i cookie dalle impostazioni del
            tuo browser —{" "}
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
            ,{" "}
            <a
              href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
            ,{" "}
            <a
              href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
            ,{" "}
            <a
              href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edge
            </a>
            . Tieni presente che disattivando i cookie tecnici alcune funzioni
            smettono di funzionare: in particolare non sarà più possibile
            restare autenticati nell’area riservata né completare un pagamento.
          </p>
        </>
      ),
    },
    {
      id: "titolare",
      title: "Titolare e contatti",
      body: (
        <p>
          Il titolare del trattamento è <strong>{titolare.name}</strong>. Per
          qualunque richiesta relativa ai cookie o ai tuoi dati personali puoi
          scrivere a <a href={`mailto:${titolare.email}`}>{titolare.email}</a>.
          Il dettaglio completo su finalità, basi giuridiche, conservazione e
          diritti è nella <Link href="/privacy">Privacy Policy</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Cookie"
      title={
        <>
          Cookie policy
          <br />
          <span className="serif-italic text-[var(--color-accent)]">
            e strumenti di memorizzazione.
          </span>
        </>
      }
      intro={
        <>
          Questo sito usa soltanto cookie tecnici: quelli che servono a tenerti
          collegato all’area riservata e a completare un pagamento in sicurezza.
          Nessuna profilazione, nessuna pubblicità, nessun tracciamento di terze
          parti. Qui sotto trovi l’elenco completo, con finalità e durata.
        </>
      }
      updatedAt={LEGAL_UPDATED_AT}
      sections={sections}
      footnote={
        <>
          Se in futuro verranno introdotti strumenti di analisi o di
          profilazione, questa pagina sarà aggiornata e il banner tornerà a
          chiedere il consenso prima della loro attivazione. Vedi anche i{" "}
          <Link href="/termini">Termini e Condizioni</Link>.
        </>
      }
    />
  );
}
