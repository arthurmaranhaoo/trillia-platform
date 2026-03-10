import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not set')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Model configuration with the prompt context properly set
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: context }]
      }
    })

    // Generating fixed response to avoid generic "AI model" hallucinations
    const result = await model.generateContent({
        contents: [
            { role: "user", parts: [{ text: message }] }
        ]
    })
    
    const response = await result.response
    const text = response.text()

    if (text.includes("modelo de linguagem") || text.includes("não tenho um catálogo")) {
        // Emergency reroute if Gemini still tries to be generic
        return new Response(
            JSON.stringify({ text: "Desculpe, tive um problema ao filtrar o contexto. Você poderia reformular sua pergunta sobre os produtos da Trillia?" }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Critical Edge Function Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
