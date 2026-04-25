'use server';

import { createClient } from '@/lib/supabase/browser';
import { callOpenRouter } from '@/lib/openrouter';
import { revalidatePath } from 'next/cache';

export async function ingestCrmContact(formData: FormData) {
  try {
    // Get the uploaded file
    const file = formData.get('file') as File;
    
    if (!file) {
      return { success: false, error: 'Nessun file selezionato' };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Tipo di file non supportato. Utilizzare PDF o immagini (JPG, PNG, GIF, WebP)' };
    }

    // Convert file to base64 for Gemini processing
    const arrayBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(arrayBuffer).toString('base64');

    // Prepare prompt for Gemini to extract contact information
    const prompt = `
      Analizza questo documento (PDF o immagine) e estrai le informazioni di contatto in formato JSON rigoroso.
      Cerca i seguenti campi: nome, email, telefono, azienda.
      
      Restituisci SOLO un oggetto JSON con questa struttura esatta:
      {
        "nome": "stringa o null se non trovato",
        "email": "stringa o null se non trovato", 
        "telefono": "stringa o null se non trovato",
        "azienda": "stringa o null se non trovato"
      }
      
      Se un campo non è presente nel documento, usa null.
      Non includere testo aggiuntivo, spiegazioni o markdown - solo il JSON puro.
    `;

      // Call Gemini via OpenRouter to extract contact data
      const geminiResponse = await callOpenRouter(
        'google/gemini-2.0-flash-001', // Using flash for faster/cheaper processing
        `Sei un assistente specializzato nell'estrazione di dati di contatto da documenti. Segui le istruzioni con precisione.`,
        prompt
      );

      // Parse the JSON response from Gemini
      let extractedData: { nome: string | null; email: string | null; telefono: string | null; azienda: string | null };
      try {
        extractedData = JSON.parse(geminiResponse);
        
        // Validate the structure
        const requiredFields = ['nome', 'email', 'telefono', 'azienda'];
        for (const field of requiredFields) {
          if (!(field in extractedData)) {
            extractedData[field as keyof typeof extractedData] = null;
          } else {
            const value = extractedData[field as keyof typeof extractedData];
            if (value !== null && typeof value !== 'string') {
              extractedData[field as keyof typeof extractedData] = null;
            }
          }
        }
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', geminiResponse);
        return { success: false, error: 'Impossibile elaborare la risposta dal servizio di estrazione' };
      }

      // Save to Supabase
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('crm_contatti')
      .insert({
        nome: extractedData.nome || null,
        email: extractedData.email || null,
        telefono: extractedData.telefono || null,
        azienda: extractedData.azienda || null,
        tenant_id: 0, // Force tenant_id = 0 as requested
        note: `Contatto importato automaticamente da file ${file.name} tramite ingestione AI`
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: 'Errore durante il salvataggio nel database' };
    }

    // Revalidate the contacts path to refresh the UI
    revalidatePath('/contatti');

    return { 
      success: true, 
      data: {
        id: data[0]?.id,
        nome: extractedData.nome,
        email: extractedData.email,
        telefono: extractedData.telefono,
        azienda: extractedData.azienda
      }
    };
  } catch (err) {
    console.error('CRM Ingestion error:', err);
    return { success: false, error: 'Errore interno durante l\'elaborazione del file' };
  }
}