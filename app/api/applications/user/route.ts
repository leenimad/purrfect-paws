import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { Application } from '../../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('purrfect-paws');

    // Find applications where applicantEmail matches, sorted by newest first
    const applications = await db
      .collection<Application>('applications')
      .find({ applicantEmail: email })
      .sort({ submissionDate: -1 })
      .toArray();

    return NextResponse.json(applications);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}