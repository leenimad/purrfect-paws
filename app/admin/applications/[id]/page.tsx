import { notFound } from 'next/navigation';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import ApplicationActions from '@/components/ApplicationActions';
import Link from 'next/link';

// 1. Helper function to get data
async function getApplication(id: string) {
    if (!ObjectId.isValid(id)) return null;
    
    const client = await clientPromise;
    const db = client.db('purrfect-paws');
    
    const app = await db.collection('applications').findOne({ _id: new ObjectId(id) });
    if (!app) return null;

    const cat = await db.collection('cats').findOne({ _id: new ObjectId(app.catId) });

    return { 
        app: JSON.parse(JSON.stringify(app)), 
        cat: JSON.parse(JSON.stringify(cat)) 
    };
}

// 2. Define Props for Next.js 15
type Props = {
    params: Promise<{ id: string }>
}

// 3. Main Component
export default async function AdminApplicationDetails({ params }: Props) {
    // CRITICAL FIX: Await the params object before using .id
    const resolvedParams = await params; 
    
    const data = await getApplication(resolvedParams.id);
    
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-red-500">Application Not Found in Database</h1>
            </div>
        );
    }

    const { app, cat } = data;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/admin" className="text-brand-purple font-bold mb-6 inline-block hover:underline">
                    ← Back to Dashboard
                </Link>
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-brand-purple p-6 text-white">
                        <h1 className="text-2xl font-bold">Review Application</h1>
                        <div className="flex items-center gap-2 mt-2 opacity-90">
                            <span className="text-sm bg-white/20 px-2 py-1 rounded">
                                {app.status || 'Pending'}
                            </span>
                            <span>for {app.catName}</span>
                        </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Cat Context */}
                        <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
                            {cat?.imageUrls?.[0] && (
                                <img src={cat.imageUrls[0]} className="w-16 h-16 rounded-lg object-cover" alt="cat" />
                            )}
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{app.catName}</h3>
                                <p className="text-sm text-gray-500">{cat?.breed} • {cat?.age} years</p>
                            </div>
                        </div>

                        {/* Applicant Info Grid */}
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Applicant Name</label>
                                <p className="text-lg font-medium text-gray-900">{app.applicantName}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</label>
                                <p className="text-lg font-medium text-gray-900">{app.applicantEmail}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                                <p className="text-lg font-medium text-gray-900">{app.applicantPhone || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Submitted On</label>
                                <p className="text-lg font-medium text-gray-900">
                                    {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Unknown'}
                                </p>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Long Answers */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Living Situation</label>
                                <div className="bg-gray-50 p-5 rounded-xl text-gray-700 leading-relaxed border border-gray-200">
                                    {app.livingSituation}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Experience with Cats</label>
                                <div className="bg-gray-50 p-5 rounded-xl text-gray-700 leading-relaxed border border-gray-200">
                                    {app.experience}
                                </div>
                            </div>
                            
                        </div>
                             <ApplicationActions 
                            appId={app._id} 
                            catId={app.catId} 
                            currentStatus={app.status} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}