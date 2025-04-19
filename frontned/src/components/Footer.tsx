import { Link } from 'react-router-dom';
import { School } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="flex items-center mb-4">
            <School className="h-8 w-8 mr-2 text-primary" />
            <span className="gradient-text text-2xl font-bold">UniPortal</span>
          </Link>
          <p className="text-gray-600 text-center max-w-md">
            Helping students find their perfect academic path and connecting institutions with bright minds.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Company</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Explore</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/colleges" className="text-gray-600 hover:text-primary transition-colors">
                  Colleges
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Scholarships
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Resources</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} UniPortal. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-500 text-sm">
              Designed with ❤️ for aspiring students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
