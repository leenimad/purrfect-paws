import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('purrfect-paws');

    // Fetch all applications, sorted by newest
    const applications = await db
      .collection('applications')
      .find({})
      .sort({ submissionDate: -1 })
      .toArray();

    return NextResponse.json(applications);
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}