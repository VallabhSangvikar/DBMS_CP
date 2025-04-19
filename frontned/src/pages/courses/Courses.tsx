import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, BookOpen, Clock, School, Calendar, TrendingUp, GraduationCap, Award, FileText, Building, Briefcase } from 'lucide-react';
import CourseService, { Course } from '@/services/course.service';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Badge } from '@/components/ui/badge';

// Helper function to generate course category badge
const getCategoryBadge = (courseName: string) => {
  const name = courseName.toLowerCase();
  if (name.includes('b.') || name.includes('bachelor') || name.includes('bsc')) {
    return { label: 'Undergraduate', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  } else if (name.includes('m.') || name.includes('master') || name.includes('msc')) {
    return { label: 'Postgraduate', color: 'bg-purple-100 text-purple-800 border-purple-200' };
  } else if (name.includes('ph.d') || name.includes('doctorate')) {
    return { label: 'Ph.D', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
  return { label: 'Certificate', color: 'bg-green-100 text-green-800 border-green-200' };
};

// Helper function to get a gradient color for each course card
const getCourseCardGradient = (courseId: number) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600', 
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-emerald-500 to-emerald-600',
    'from-cyan-500 to-cyan-600'
  ];
  return colors[courseId % colors.length];
};

// Generate course category icon
const getCategoryIcon = (courseName: string) => {
  const name = courseName.toLowerCase();
  if (name.includes('b.') || name.includes('bachelor')) {
    return <GraduationCap className="h-5 w-5" />;
  } else if (name.includes('m.') || name.includes('master')) {
    return <Award className="h-5 w-5" />;
  } else if (name.includes('ph.d') || name.includes('doctorate')) {
    return <FileText className="h-5 w-5" />;
  }
  return <BookOpen className="h-5 w-5" />;
};

// Helper function to determine course category by name
const getCourseCategory = (courseName: string): string => {
  const name = courseName?.toLowerCase() || '';
  if (name.includes('b.') || name.includes('bachelor') || name.includes('bsc')) {
    return 'undergraduate';
  } else if (name.includes('m.') || name.includes('master') || name.includes('msc')) {
    return 'postgraduate';
  } else if (name.includes('ph.d') || name.includes('doctorate')) {
    return 'phd';
  }
  return 'other';
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popularCategories, setPopularCategories] = useState<string[]>([
    'Computer Science', 'Engineering', 'Medicine', 'Business', 'Arts', 'Science'
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Get real data from backend with college names
        const data = await CourseService.getAllCoursesWithColleges();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load courses');
        // Set empty arrays instead of using dummy data
        setCourses([]);
        setFilteredCourses([]);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Apply filters whenever filter values or active category changes
  useEffect(() => {
    if (!courses || !courses.length) return;
    
    let result = [...courses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        course => {
          const courseName = course.course_name || '';
          const collegeName = course.college_name || '';
          return (
            courseName.toLowerCase().includes(query) || 
            collegeName.toLowerCase().includes(query)
          );
        }
      );
    }

    // Apply category filter if not 'all'
    if (activeCategory !== 'all') {
      result = result.filter(course => {
        const courseName = course.course_name || '';
        return getCourseCategory(courseName) === activeCategory;
      });
    }

    setFilteredCourses(result);
  }, [searchQuery, activeCategory, courses]);

  // Loading skeleton component
  const CourseCardSkeleton = () => (
    <Card className="overflow-hidden border shadow-md">
      <div className="h-20 bg-gray-200 animate-pulse"></div>
      <CardContent className="pt-6 pb-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
        <div className="h-5 bg-gray-100 rounded animate-pulse mb-3 w-1/2"></div>
        <div className="flex justify-between mt-4">
          <div className="h-5 bg-gray-100 rounded animate-pulse w-1/3"></div>
          <div className="h-5 bg-gray-100 rounded animate-pulse w-1/3"></div>
        </div>
      </CardContent>
      <div className="h-10 bg-gray-50 border-t p-5"></div>
    </Card>
  );

  // Generate loading skeletons
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-8">
        <div className="space-y-6">
          <div className="h-10 bg-gray-200 animate-pulse w-1/4 rounded-md"></div>
          <div className="h-8 bg-gray-100 animate-pulse w-1/3 rounded"></div>
          <div className="h-12 bg-gray-200 animate-pulse max-w-md rounded-lg"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 mt-16">
      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501504905252-473c47e087f8')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10 py-12 px-6 md:px-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Courses</h1>
          <p className="text-lg max-w-xl mb-6 text-white/90">
            Discover academic programs that match your interests and career goals from top institutions across India.
          </p>
          
          <div className="relative max-w-2xl bg-white rounded-xl shadow-lg p-1.5 flex">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10 pr-4 py-6 rounded-lg border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-base"
              placeholder="Search for courses, topics, or colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="ml-2 px-6 bg-gradient-to-r from-primary to-accent rounded-lg">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-primary" />
              Browse Courses
              {filteredCourses.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-0">
                  {filteredCourses.length} results
                </Badge>
              )}
            </h2>
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeCategory} 
            onValueChange={setActiveCategory} 
            className="mb-6"
          >
            <TabsList className="p-1 bg-gray-100/70 rounded-full">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-full data-[state=active]:shadow-sm"
              >
                All Courses
              </TabsTrigger>
              <TabsTrigger 
                value="undergraduate" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-full data-[state=active]:shadow-sm"
              >
                Undergraduate
              </TabsTrigger>
              <TabsTrigger 
                value="postgraduate" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-full data-[state=active]:shadow-sm"
              >
                Postgraduate
              </TabsTrigger>
              <TabsTrigger 
                value="phd" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary rounded-full data-[state=active]:shadow-sm"
              >
                Ph.D
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Error display */}
          {error && <ErrorDisplay error={error} />}

          {/* Courses grid */}
          {filteredCourses.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <BookOpen className="mx-auto h-14 w-14 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-gray-600 mt-2">
                We couldn't find any courses matching your search criteria.
              </p>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90" 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map(course => {
                const courseName = course.course_name || '';
                const collegeName = course.college_name || 'Unknown College';
                const categoryInfo = getCategoryBadge(courseName);
                const cardGradient = getCourseCardGradient(course.course_id);
                return (
                  <Card key={course.course_id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all rounded-xl">
                    <div className={`h-16 bg-gradient-to-r ${cardGradient} flex items-center px-6`}>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          {getCategoryIcon(courseName)}
                        </div>
                        <Badge className={`${categoryInfo.color} border`}>
                          {categoryInfo.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{courseName}</h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <Building size={15} className="mr-1.5 flex-shrink-0 text-gray-500" />
                        <span className="truncate">{collegeName}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                          <Clock size={16} className="mr-1.5 text-gray-500" />
                          <span className="text-sm">{course.duration} years</span>
                        </div>
                        
                        <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                          <TrendingUp size={16} className="mr-1.5 text-gray-500" />
                          <span className="text-sm">₹{course.fee?.toLocaleString() || 'N/A'}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t px-6 py-4 bg-gray-50">
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                        <Link to={`/courses/${course.course_id}`} className="flex items-center justify-center">
                          View Course Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Sidebar with additional information */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
            <h3 className="font-medium mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Popular Categories
            </h3>
            <div className="space-y-2">
              {popularCategories.map(category => (
                <Button 
                  key={category} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-gray-700 hover:text-primary hover:bg-primary/5" 
                  onClick={() => setSearchQuery(category)}
                >
                  <span className="truncate">{category}</span>
                </Button>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Career Resources
              </h3>
              <div className="space-y-3">
                <Link to="/opportunities" className="text-sm flex items-center text-gray-700 hover:text-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  Campus Recruitment
                </Link>
                <Link to="/scholarships" className="text-sm flex items-center text-gray-700 hover:text-primary">
                  <Award className="h-4 w-4 mr-2" />
                  Scholarships
                </Link>
                <Link to="/alumni" className="text-sm flex items-center text-gray-700 hover:text-primary">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Alumni Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
