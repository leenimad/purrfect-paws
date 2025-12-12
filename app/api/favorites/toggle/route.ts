import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { userId, catId } = await request.json();

    if (!userId || !catId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    const favoritesCollection = db.collection('favorites');

    // Check if it already exists
    const existing = await favoritesCollection.findOne({ 
        userId: userId, 
        catId: new ObjectId(catId) 
    });

    if (existing) {
        // UN-LIKE: Remove it
        await favoritesCollection.deleteOne({ _id: existing._id });
        return NextResponse.json({ isFavorited: false });
    } else {
        // LIKE: Add it
        await favoritesCollection.insertOne({ 
            userId: userId, 
            catId: new ObjectId(catId),
            createdAt: new Date()
        });
        return NextResponse.json({ isFavorited: true });
    }

  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}