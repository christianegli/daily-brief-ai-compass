
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";

// Get OpenAI API key from environment variable
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// Define CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SummarizeRequest {
  sourceType: 'email' | 'slack' | 'calendar' | 'message';
  sourceId?: string;
  content: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Ensure request is POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { sourceType, sourceId, content, userId } = await req.json() as SummarizeRequest;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call OpenAI to generate summary
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are an efficient assistant that summarizes content for busy professionals. Create only one sentence summaries that highlight the most important information. Also assess urgency on a scale of 1-10.'
          },
          {
            role: 'user',
            content: `Please summarize this ${sourceType} content in exactly one clear and concise sentence. Also provide a priority score between 1-10 where 10 is extremely urgent and 1 is not urgent at all, and indicate if it's urgent (true/false). Return JSON with keys: summary, priorityScore, isUrgent.\n\nContent: ${content}`
          }
        ],
      }),
    });

    const openaiData = await openaiResponse.json();
    console.log("OpenAI response:", JSON.stringify(openaiData));

    // Parse the summary, priority score, and urgency from response
    let summary = "Summary not available";
    let priorityScore = 1; 
    let isUrgent = false;

    try {
      // Extract the response text
      const responseText = openaiData.choices[0].message.content;
      
      // Try to parse JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        summary = parsedData.summary;
        priorityScore = parsedData.priorityScore;
        isUrgent = parsedData.isUrgent;
      } else {
        // Fallback handling if no JSON found
        summary = responseText.split(".")[0] + ".";
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
    }

    // Save to database
    const { data: summaryData, error: summaryError } = await supabaseClient
      .from('content_summaries')
      .insert([
        {
          user_id: userId,
          source_id: sourceId || null,
          source_type: sourceType,
          original_content: content,
          summary: summary,
          priority_score: priorityScore,
          is_urgent: isUrgent
        }
      ])
      .select()
      .single();

    if (summaryError) {
      console.error("Error saving summary:", summaryError);
      throw summaryError;
    }

    // Return the summary
    return new Response(
      JSON.stringify({
        success: true,
        summary: summaryData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in summarize-content function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
