import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { Cat } from '../../../../types';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  // 1. Change the type here to Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 2. Await the params before using them
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    
    const cat = await db
      .collection<Cat>('cats')
      .findOne({ _id: new ObjectId(id) });

    if (!cat) {
      return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    return NextResponse.json(cat);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch cat' }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // NEW: We expect an 'ownerId' and 'ownerEmail' in the body now
    const { name, age, breed, gender, color, description, medicalHistory, imageUrls, ownerId, ownerEmail} = body;

    const newCat = {
      name,
      age: Number(age),
      breed,
      gender,
      color,
      description,
      medicalHistory: medicalHistory || {},
      imageUrls,
      status: 'Available',
      // NEW: Save ownership info
      ownerId: ownerId, 
      ownerEmail: ownerEmail 
    };

    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    await db.collection('cats').insertOne(newCat);

    return NextResponse.json({ message: 'Cat added successfully' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Remove the _id from the body so we don't try to update the immutable primary key
    const { _id, ...updateData } = body;

    const client = await clientPromise;
    const db = client.db('purrfect-paws');

    const result = await db.collection('cats').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cat updated successfully' });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Failed to update cat' }, { status: 500 });
  }
}
