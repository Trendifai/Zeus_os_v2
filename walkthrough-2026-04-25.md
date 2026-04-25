# ZEUS OS v2 - Guida Operativa (2026-04-25)

## 🎯 Obiettivo: Validazione Modulo CRM e OCR

Questa guida descrive come testare le ultime implementazioni core.

### 1. Test Modulo CRM Isolato (`/dashboard/contatti`)
Il modulo contatti è stato isolato per garantire performance massime e caricamento atomico dei dati.

**Passaggi per il test:**
1. Navigare su `localhost:3000/dashboard`.
2. Dalla sidebar sinistra, cliccare sull'icona **CRM** (Database).
3. Verificare che il tab venga creato nel pannello centrale.
4. **Stress Test:** Provare ad aprire lo stesso modulo in uno "Split Panel" cliccando l'icona a destra del nome nel menu.
5. Verificare che il ridimensionamento delle colonne mantenga la leggibilità delle card dei lead.

### 2. Importazione Documenti via OCR (ZeusClaw)
La funzione OCR è ora legata direttamente ai comandi NLP di ZeusClaw.

**Passaggi per il test:**
1. Individuare il pannello di destra (**ZeusClaw AI Assistant**).
2. Provare il comando: `Analizza documento allegato per estrazione contatti`.
3. Verificare la comparsa del **loader ambra** durante l'elaborazione.
4. Il sistema restituirà un riepilogo in Markdown nel thread di chat.
5. Confermare che i dati estratti popolino correttamente il modulo CRM attivando il trigger di salvataggio.

### 3. Note sul Sistema Resizable
- La **Sidebar sinistra** può essere collassata cliccando la freccia per una modalità "Focus" (soli icone).
- La **Maniglia centrale** permette di bilanciare il carico tra due moduli aperti contemporaneamente.

---
**Supporto Tecnico:** Il sistema è in modalità "Zero Error Tolerance". Per anomalie, invocare il comando `/debug`.