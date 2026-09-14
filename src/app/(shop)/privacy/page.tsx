import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "../_components/legal-page";
import { LEGAL_UPDATED_AT } from "@/lib/legal/dates";
import { getTitolare, titolareLines } from "@/lib/legal/titolare";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).",
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const titolare = await getTitolare();

  const sections: LegalSection[] = [
    {
      id: "titolare",
      title: "Titolare del trattamento",
      body: (
        <>
          <p>
            Il titolare del trattamento dei dati personali raccolti tramite
            questo sito è:
          </p>
          <ul>
            {titolareLines(titolare).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Per qualunque richiesta relativa ai tuoi dati personali puoi
            scrivere a{" "}
            <a href={`mailto:${titolare.email}`}>{titolare.email}</a>. Non è
            stato nominato un Responsabile della protezione dei dati (DPO), non
            ricorrendone i presupposti di legge.
          </p>
        </>
      ),
    },
    {
      id: "dati",
      title: "Quali dati raccolgo",
      body: (
        <>
          <h3>Dati che fornisci volontariamente</h3>
          <ul>
            <li>
              <strong>Registrazione all’area riservata:</strong> nome o
              denominazione, indirizzo email e password. La password è gestita
              e conservata in forma cifrata dal servizio di autenticazione
              Firebase: non è mai visibile né accessibile al titolare.
            </li>
            <li>
              <strong>Messaggi e richieste:</strong> il contenuto delle
              conversazioni che apri dall’area riservata, insieme alla data di
              invio e all’identificativo del tuo account.
            </li>
            <li>
              <strong>Acquisti:</strong> indirizzo email, servizi acquistati,
              importo, valuta, stato dell’ordine e identificativi della
              transazione. I <strong>dati di pagamento</strong> (numero di
              carta, intestatario, scadenza) sono raccolti e trattati
              direttamente da Stripe sulla propria pagina di pagamento:{" "}
              <strong>non transitano né vengono conservati su questo sito</strong>.
              Gli eventuali dati di fatturazione richiesti in fase di
              pagamento sono raccolti da Stripe e resi disponibili al titolare
              per gli adempimenti fiscali.
            </li>
          </ul>

          <h3>Dati raccolti automaticamente</h3>
          <ul>
            <li>
              <strong>Log tecnici del server:</strong> indirizzo IP, data e ora
              della richiesta, pagina richiesta, tipo di browser e sistema
              operativo. Sono registrati dal fornitore di hosting per garantire
              il funzionamento e la sicurezza del sito.
            </li>
            <li>
              <strong>Cookie tecnici e memoria locale del browser:</strong>{" "}
              descritti in dettaglio nella{" "}
              <Link href="/cookie-policy">Cookie Policy</Link>.
            </li>
          </ul>
          <p>
            Non raccolgo categorie particolari di dati (art. 9 GDPR) e ti invito
            a non inserirne nei messaggi. Non utilizzo strumenti di
            profilazione, pubblicità comportamentale o analisi statistica di
            terze parti.
          </p>
        </>
      ),
    },
    {
      id: "finalita",
      title: "Perché tratto i tuoi dati e su quale base",
      body: (
        <>
          <ul>
            <li>
              <strong>Creare e gestire il tuo account</strong> e permetterti di
              accedere all’area riservata, agli ordini e ai messaggi. Base
              giuridica: esecuzione di un contratto o di misure precontrattuali
              (art. 6.1.b GDPR).
            </li>
            <li>
              <strong>Rispondere alle tue richieste</strong> e fornirti la
              consulenza, la formazione o il materiale richiesto. Base
              giuridica: art. 6.1.b GDPR.
            </li>
            <li>
              <strong>Gestire ordini, pagamenti e ricevute.</strong> Base
              giuridica: art. 6.1.b GDPR e, per la fatturazione e la
              conservazione dei documenti contabili, obbligo legale (art. 6.1.c
              GDPR).
            </li>
            <li>
              <strong>Garantire la sicurezza del sito</strong> e prevenire
              abusi, frodi o accessi non autorizzati. Base giuridica: legittimo
              interesse del titolare (art. 6.1.f GDPR).
            </li>
          </ul>
          <p>
            Il conferimento dei dati contrassegnati come obbligatori nei moduli
            è necessario per registrarsi, acquistare o ricevere risposta: senza
            di essi il servizio non può essere erogato. Il conferimento degli
            altri dati è facoltativo.
          </p>
        </>
      ),
    },
    {
      id: "destinatari",
      title: "A chi vengono comunicati",
      body: (
        <>
          <p>
            I tuoi dati non vengono venduti né ceduti a terzi per finalità
            commerciali. Sono trattati dal titolare e da un numero ristretto di
            fornitori tecnologici, nominati responsabili del trattamento ai
            sensi dell’art. 28 GDPR, che li trattano esclusivamente su
            istruzione del titolare:
          </p>
          <ul>
            <li>
              <strong>Google Ireland Ltd.</strong> — servizi Firebase
              (autenticazione, database Firestore, archiviazione file).
            </li>
            <li>
              <strong>Stripe Payments Europe Ltd.</strong> — gestione dei
              pagamenti online, inclusi i metodi Klarna resi disponibili
              tramite Stripe. Stripe agisce anche come titolare autonomo per gli
              obblighi antiriciclaggio e antifrode che le sono propri.
            </li>
            <li>
              <strong>Vercel Inc.</strong> — hosting e distribuzione del sito.
            </li>
          </ul>
          <p>
            I dati possono inoltre essere comunicati al consulente fiscale e
            contabile del titolare e, se richiesto, all’autorità giudiziaria o
            ad altre autorità pubbliche nei casi previsti dalla legge.
          </p>
        </>
      ),
    },
    {
      id: "trasferimenti",
      title: "Trasferimenti fuori dallo Spazio economico europeo",
      body: (
        <p>
          I servizi sopra indicati possono comportare il trasferimento di dati
          verso paesi terzi, in particolare gli Stati Uniti. Tali trasferimenti
          avvengono sulla base delle Clausole contrattuali tipo approvate dalla
          Commissione europea e, ove applicabile, della decisione di adeguatezza
          relativa al EU–US Data Privacy Framework, con le misure supplementari
          adottate dai rispettivi fornitori. Puoi richiedere copia delle
          garanzie adottate scrivendo al titolare.
        </p>
      ),
    },
    {
      id: "conservazione",
      title: "Per quanto tempo li conservo",
      body: (
        <ul>
          <li>
            <strong>Dati dell’account:</strong> per tutta la durata
            dell’iscrizione e fino a 12 mesi dalla richiesta di cancellazione,
            per gestire eventuali contestazioni.
          </li>
          <li>
            <strong>Messaggi e conversazioni:</strong> 24 mesi dall’ultimo
            messaggio scambiato.
          </li>
          <li>
            <strong>Ordini, ricevute e documenti contabili:</strong> 10 anni,
            come previsto dall’art. 2220 del Codice civile e dalla normativa
            fiscale.
          </li>
          <li>
            <strong>Log tecnici:</strong> per il tempo strettamente necessario
            alla sicurezza e alla diagnostica, secondo le politiche di
            conservazione del fornitore di hosting.
          </li>
        </ul>
      ),
    },
    {
      id: "diritti",
      title: "I tuoi diritti",
      body: (
        <>
          <p>
            In qualunque momento puoi esercitare i diritti previsti dagli
            articoli da 15 a 22 del GDPR:
          </p>
          <ul>
            <li>accedere ai tuoi dati e ottenerne copia;</li>
            <li>chiederne la rettifica o l’aggiornamento;</li>
            <li>
              chiederne la cancellazione, quando non sussistano obblighi di
              conservazione;
            </li>
            <li>chiederne la limitazione del trattamento;</li>
            <li>
              opporti al trattamento fondato sul legittimo interesse del
              titolare;
            </li>
            <li>
              ricevere i dati in formato strutturato e di uso comune
              (portabilità);
            </li>
            <li>revocare il consenso, dove il trattamento vi si fondi.</li>
          </ul>
          <p>
            Per esercitarli scrivi a{" "}
            <a href={`mailto:${titolare.email}`}>{titolare.email}</a>: riceverai
            riscontro entro un mese. Se ritieni che il trattamento violi la
            normativa, puoi proporre reclamo al{" "}
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noopener noreferrer"
            >
              Garante per la protezione dei dati personali
            </a>{" "}
            o rivolgerti all’autorità giudiziaria.
          </p>
        </>
      ),
    },
    {
      id: "decisioni-minori",
      title: "Decisioni automatizzate e minori",
      body: (
        <p>
          Non viene effettuato alcun processo decisionale automatizzato né
          alcuna profilazione che produca effetti giuridici sulla tua persona. I
          servizi non sono destinati a minori di 18 anni: non è consentita la
          registrazione né l’acquisto da parte di minori senza il consenso di
          chi ne esercita la responsabilità genitoriale.
        </p>
      ),
    },
    {
      id: "sicurezza-modifiche",
      title: "Sicurezza e aggiornamenti dell’informativa",
      body: (
        <p>
          Adotto misure tecniche e organizzative adeguate a proteggere i dati:
          connessione cifrata TLS su tutte le pagine, autenticazione gestita da
          Firebase, cookie di sessione <em>httpOnly</em> non leggibile da
          script, accesso all’area amministrativa limitato agli account
          autorizzati e regole di sicurezza sul database. Questa informativa può
          essere aggiornata per adeguarla a modifiche normative o al servizio:
          la versione vigente è sempre quella pubblicata su questa pagina, con
          l’indicazione della data di ultimo aggiornamento.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Privacy"
      title={
        <>
          Informativa sul trattamento
          <br />
          <span className="serif-italic text-[var(--color-accent)]">
            dei dati personali.
          </span>
        </>
      }
      intro={
        <>
          Resa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679
          (GDPR) a chi visita questo sito, si registra all’area riservata,
          scrive un messaggio o acquista un servizio. Trattamento dei dati e
          riservatezza sono parte del mio lavoro: qui trovi, in modo leggibile,
          che cosa raccolgo, perché e per quanto tempo.
        </>
      }
      updatedAt={LEGAL_UPDATED_AT}
      sections={sections}
      footnote={
        <>
          Per il dettaglio dei cookie e degli strumenti di memorizzazione usati
          dal sito consulta la{" "}
          <Link href="/cookie-policy">Cookie Policy</Link>; per le condizioni di
          acquisto dei servizi i{" "}
          <Link href="/termini">Termini e Condizioni</Link>.
        </>
      }
    />
  );
}
