import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="text-center max-w-lg mx-auto bg-white p-10 rounded-lg shadow-lg pt-32">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-3xl font-bold mt-4">Application Submitted!</h1>
      <p className="text-gray-600 mt-2">
        Thank you for your interest. A volunteer from the shelter will review your application and contact you within 3-5 business days.
      </p>
      <Link href="/" className="mt-8 inline-block bg-purple-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-purple-700">
        Back to Homepage
      </Link>
    </div>
  );
}