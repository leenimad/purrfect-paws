// export default function Footer() {
//     return (
//       <footer className="bg-gray-100 mt-12">
//         <div className="container mx-auto px-6 py-4 text-center text-gray-600">
//           <p>&copy; {new Date().getFullYear()} Purrfect Paws. All rights reserved.</p>
//         </div>
//       </footer>
//     );
//   }
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold text-brand-purple-dark flex items-center gap-2 mb-4">
              <span>🐾</span> Purrfect Paws
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Connecting loving families with cats in need. We are a non-profit organization dedicated to animal welfare and responsible pet ownership.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-brand-purple transition">Find a Cat</Link></li>
              <li><Link href="/about" className="hover:text-brand-purple transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-purple transition">Contact Us</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-brand-purple transition">Adoption Process</Link></li>
            </ul>
          </div>

          {/* Admin/User */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Account</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="/login" className="hover:text-brand-purple transition">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-brand-purple transition">Sign Up</Link></li>
              <li><Link href="/admin" className="hover:text-brand-purple transition">Shelter Login</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Purrfect Paws Adoption Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}