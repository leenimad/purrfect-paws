// 'use client';

// import { useState } from 'react';

// export default function ContactForm() {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setStatus('idle');

//     try {
//       const res = await fetch('/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (!res.ok) throw new Error('Failed to send');

//       setStatus('success');
//       setFormData({ name: '', email: '', message: '' }); // Reset form
//     } catch (error) {
//       console.error(error);
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section id="contact" className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-purple-100">
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
//         <p className="text-gray-500 mt-2">Have a question or want to visit? Send us a message!</p>
//       </div>

//       {status === 'success' ? (
//         <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-200">
//           <p className="text-xl font-bold mb-2">Message Sent! 🚀</p>
//           <p>Thank you for reaching out. We will check our inbox and get back to you soon.</p>
//           <button 
//             onClick={() => setStatus('idle')}
//             className="mt-4 text-sm font-bold underline hover:text-green-800"
//           >
//             Send another message
//           </button>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
//               <input 
//                 type="text" 
//                 name="name" 
//                 value={formData.name} 
//                 onChange={handleChange} 
//                 required 
//                 className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
//                 placeholder="John Doe"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
//               <input 
//                 type="email" 
//                 name="email" 
//                 value={formData.email} 
//                 onChange={handleChange} 
//                 required 
//                 className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
//                 placeholder="john@example.com"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
//             <textarea 
//               name="message" 
//               value={formData.message} 
//               onChange={handleChange} 
//               required 
//               rows={4} 
//               className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
//               placeholder="I'm interested in adopting..."
//             ></textarea>
//           </div>

//           {status === 'error' && (
//             <p className="text-red-500 text-center text-sm font-bold">
//               Something went wrong. Please try again.
//             </p>
//           )}

//           <button 
//             type="submit" 
//             disabled={loading}
//             className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl hover:bg-brand-purple-dark transition-transform hover:scale-[1.01] shadow-lg disabled:opacity-50"
//           >
//             {loading ? 'Sending...' : 'Send Message'}
//           </button>
//         </form>
//       )}
//     </section>
//   );
// }
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // Send data to our API route
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (error) {
      console.error("Form Error:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border border-purple-100 mt-12 mb- pt-32">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
        <p className="text-gray-500 mt-2">Have a question? Send us a message!</p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center border border-green-200 animate-fade-in">
          <p className="text-xl font-bold mb-2">Message Sent! 🚀</p>
          <p>We'll get back to you shortly.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 text-sm font-bold underline hover:text-green-800"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              required 
              rows={4} 
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition"
              placeholder="I'm interested in adopting..."
            ></textarea>
          </div>

          {status === 'error' && (
            <p className="text-red-500 text-center text-sm font-bold bg-red-50 p-3 rounded-lg">
              ❌ Something went wrong. Check the console for details.
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl hover:bg-brand-purple-dark transition-transform hover:scale-[1.01] shadow-lg disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </section>
  );
}