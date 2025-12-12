// import { NextResponse } from 'next/server';

// export const runtime = 'edge';

// export async function POST(req: Request) {
//   try {
//     const { prompt } = await req.json();
//     const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

//     if (!apiKey) {
//       return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
//     }

//     // We call the Google AI Studio endpoint DIRECTLY
//      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         contents: [{
//           parts: [{ text: prompt }]
//         }]
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Google API Error:", errorData);
//       throw new Error(errorData.error?.message || 'Failed to fetch from Google');
//     }

//     const data = await response.json();
//     // Extract the text from Google's complex response structure
//     const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No description generated.";

//     return NextResponse.json({ text: generatedText });

//   } catch (error: any) {
//     console.error("Server Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // We construct the prompt to be very specific
    const finalPrompt = `Write a short, heartwarming adoption description (2-3 sentences) for a cat with these traits: ${prompt}`;

    // Pollinations.ai accepts the prompt directly in the URL
    // It is free, public, and requires NO API KEY.
    const url = `https://text.pollinations.ai/${encodeURIComponent(finalPrompt)}`;

    const response = await fetch(url, {
      method: 'GET', // It uses a simple GET request
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Pollinations AI');
    }

    // It returns plain text, not JSON
    const text = await response.text();

    return NextResponse.json({ text: text });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}