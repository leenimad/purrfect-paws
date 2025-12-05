import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(request: Request) {
  try {
    const { appId, status, catId } = await request.json();
    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    const session = client.startSession();

    await session.withTransaction(async () => {
        // 1. Update Application Status
        await db.collection('applications').updateOne(
            { _id: new ObjectId(appId) },
            { $set: { status: status } }, // 'Approved' or 'Rejected'
            { session }
        );

        // 2. If Approved, Update Cat Status to 'Adopted'
        if (status === 'Approved' && catId) {
            await db.collection('cats').updateOne(
                { _id: new ObjectId(catId) },
                { $set: { status: 'Adopted' } },
                { session }
            );
        }
        
        // 3. (Optional Logic) If Rejected, set Cat back to 'Available'
        if (status === 'Rejected' && catId) {
             await db.collection('cats').updateOne(
                { _id: new ObjectId(catId) },
                { $set: { status: 'Available' } },
                { session }
            );
        }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}