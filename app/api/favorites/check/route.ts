import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const catId = searchParams.get('catId');

  if (!userId || !catId) return NextResponse.json({ isFavorited: false });

  const client = await clientPromise;
  const db = client.db('purrfect-paws');

  const existing = await db.collection('favorites').findOne({ 
      userId: userId, 
      catId: new ObjectId(catId) 
  });

  return NextResponse.json({ isFavorited: !!existing });
}