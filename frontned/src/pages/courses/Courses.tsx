import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search } from 'lucide-react'
import CourseService, { Course } from '@/services/course.service'
import ErrorDisplay from '@/components/ErrorDisplay'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // Get real data from backend with college names
        const data = await CourseService.getAllCoursesWithColleges()
        setCourses(data)
        setFilteredCourses(data)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load courses')
        // Set empty arrays instead of using dummy data
        setCourses([])
        setFilteredCourses([])
        console.error("Error fetching courses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Apply filters whenever filter values or active category changes
  useEffect(() => {
    let result = courses

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        course => 
          course.courseName.toLowerCase().includes(query) || 
          (course.collegeName?.toLowerCase().includes(query))
      )
    }

    // Apply category filter if not 'all'
    if (activeCategory !== 'all') {
      result = result.filter(course => {
        // Extract degree type from course name (B.Tech, M.Tech, BSc, etc.)
        const nameLower = course.course_name.toLowerCase()
        
        switch(activeCategory) {
          case 'undergraduate':
            return nameLower.includes('b.') || nameLower.includes('bachelor') || nameLower.includes('bsc')
          case 'postgraduate':
            return nameLower.includes('m.') || nameLower.includes('master') || nameLower.includes('msc')
          case 'phd':
            return nameLower.includes('ph.d') || nameLower.includes('doctorate')
          default:
            return true
        }
      })
    }

    setFilteredCourses(result)
  }, [searchQuery, activeCategory, courses])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl">Loading courses...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-6">Find Courses</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search courses or colleges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
            <TabsTrigger value="postgraduate">Postgraduate</TabsTrigger>
            <TabsTrigger value="phd">Ph.D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Error display */}
      {error && <ErrorDisplay error={error} />}

      {/* Courses grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-gray-600 mt-2">Try adjusting your search filters</p>
          <Button className="mt-4" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Card key={course.course_id}>
              <CardHeader>
                <CardTitle>{course.course_name}</CardTitle>
                <p className="text-gray-600">{course.college_name || 'Unknown College'}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Duration: {course.duration} years</span>
                    <span>Fee: ₹{course.fee.toLocaleString()}</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link to={`/courses/${course.course_id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
