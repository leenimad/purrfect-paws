// import { NextResponse } from 'next/server';
// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   try {
//     const { name, email, message } = await request.json();

//     await resend.emails.send({
//       from: 'Contact Form <onboarding@resend.dev>',
//       to: ['leeni.batta@gmail.com'], // CHANGE THIS TO YOUR REAL EMAIL
//       subject: `New Message from ${name}`,
//       html: `<p><strong>From:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Log for debugging
    console.log("📩 Received contact form submission:", { name, email });

    // Send the email
    const { data, error } = await resend.emails.send({
      // SENDER: Must be this exact email for the free tier to work
      from: 'Contact Form <onboarding@resend.dev>', 
      
      // RECIPIENT: Must be the email YOU used to sign up for Resend
      to: ['leeni.batta@gmail.com'], 
      
      // REPLY-TO: Allows you to hit "Reply" in Gmail and email the user back
      replyTo: email, 

      subject: `New Message from ${name} (Purrfect Paws)`,
      html: `
        <div>
          <h1>New Contact Message</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f3f4f6; padding: 10px; border-left: 4px solid #8b5cf6;">
            ${message}
          </blockquote>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ Email sent successfully:", data);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}