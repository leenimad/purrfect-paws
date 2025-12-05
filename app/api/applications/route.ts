// // import { NextResponse } from 'next/server';
// // import clientPromise from '../../../lib/mongodb';
// // import { Application } from '../../../types';
// // import { ObjectId } from 'mongodb';

// // export async function POST(request: Request) {
// //   try {
// //     const applicationData = await request.json();
// //     const { catId, catName, applicantName, applicantEmail, applicantPhone, livingSituation, experience } = applicationData;

// //     if (!catId || !applicantName || !applicantEmail) {
// //         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
// //     }

// //     const newApplication: Omit<Application, '_id'> = {
// //         catId: new ObjectId(catId),
// //         catName,
// //         applicantName,
// //         applicantEmail,
// //         applicantPhone,
// //         livingSituation,
// //         experience,
// //         submissionDate: new Date(),
// //     };
    
// //     const client = await clientPromise;
// //     const db = client.db('purrfect-paws');
    
// //     // Use a transaction to ensure both operations succeed or fail together
// //     const session = client.startSession();
// //     try {
// //         await session.withTransaction(async () => {
// //             // 1. Insert the new application
// //             await db.collection('applications').insertOne(newApplication, { session });

// //             // 2. Update the cat's status to 'Pending'
// //             await db.collection('cats').updateOne(
// //                 { _id: new ObjectId(catId) },
// //                 { $set: { status: 'Pending' } },
// //                 { session }
// //             );
// //         });
// //         return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });
// //     } finally {
// //         await session.endSession();
// //     }

// //   } catch (e) {
// //     console.error(e);
// //     return NextResponse.json({ error: 'Unable to submit application' }, { status: 500 });
// //   }
// // }
// import { NextResponse } from 'next/server';
// import clientPromise from '../../../lib/mongodb';
// import { Application } from '../../../types';
// import { ObjectId } from 'mongodb';
// import { Resend } from 'resend'; // Import Resend
// import { EmailTemplate } from '../../../components/EmailTemplate'; // Import Template

// // Initialize Resend with your Key
// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(request: Request) {
//   try {
//     const applicationData = await request.json();
//     const { catId, catName, applicantName, applicantEmail, applicantPhone, livingSituation, experience } = applicationData;

//         if (!catId || !applicantName || !applicantEmail) {
//         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const newApplication: Omit<Application, '_id'> = {
//         catId: new ObjectId(catId),
//         catName,
//         applicantName,
//         applicantEmail,
//         applicantPhone,
//         livingSituation,
//         experience,
//         status: 'Pending',
//         submissionDate: new Date(),

//     };
    
//     const client = await clientPromise;
//     const db = client.db('purrfect-paws');
    
//     const session = client.startSession();
//     try {
//         await session.withTransaction(async () => {
//             // 1. Save to MongoDB
//             await db.collection('applications').insertOne(newApplication, { session });

//             // 2. Update Cat Status
//             await db.collection('cats').updateOne(
//                 { _id: new ObjectId(catId) },
//                 { $set: { status: 'Pending' } },
//                 { session }
//             );
//         });

//         // 3. SEND EMAIL VIA RESEND (The External Service Call)
//         await resend.emails.send({
//             from: 'Purrfect Paws <onboarding@resend.dev>', // Use this test email provided by Resend
//             to: [applicantEmail], // The user's email
//             subject: `Application Received: ${catName}`,
//             react: await EmailTemplate({ applicantName, catName }),
//         });

//         return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

//     } finally {
//         await session.endSession();
//     }

//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Unable to submit application' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { Application, Cat } from '../../../types';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/EmailTemplate';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const applicationData = await request.json();
    const { catId, catName, applicantName, applicantEmail, applicantPhone, livingSituation, experience } = applicationData;

    // 1. Validate Input
    if (!catId || !applicantName || !applicantEmail) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('purrfect-paws');

    // 2. FETCH THE CAT FIRST
    // We need to find the cat to know WHO owns it (The Shelter ID)
    const cat = await db.collection<Cat>('cats').findOne({ _id: new ObjectId(catId) });

    if (!cat) {
        return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    // 3. Prepare the New Application Object
    const newApplication: Omit<Application, '_id'> = {
        catId: new ObjectId(catId),
        catName,
        applicantName,
        applicantEmail,
        applicantPhone,
        livingSituation,
        experience,
        submissionDate: new Date(),
        status: 'Pending',
        // CRITICAL: This connects the application to the Shelter's Dashboard
        // If the cat is old and has no owner, default to 'admin'
        catOwnerId: cat.ownerId || 'admin' 
    };
    
    // 4. Run Database Transaction (Save App + Update Cat Status)
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
            // Save Application
            await db.collection('applications').insertOne(newApplication, { session });

            // Update Cat to "Pending"
            await db.collection('cats').updateOne(
                { _id: new ObjectId(catId) },
                { $set: { status: 'Pending' } },
                { session }
            );
        });
    } finally {
        await session.endSession();
    }

    // 5. Send Confirmation Email (Try/Catch so email errors don't crash the whole request)
    try {
        await resend.emails.send({
            from: 'Purrfect Paws <onboarding@resend.dev>',
            to: ['Leeni.batta@gmail.com'], 
            subject: `Application Received: ${catName}`,
            react:await EmailTemplate({ applicantName, catName }),
        });
    } catch (emailError) {
        console.error("Email failed to send:", emailError);
        // We continue anyway because the database save was successful
    }

    return NextResponse.json({ message: 'Application submitted successfully' }, { status: 201 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to submit application' }, { status: 500 });
  }
}