// import Image from 'next/image';

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//        <div className="container mx-auto px-4 py-16">
//           <div className="text-center mb-16">
//              <h1 className="text-4xl font-extrabold text-brand-purple-dark mb-6">About Purrfect Paws</h1>
//              {/* <p className="text-xl text-gray-500 mt-4 max-w-2xl mx-auto">
//                 Purrfect Paws began with a simple mission: to ensure every cat in our city has a warm bed and a full belly. We are a "no-kill" sanctuary dedicated to rehabilitating and rehoming stray and abandoned felines.
//              </p>
//              <p className="text-gray-600 text-lg leading-relaxed">
//                 We believe that adoption is a partnership. That's why we meticulously check every application to ensure our cats find their "forever homes," not just temporary stops.
//             </p>
//           </div> */}
//   <h3 className="text-2xl font-extrabold text-brand-purple mb-6">More Than Just a Shelter</h3>
               
//             <p className="text-gray-600 text-lg leading-relaxed">
//                 We believe that adoption is a partnership. That's why we meticulously check every application to ensure our cats find their "forever homes," not just temporary stops.
//             </p>
//         </div>
//           <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
//              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
//                  {/* Replace with any cat image URL or local file */}
//                  <Image src="/images/about-cat.jpg" alt="Our shelter" fill className="object-cover" />
//              </div>
//              <div>
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
//                 <p className="text-gray-600 text-lg leading-relaxed mb-6">
//                     Founded in 2024, Purrfect Paws started with a simple belief: every cat deserves a second chance. 
//                     What began as a small foster network has grown into a community-driven platform connecting 
//                     hundreds of cats with forever families.
//                 </p>
//                 <div className="grid grid-cols-2 gap-6">
//                     <div className="bg-white p-6 rounded-xl shadow-sm text-center">
//                         <div className="text-3xl font-bold text-brand-purple">500+</div>
//                         <div className="text-gray-500">Adoptions</div>
//                     </div>
//                     <div className="bg-white p-6 rounded-xl shadow-sm text-center">
//                         <div className="text-3xl font-bold text-brand-purple">100%</div>
//                         <div className="text-gray-500">Volunteer Run</div>
//                     </div>
//                 </div>
//              </div>
//           </div>
//        </div>
//     </div>
//   );
// }
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section */}
      <div className="bg-brand-purple-light/30 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-purple-dark mb-4">
          About Purrfect Paws
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
          We are a non-profit dedicated to finding loving, forever homes for every stray cat in our city.
        </p>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* 2. Text Content & Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Founded in 2025, Purrfect Paws has rescued over 50 cats. We believe that every cat deserves a warm bed, a full bowl, and a loving human. We work tirelessly to vaccinate, neuter, and rehabilitate cats before placing them with their new families.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-2xl font-bold text-brand-purple mb-6">Visit Our Shelter</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-brand-purple">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Address</p>
                    <p className="text-gray-600">123 Meow street, Nablus, Palestine</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-brand-purple">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <p className="text-gray-600">leeni.batta@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-full shadow-sm text-brand-purple">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Phone</p>
                    <p className="text-gray-600">+970 597888999</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. The Map (Google Maps Embed)
          <div className="h-full min-h-[400px] w-full bg-gray-200 rounded-3xl overflow-hidden shadow-lg relative border-4 border-white">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14794.736132776809!2d35.2238171145768!3d32.225093826466185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1764972918647!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        
          </div> */}
            {/* 3. The Map (With Nablus Pin) */}
          <div className="h-full min-h-[400px] w-full bg-gray-200 rounded-3xl overflow-hidden shadow-lg relative border-4 border-white">
            <iframe 
                /* We use 'q=' to force a pin at these specific coordinates */
                src="https://maps.google.com/maps?q=32.2250938,35.2238171&z=15&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}