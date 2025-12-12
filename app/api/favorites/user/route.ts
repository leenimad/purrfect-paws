import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json([]);

  const client = await clientPromise;
  const db = client.db('purrfect-paws');

  // 1. Get all favorite IDs for this user
  const favorites = await db.collection('favorites').find({ userId }).toArray();
  const catIds = favorites.map(f => f.catId);

  if (catIds.length === 0) return NextResponse.json([]);

  // 2. Fetch the actual Cat Details for those IDs
  const cats = await db.collection('cats').find({ 
    _id: { $in: catIds } 
  }).toArray();

  return NextResponse.json(cats);
}