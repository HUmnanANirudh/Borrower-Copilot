import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt || "You are a helpful borrower copilot and negotiation assistant.",
      messages: messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Chat Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process AI request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
