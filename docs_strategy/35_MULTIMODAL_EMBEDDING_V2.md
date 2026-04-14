# PIPELINE: Multimodal ETL (Gemini Embedding 2)
**ID:** 29_MULTIMODAL_EMBEDDING_V2  
**Status:** INSERIMENTO / UPGRADE INFRASTRUTTURA  
**Architetto:** CTO Gemini

## 0. ANALISI E CONTESTO STRATEGICO (Note del CTO)
**Input originale:** Video "Google ha appena cambiato gli Embeddings per sempre! (Gemini Embedding 2)".
**Crash-Test:** Fino ad oggi, per gestire audio, video e PDF servivano pipeline separate (Whisper per audio, Tesseract per OCR, chunking manuale). Costi alti, latenza enorme. Il nuovo modello multimodale comprime testo, video (fino a 120s), audio e PDF interi (fino a 6 pagine) nello stesso spazio latente (Matryoshka representation).
**Verdetto:** Svolta vitale per il ROI. Abbattiamo i costi computazionali eliminando i layer intermedi. La pipeline ETL descritta in `18_MULTIMODAL_ETL_PIPELINE.md` va riscritta basandola su questo modello.

---

## 1. Visione Strategica
Abbandoniamo la pipeline ETL frammentata. Zeus OS utilizzerà un unico modello vettoriale multimodale per processare la conoscenza aziendale dei tenant.

## 2. Architettura del Dato
- **Input:** Il cliente (es. Manipura) fa drag&drop di un video di un processo produttivo, una fattura PDF o una nota vocale su ZeusClaw.
- **Processing Unit:** Chiamata diretta a `text-embedding-005` (Gemini 2). Nessun OCR intermedio.
- **Storage:** Il vettore (3072 dimensioni o compresso) viene salvato su Supabase (pgvector) associato al `tenant_id`.

## 3. Use Case: Manipura Studio
La ricerca semantica diventa totale. L'IA può rispondere a: *"Trovami il punto del video dove spiegavamo il packaging del sapone alla Lavanda e confrontalo con il PDF del fornitore"* incrociando i vettori istantaneamente.

## 4. ROI
- Risparmio stimato del 70% sui costi API di pre-processing dei dati.
- Velocità di ingestion (Data Rescue) moltiplicata per 10.

---
[GCA HANDOFF - EPIC ARCHITECT MODE]
Invocare [EPIC Architect] per aggiornare la logica di Server Action relativa all'upload e vector-storage per usare text-embedding-005. GCA HANDOFF COMPLETED