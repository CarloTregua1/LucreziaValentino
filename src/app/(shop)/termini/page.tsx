import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "../_components/legal-page";
import { LEGAL_UPDATED_AT } from "@/lib/legal/dates";
import { getTitolare, titolareLines } from "@/lib/legal/titolare";

export const metadata: Metadata = {
  title: "Termini e Condizioni",
  description:
    "Condizioni generali di vendita e di utilizzo del sito: servizi, ordini, prezzi, pagamenti, diritto di recesso, responsabilità e foro competente.",
  robots: { index: true, follow: true },
};

export default async function TerminiPage() {
  const titolare = await getTitolare();

  const sections: LegalSection[] = [
    {
      id: "oggetto",
      title: "Oggetto e accettazione",
      body: (
        <>
          <p>
            Le presenti condizioni generali disciplinano l’utilizzo di questo
            sito e l’acquisto dei servizi e dei contenuti digitali qui offerti.
            Utilizzando il sito o inviando un ordine dichiari di averle lette e
            di accettarle integralmente.
          </p>
          <p>
            Il professionista è:
          </p>
          <ul>
            {titolareLines(titolare).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Le condizioni possono essere modificate in qualsiasi momento; alla
            singola compravendita si applica la versione pubblicata al momento
            dell’invio dell’ordine.
          </p>
        </>
      ),
    },
    {
      id: "servizi",
      title: "Che cosa acquisti",
      body: (
        <>
          <p>Il sito offre due tipologie di prestazioni:</p>
          <ul>
            <li>
              <strong>Consulenze e percorsi personalizzati</strong> —
              educazione finanziaria, consulenza creditizia, fiscale e
              previdenziale, formazione e orientamento professionale. Sono
              erogati in presenza oppure online, previo appuntamento concordato
              dopo l’acquisto.
            </li>
            <li>
              <strong>Contenuti digitali</strong> — ebook, guide e corsi online.
              Alcuni contenuti sono ospitati su piattaforme esterne: in quel
              caso l’acquisto avviene sulla piattaforma indicata e sono le
              condizioni di quest’ultima a regolarne erogazione e assistenza.
            </li>
          </ul>
          <h3>Natura delle prestazioni</h3>
          <p>
            Le attività offerte hanno finalità informativa, educativa,
            formativa e di orientamento.{" "}
            <strong>
              Non costituiscono consulenza finanziaria personalizzata ai sensi
              del TUF, raccomandazioni di investimento, sollecitazione al
              pubblico risparmio, né attività riservata a intermediari
              vigilati
            </strong>
            . Ogni decisione economica, creditizia o fiscale resta in capo al
            cliente, che è invitato a valutarla anche con i propri consulenti di
            fiducia e con l’intermediario o l’ente competente.
          </p>
        </>
      ),
    },
    {
      id: "account",
      title: "Registrazione e account",
      body: (
        <p>
          Per acquistare e per scambiare messaggi è necessario registrarsi
          fornendo dati veritieri e aggiornati. Le credenziali sono personali:
          sei responsabile della loro custodia e delle attività svolte tramite
          il tuo account. In caso di uso non autorizzato avvisa
          tempestivamente il professionista. La registrazione è riservata a
          persone maggiorenni. Il professionista può sospendere o chiudere un
          account in caso di violazione delle presenti condizioni, di dati
          manifestamente falsi o di uso illecito del servizio.
        </p>
      ),
    },
    {
      id: "ordine",
      title: "Come si conclude il contratto",
      body: (
        <ol>
          <li>
            Aggiungi al carrello i servizi desiderati e verifica nel riepilogo
            descrizione, quantità e prezzo totale.
          </li>
          <li>
            Confermando il carrello vieni indirizzato alla pagina di pagamento
            sicura di Stripe, dove inserisci i dati richiesti.
          </li>
          <li>
            Il contratto si intende concluso nel momento in cui il pagamento
            viene autorizzato e il professionista ne riceve conferma da Stripe.
          </li>
          <li>
            Ricevi da Stripe una ricevuta all’indirizzo email associato
            all’account; l’ordine resta consultabile nell’area riservata, alla
            voce <em>I miei ordini</em>.
          </li>
        </ol>
      ),
    },
    {
      id: "prezzi-pagamenti",
      title: "Prezzi e pagamenti",
      body: (
        <>
          <p>
            Tutti i prezzi sono espressi in euro e si intendono comprensivi
            delle imposte eventualmente dovute, salvo diversa indicazione nella
            scheda del servizio. I prezzi pubblicati possono essere modificati
            in qualsiasi momento; la modifica non incide sugli ordini già
            confermati.
          </p>
          <p>
            I pagamenti sono gestiti da <strong>Stripe Payments Europe Ltd.</strong>{" "}
            e possono essere effettuati con carta di credito o di debito e con
            gli ulteriori metodi mostrati in fase di pagamento, tra cui{" "}
            <strong>Klarna</strong> ove disponibile. La disponibilità dei singoli
            metodi dipende da Stripe, dal paese e dall’importo dell’ordine.
            L’eventuale pagamento dilazionato tramite Klarna costituisce un
            rapporto autonomo tra il cliente e Klarna, soggetto alle condizioni
            e alle valutazioni di quest’ultima.
          </p>
          <p>
            I dati della carta non transitano mai sui sistemi del
            professionista: sono raccolti e trattati direttamente da Stripe. Il
            documento fiscale viene emesso, quando dovuto, secondo la normativa
            applicabile e inviato all’indirizzo email indicato.
          </p>
        </>
      ),
    },
    {
      id: "erogazione",
      title: "Erogazione dei servizi",
      body: (
        <>
          <p>
            <strong>Consulenze e percorsi.</strong> Dopo la conferma del
            pagamento vieni contattato per fissare l’appuntamento, di norma
            entro due giorni lavorativi. Gli incontri si svolgono negli orari
            concordati; un appuntamento può essere spostato dandone avviso con
            almeno 24 ore di anticipo. L’assenza senza preavviso comporta la
            perdita dell’incontro, che si considera erogato.
          </p>
          <p>
            <strong>Contenuti digitali.</strong> Sono resi disponibili subito
            dopo la conferma del pagamento, tramite email o tramite la
            piattaforma esterna indicata nella scheda del prodotto.
          </p>
          <p>
            La collaborazione richiede la trasmissione di informazioni complete
            e veritiere: il professionista non risponde di esiti pregiudicati da
            informazioni inesatte, incomplete o non tempestive fornite dal
            cliente.
          </p>
        </>
      ),
    },
    {
      id: "recesso",
      title: "Diritto di recesso",
      body: (
        <>
          <p>
            Se acquisti come <strong>consumatore</strong> (persona fisica che
            agisce per scopi estranei all’attività imprenditoriale o
            professionale) hai diritto di recedere entro{" "}
            <strong>14 giorni</strong> dalla conclusione del contratto, senza
            dover fornire motivazione e senza costi, ai sensi degli artt. 52 e
            seguenti del Codice del Consumo.
          </p>
          <p>
            Per esercitarlo è sufficiente una comunicazione esplicita a{" "}
            <a href={`mailto:${titolare.email}`}>{titolare.email}</a>. Il
            rimborso viene effettuato entro 14 giorni dalla ricezione della
            comunicazione, con lo stesso mezzo di pagamento utilizzato per
            l’acquisto.
          </p>
          <h3>Quando il recesso non si applica</h3>
          <p>Ai sensi dell’art. 59 del Codice del Consumo il recesso è escluso:</p>
          <ul>
            <li>
              per i <strong>servizi già interamente eseguiti</strong>, quando
              l’esecuzione sia iniziata prima della scadenza dei 14 giorni con
              il tuo accordo espresso e con la tua accettazione della perdita
              del diritto di recesso a esecuzione completata;
            </li>
            <li>
              per la <strong>fornitura di contenuto digitale</strong> non su
              supporto materiale, se l’esecuzione è iniziata con il tuo accordo
              espresso e con la tua accettazione della conseguente perdita del
              diritto di recesso;
            </li>
            <li>
              per i servizi di <strong>consulenza personalizzata</strong> già
              erogati e per gli incontri effettivamente svolti.
            </li>
          </ul>
          <p>
            Se il servizio è stato eseguito solo in parte, ti viene rimborsato
            l’importo corrispondente alla parte non ancora erogata. Il diritto
            di recesso non spetta a chi acquista nell’esercizio di un’attività
            professionale o d’impresa.
          </p>
        </>
      ),
    },
    {
      id: "proprieta",
      title: "Proprietà intellettuale",
      body: (
        <p>
          Testi, materiali didattici, dispense, ebook, presentazioni, immagini,
          marchi e ogni altro contenuto del sito e dei percorsi sono di
          proprietà del professionista o dei rispettivi titolari e sono protetti
          dalla normativa sul diritto d’autore. L’acquisto attribuisce una
          licenza d’uso <strong>personale e non trasferibile</strong>: non è
          consentito riprodurre, pubblicare, distribuire, rivendere, condividere
          con terzi o utilizzare i materiali per finalità commerciali o
          formative senza autorizzazione scritta.
        </p>
      ),
    },
    {
      id: "responsabilita",
      title: "Limitazioni di responsabilità",
      body: (
        <p>
          Il professionista si impegna a erogare i servizi con la diligenza
          richiesta dalla propria attività, assumendo un’obbligazione di mezzi e
          non di risultato: non è garantito alcuno specifico esito economico,
          creditizio, fiscale o occupazionale. Il professionista non risponde
          delle decisioni assunte autonomamente dal cliente, del comportamento
          di banche, intermediari, enti o piattaforme terze, né di interruzioni
          del sito dovute a cause non imputabili, quali guasti di rete,
          malfunzionamenti dei fornitori tecnologici o eventi di forza maggiore.
          Restano ferme le responsabilità inderogabili di legge, che nulla in
          queste condizioni intende limitare.
        </p>
      ),
    },
    {
      id: "reclami",
      title: "Reclami e risoluzione delle controversie",
      body: (
        <p>
          Per qualsiasi reclamo puoi scrivere a{" "}
          <a href={`mailto:${titolare.email}`}>{titolare.email}</a>: riceverai
          riscontro nel più breve tempo possibile. In quanto consumatore puoi
          inoltre ricorrere agli strumenti di risoluzione alternativa delle
          controversie previsti dal Codice del Consumo e rivolgerti agli
          organismi ADR competenti.
        </p>
      ),
    },
    {
      id: "legge",
      title: "Legge applicabile e foro competente",
      body: (
        <p>
          Il contratto è regolato dalla legge italiana. Per le controversie con
          un consumatore è competente in via esclusiva il foro del luogo di
          residenza o domicilio elettivo del consumatore, se ubicato in Italia.
          Per le controversie con soggetti che agiscono nell’esercizio di
          un’attività professionale o d’impresa è competente in via esclusiva il
          foro di Catania.
        </p>
      ),
    },
  ];

  return (
    <LegalPage
      eyebrow="Termini"
      title={
        <>
          Termini e condizioni
          <br />
          <span className="serif-italic text-[var(--color-accent)]">
            di vendita e di utilizzo.
          </span>
        </>
      }
      intro={
        <>
          Le regole che governano l’uso di questo sito e l’acquisto di
          consulenze, percorsi formativi e contenuti digitali. Sono scritte per
          essere lette: cosa acquisti, come si conclude il contratto, come si
          paga, quando puoi ripensarci.
        </>
      }
      updatedAt={LEGAL_UPDATED_AT}
      sections={sections}
      footnote={
        <>
          Per il trattamento dei dati personali consulta la{" "}
          <Link href="/privacy">Privacy Policy</Link>; per i cookie usati dal
          sito la <Link href="/cookie-policy">Cookie Policy</Link>.
        </>
      }
    />
  );
}
