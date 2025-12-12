import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Construct the prompt to give the AI a personality
    const prompt = `You are a helpful, friendly cat expert assistant for a shelter called 'Purrfect Paws'. 
    Answer this user question concisely (max 3 sentences): "${message}"`;

    // 2. Call Pollinations AI (The free solution)
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('AI Error');
    
    const text = await response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}