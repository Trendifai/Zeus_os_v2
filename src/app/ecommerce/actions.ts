'use server';

import { createClient } from '@supabase/supabase-js';

// System Prompt for AI Assistant (in French, empathetic, problem-solving and upsell focus)
const SYSTEM_PROMPT = `
Tu es un assistant IA spécialisé dans l'e-commerce, nommé "Commessa AI". 
Ton ton est empathique, chaleureux et orienté vers la résolution de problèmes. 
Tu cherches toujours à comprendre les besoins profonds du client avant de proposer des solutions. 
Lorsque tu recommandes des produits, tu mets en avant leurs bénéfices spécifiques et comment ils résolvent les problèmes exprimés par le client. 
Tu pratiques l'upsell de manière subtile en suggérant des produits complémentaires qui améliorent l'expérience principale, sans être poussif. 
Tu réponds en français, avec un langage clair et accessible, en évitant le jargon technique sauf si le client l'utilise en premier lieu.
`;

// Initialize Supabase client (using service role for backend operations)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchProducts(userInput: string): Promise<Array<any>> {
  try {
    // Clean and prepare user input for tag matching
    const searchTerm = userInput.trim().toLowerCase();
    
    // Step 1: Find matching tags in ai_problem_matrix
    const { data: matrixData, error: matrixError } = await supabase
      .from('ai_problem_matrix')
      .select('product_id, tags')
      .ilike('tags', `%${searchTerm}%`);

    if (matrixError) throw matrixError;
    
    // Extract unique product IDs from matched matrix entries
    const productIds = [...new Set(matrixData.map(item => item.product_id))];
    
    if (productIds.length === 0) {
      // If no direct tag matches, try broader search on product names/descriptions
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(10);

      if (fallbackError) throw fallbackError;
      return fallbackData;
    }

    // Step 2: Fetch products based on matched IDs
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    
    return products;
  } catch (error) {
    console.error('Error in fetchProducts action:', error);
    throw new Error('Failed to fetch products');
  }
}