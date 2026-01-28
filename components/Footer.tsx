import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container max-w-7xl px-4 md:px-6 py-10 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="flex flex-col space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl text-indigo-600">
                EduPlus
              </span>
            </Link>
            <p className="text-sm text-gray-500">
              Empowering learners worldwide with accessible, high-quality education.
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-semibold mb-4 text-gray-900">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/courses" className="hover:text-indigo-600 transition-colors">Browse Courses</Link></li>
              <li><Link href="/instructors" className="hover:text-indigo-600 transition-colors">Instructors</Link></li>
              <li><Link href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EduPlus. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             {/* Social placeholders using simple text or svgs if needed, kept simple for now */}
             <a href="#" className="hover:text-gray-900 transition-colors">Twitter</a>
             <a href="#" className="hover:text-gray-900 transition-colors">LinkedIn</a>
             <a href="#" className="hover:text-gray-900 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
