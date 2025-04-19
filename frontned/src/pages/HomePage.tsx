import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  GraduationCap, Building, BookOpen, Users, Search, 
  Award, TrendingUp, Smile, Users2, ArrowRight, Star
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-blue-100 text-primary text-sm font-medium">
            Discover Your Academic Future
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Find Your Perfect <span className="gradient-text">College</span> Journey
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Explore, compare, and apply to the best colleges and universities matching your academic goals and career aspirations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <Link to="/colleges" className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Browse Colleges
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Link to="/courses" className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Courses
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="p-1.5 bg-white shadow-lg rounded-2xl grid grid-cols-3 divide-x">
              <div className="px-8 py-4 text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-500">Colleges</div>
              </div>
              <div className="px-8 py-4 text-center">
                <div className="text-3xl font-bold text-secondary">2000+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="px-8 py-4 text-center">
                <div className="text-3xl font-bold text-accent">10k+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-2 px-3 py-1.5 rounded-full bg-indigo-100 text-primary text-sm font-medium">
              Simple Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to find and apply to colleges that match your academic goals and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 rounded-2xl shadow-lg card-hover">
              <div className="h-2 bg-primary"></div>
              <CardContent className="pt-8 pb-8 px-6">
                <div className="h-14 w-14 mb-6 rounded-2xl bg-primary bg-opacity-10 flex items-center justify-center">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Search Colleges</h3>
                <p className="text-gray-600">
                  Find the perfect college by location, courses, rankings, and admission criteria that match your profile.
                </p>
                <Link to="/colleges" className="inline-flex items-center mt-4 text-primary font-medium">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 rounded-2xl shadow-lg card-hover">
              <div className="h-2 bg-secondary"></div>
              <CardContent className="pt-8 pb-8 px-6">
                <div className="h-14 w-14 mb-6 rounded-2xl bg-secondary bg-opacity-10 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Explore Courses</h3>
                <p className="text-gray-600">
                  Browse through various courses offered by top colleges with detailed information about eligibility and curriculum.
                </p>
                <Link to="/courses" className="inline-flex items-center mt-4 text-secondary font-medium">
                  Find Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 rounded-2xl shadow-lg card-hover">
              <div className="h-2 bg-accent"></div>
              <CardContent className="pt-8 pb-8 px-6">
                <div className="h-14 w-14 mb-6 rounded-2xl bg-accent bg-opacity-10 flex items-center justify-center">
                  <GraduationCap className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Apply Online</h3>
                <p className="text-gray-600">
                  Apply to multiple colleges through our simple application process and track your application status in real-time.
                </p>
                <Link to="/register" className="inline-flex items-center mt-4 text-accent font-medium">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium">
            Join Thousands of Students
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Academic Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students finding their ideal college match and building their future.
          </p>
          <Button 
            asChild 
            size="lg"
            className="bg-white text-primary hover:bg-opacity-90 rounded-xl px-8 py-6 text-lg font-medium"
          >
            <Link to="/register" className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Get Started Today
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <div className="inline-block mb-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                Top Rated
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Colleges</h2>
            </div>
            <Button 
              asChild 
              variant="outline"
              className="mt-4 md:mt-0 border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link to="/colleges" className="flex items-center">
                View All Colleges <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-medium text-primary">
                  Top Technical Institute
                </div>
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">Indian Institute of Technology</h3>
                <p className="text-gray-500 mb-2">New Delhi, Delhi</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">A++</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90">
                  <Link to="/colleges/1">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-violet-400 to-violet-600 relative">
                <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-medium text-primary">
                  Research Excellence
                </div>
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">BITS Pilani</h3>
                <p className="text-gray-500 mb-2">Pilani, Rajasthan</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">A+</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:opacity-90">
                  <Link to="/colleges/3">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
                <div className="absolute bottom-4 left-4 bg-white rounded-full px-3 py-1 text-xs font-medium text-primary">
                  Industry Connections
                </div>
              </div>
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-2">NIT Karnataka</h3>
                <p className="text-gray-500 mb-2">Surathkal, Karnataka</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">A+</span>
                </div>
                <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90">
                  <Link to="/colleges/2">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from students who found their perfect academic match through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <CardContent className="pt-8 pb-8 px-6 relative">
                <div className="absolute top-4 right-4 text-primary opacity-20">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5C5 15.5 7.5 10 15 10V15C15 15.663 14.7366 16.2989 14.2678 16.7678C13.7989 17.2366 13.163 17.5 12.5 17.5V20ZM27.5 20H22.5C21.837 20 21.2011 19.7366 20.7322 19.2678C20.2634 18.7989 20 18.163 20 17.5C20 15.5 22.5 10 30 10V15C30 15.663 29.7366 16.2989 29.2678 16.7678C28.7989 17.2366 28.163 17.5 27.5 17.5V20Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">
                  "UniPortal helped me find my dream college with the perfect computer science program. The application process was seamless!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">RK</div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Rahul Kumar</h4>
                    <p className="text-sm text-gray-500">Computer Science Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <CardContent className="pt-8 pb-8 px-6 relative">
                <div className="absolute top-4 right-4 text-secondary opacity-20">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5C5 15.5 7.5 10 15 10V15C15 15.663 14.7366 16.2989 14.2678 16.7678C13.7989 17.2366 13.163 17.5 12.5 17.5V20ZM27.5 20H22.5C21.837 20 21.2011 19.7366 20.7322 19.2678C20.2634 18.7989 20 18.163 20 17.5C20 15.5 22.5 10 30 10V15C30 15.663 29.7366 16.2989 29.2678 16.7678C28.7989 17.2366 28.163 17.5 27.5 17.5V20Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">
                  "I was able to compare colleges side by side and make an informed decision. Now I'm studying at my top choice university!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-medium">PP</div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Priya Patel</h4>
                    <p className="text-sm text-gray-500">Business Administration Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 rounded-2xl shadow-lg overflow-hidden card-hover">
              <CardContent className="pt-8 pb-8 px-6 relative">
                <div className="absolute top-4 right-4 text-accent opacity-20">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5C5 15.5 7.5 10 15 10V15C15 15.663 14.7366 16.2989 14.2678 16.7678C13.7989 17.2366 13.163 17.5 12.5 17.5V20ZM27.5 20H22.5C21.837 20 21.2011 19.7366 20.7322 19.2678C20.2634 18.7989 20 18.163 20 17.5C20 15.5 22.5 10 30 10V15C30 15.663 29.7366 16.2989 29.2678 16.7678C28.7989 17.2366 28.163 17.5 27.5 17.5V20Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-gray-600 mb-6">
                  "The scholarship information on UniPortal was invaluable. I secured financial aid that made my education possible."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-medium">AK</div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Ananya Kapoor</h4>
                    <p className="text-sm text-gray-500">Engineering Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
