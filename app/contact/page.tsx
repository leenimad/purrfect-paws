import ContactForm from '@/components/ContactForm'; // Import the working form

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Header Banner */}
      <div className="bg-brand-purple text-white py-20 text-center rounded-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="mt-4 text-lg text-purple-100 opacity-90">We'd love to hear from you</p>
      </div>
      
      {/* 2. Main Content Grid */}
      <div className="container mx-auto px-4 py-16 max-w-6xl grid lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COLUMN: Contact Info (Static) */}
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Have questions about the adoption process? Want to volunteer at our shelter? 
                    Or just want to say hi to the cats? Drop us a message!
                </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-2xl">📍</div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Visit Us</p>
                        <p className="text-lg font-medium text-gray-800">123 Meow street, Nablus, Palestine</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-2xl">📞</div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Call Us</p>
                        <p className="text-lg font-medium text-gray-800">+970 597888999</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-2xl">✉️</div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Email Us</p>
                        <p className="text-lg font-medium text-gray-800">leeni.batta@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: The Working Form */}
        <div>
            {/* We use the component here so it sends REAL emails via Resend! */}
            <ContactForm />
        </div>

      </div>
    </div>
  );
}