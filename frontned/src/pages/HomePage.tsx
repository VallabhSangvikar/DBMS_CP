import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Building, BookOpen, Users, Search, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find Your Perfect <span className="text-blue-600">College</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore, compare, and apply to the best colleges and universities matching your academic goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/colleges">
                Browse Colleges
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/courses">
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="h-2 bg-blue-600"></div>
              <CardContent className="pt-6 pb-8 px-6">
                <Search className="h-10 w-10 mb-4 text-blue-600" />
                <h3 className="text-xl font-semibold mb-2">Search Colleges</h3>
                <p className="text-gray-600">
                  Find the perfect college by location, courses, rankings, and more.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="h-2 bg-purple-600"></div>
              <CardContent className="pt-6 pb-8 px-6">
                <BookOpen className="h-10 w-10 mb-4 text-purple-600" />
                <h3 className="text-xl font-semibold mb-2">Explore Courses</h3>
                <p className="text-gray-600">
                  Browse through various courses offered by top colleges.
                </p>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="h-2 bg-green-600"></div>
              <CardContent className="pt-6 pb-8 px-6">
                <GraduationCap className="h-10 w-10 mb-4 text-green-600" />
                <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
                <p className="text-gray-600">
                  Apply to multiple colleges through our simple application process.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Academic Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students finding their ideal college match.
          </p>
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Colleges</h2>
            <Button asChild variant="outline">
              <Link to="/colleges">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">Indian Institute of Technology</h3>
                <p className="text-gray-500 mb-2">New Delhi, Delhi</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">A++</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/colleges/1">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">BITS Pilani</h3>
                <p className="text-gray-500 mb-2">Pilani, Rajasthan</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">A+</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/colleges/3">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">NIT Karnataka</h3>
                <p className="text-gray-500 mb-2">Surathkal, Karnataka</p>
                <div className="flex items-center text-yellow-500 mb-4">
                  <Award className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">A+</span>
                </div>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/colleges/2">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
