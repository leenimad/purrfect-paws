import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');

  const client = await clientPromise;
  const db = client.db('purrfect-paws');

  // 1. Get Cats owned by this user
  const cats = await db.collection('cats').find({ ownerId: ownerId }).toArray();

  // 2. Get Applications for cats owned by this user
  const applications = await db.collection('applications').find({ catOwnerId: ownerId }).toArray();

  return NextResponse.json({ cats, applications });
}