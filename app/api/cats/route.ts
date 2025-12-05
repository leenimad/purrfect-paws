// import { NextResponse } from 'next/server';
// import clientPromise from '../../../lib/mongodb';
// import { Cat } from '../../../types';

// export async function GET() {
//   try {
//     const client = await clientPromise;
//     const db = client.db('purrfect-paws');
//     const cats = await db
//       .collection<Cat>('cats')
//       .find({ status: 'Available' })
//       .sort({ name: 1 })
//       .toArray();

//     return NextResponse.json(cats);
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Unable to fetch cats' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { Cat } from '../../../types';
import { ObjectId } from 'mongodb';

// GET Function (Keep this as is, or paste this block if it was missing)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    // Only fetch Available cats for the public list
    const cats = await db
      .collection<Cat>('cats')
      .find({ status: 'Available' })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(cats);
  } catch (e) {
    console.error("GET Error:", e);
    return NextResponse.json({ error: 'Unable to fetch cats' }, { status: 500 });
  }
}

// POST Function (This is the one causing your error)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Destructure all fields, including the new owner ones
    const { name, age, breed, gender, color, description, medicalHistory, imageUrls, ownerId, ownerEmail } = body;

    // 1. Server-side Validation
    if (!name || !imageUrls || imageUrls.length === 0) {
      console.error("Validation Failed: Missing name or image");
      return NextResponse.json({ error: 'Name and Image are required' }, { status: 400 });
    }

    // 2. Construct the Cat Object safely
    const newCat: Omit<Cat, '_id'> = {
      name,
      age: Number(age), // Ensure age is a number
      breed,
      gender,
      color,
      description,
      // Provide defaults if medicalHistory is missing from the form
      medicalHistory: medicalHistory || {
         vaccinations: 'Not specified',
         spayedNeutered: false,
         healthNotes: 'None provided'
      },
      imageUrls, 
      status: 'Available',
      // Add the owner info (safely handle if undefined)
      ownerId: ownerId || 'admin', 
      ownerEmail: ownerEmail || 'admin@purrfectpaws.com',
      ownerName: body.ownerName || 'Admin' // Default to 'Admin' if not provided
    };

    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    
    // 3. Insert into Database
    const result = await db.collection('cats').insertOne(newCat);
    
    console.log("Cat Inserted ID:", result.insertedId); // Log success

    return NextResponse.json({ message: 'Cat added successfully', id: result.insertedId }, { status: 201 });

  } catch (e: any) {
    // 4. Log the ACTUAL error to your terminal so you can see it
    console.error("--------------------------------");
    console.error("❌ API ERROR IN POST /api/cats:");
    console.error(e.message);
    console.error(e.stack);
    console.error("--------------------------------");
    
    return NextResponse.json({ error: 'Failed to add cat: ' + e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('purrfect-paws');

    // Delete the cat
    await db.collection('cats').deleteOne({ _id: new ObjectId(id) });
    
    // Optional: Delete associated applications too
    await db.collection('applications').deleteMany({ catId: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}