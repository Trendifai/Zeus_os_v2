SPECIFICHE ARCHITETTURALI ZEUS: "Google Workspace MCP"
Progetto: Zeus OS (by Agentia)
Focus: Integrazione Ecosistema Cliente tramite Model Context Protocol (MCP)
File di riferimento futuro: mcp-server-google/index.ts

1. La Filosofia del "Connettore Invisibile"
L'obiettivo non è ricreare Google Drive dentro Zeus. L'obiettivo è usare il protocollo MCP per trasformare le API di Google in "Strumenti" (Tools) che i nostri Agenti AI possono usare in totale autonomia, come se avessero un mouse e una tastiera.

2. Flusso dell'Architettura MCP
FASE A: Autorizzazione (Il Passaporto)
Nella scheda "Impostazioni" della Dashboard Cliente (/dashboard/settings), il cliente clicca su "Connetti Google Workspace".

Esegue il login OAuth standard di Google.

Supabase salva in modo criptato il refresh_token di Google associandolo al tenant_id (es. Manipura).

FASE B: Il Server MCP Indipendente
Per non appesantire Next.js, creeremo un microservizio separato (un server MCP scritto in Node.js/TypeScript) che fa solo una cosa: traduce le richieste dell'AI in chiamate API di Google.

Questo server esporrà dei Tools standardizzati all'intelligenza artificiale, ad esempio:

read_google_doc(doc_id)

search_drive(query)

create_sheet(title, data)

draft_gmail(to, subject, body)

FASE C: L'Esecuzione Autonoma (La Magia)
Quando il cliente (Manipura) scrive nella console del Project Manager AI:

"Analizza il documento 'Specifiche Progetto Alpha' su Drive e creamici un diagramma di Gantt nei task."

Ecco cosa succede in 2 secondi:

L'Agente AI di Zeus riceve il prompt.

Capisce che gli serve Google Drive. Chiede al nostro Server MCP di eseguire search_drive('Specifiche Progetto Alpha').

Il Server MCP recupera il token di Manipura da Supabase, interroga Google, scarica il testo del documento e lo passa all'Agente AI.

L'Agente AI legge il testo, pensa, e poi usa un altro tool interno di Zeus (create_task) per popolare la Kanban Board.

3. Sicurezza e "Blast Radius"
Isolamento Token: Il Server MCP caricherà solo i token OAuth del tenant_id che sta effettuando la richiesta. È fisicamente impossibile che l'Agente AI di Manipura legga i documenti del Cliente B.

Permessi Granulari (Scopes): Chiederemo a Google solo i permessi strettamente necessari (drive.readonly, gmail.compose). Non daremo mai all'IA il permesso di eliminare file in modo permanente.