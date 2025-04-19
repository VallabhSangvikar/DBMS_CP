import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CourseService from '@/services/course.service'
import CollegeService from '@/services/college.service'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  Award,
  Building,
  CheckCircle2,
  GraduationCap,
  BarChart2,
  FileText,
  ChevronRight,
  BookOpenCheck,
  School,
  Briefcase,
  BadgeCheck,
  TrendingUp
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

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

export default function CourseDetails() {
  const { id } = useParams()
  const courseId = parseInt(id || '0')
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState<any>(null)
  const [college, setCollege] = useState<any>(null)
  const [faculty, setFaculty] = useState<any[]>([])
  const [cutoffs, setCutoffs] = useState<any[]>([])
  const [similarCourses, setSimilarCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  
  // Application state
  const [showDialog, setShowDialog] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState<string>('')
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [applicationError, setApplicationError] = useState('')
  const [applied, setApplied] = useState(false)
  const [userApplications, setUserApplications] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError('Invalid course ID')
        setLoading(false)
        return
      }

      try {
        // Fetch course details
        const courseData = await CourseService.getCourseById(courseId)
        if (courseData) {
          setCourse(courseData)
          
          // Fetch college details
          const collegeData = await CollegeService.getCollegeById(courseData.college_id)
          if (collegeData) {
            setCollege(collegeData)
          }

          // Fetch faculty for this college
          const facultyData = await CollegeService.getCollegeFaculty(courseData.college_id)
          
          if (facultyData && facultyData.length > 0) {
            setFaculty(facultyData)
          }
          const cutoffsData = await CourseService.getCourseCutoffs(courseId)
          if (cutoffsData && cutoffsData.length > 0) {
            setCutoffs(cutoffsData)
          }
          
          // If user is logged in and is a student, check if already applied
          if (user && user.userType === 'student') {
            try {
              const applicationsData = await CourseService.getStudentApplications()
              setUserApplications(applicationsData)
              
              // Check if user has already applied for this course
              const alreadyApplied = applicationsData.some(
                (app: any) => app.course_id === courseId
              )
              setApplied(alreadyApplied)
            } catch (err) {
              console.error('Error fetching applications:', err)
            }
          }
        }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [courseId, user])


  // Handle course application
  const handleApply = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${courseId}` } })
      return
    }

    if (!selectedFaculty) {
      setApplicationError('Please select a faculty member')
      return
    }

    setSubmitting(true)
    setApplicationError('')

    try {
      await CourseService.applyToCourse({
        course_id: courseId,
        faculty_id: parseInt(selectedFaculty),
        comments
      })
      
      setApplied(true)
      setShowDialog(false)
      // Replace alert with dialog or toast notification in the future
      alert('Application submitted successfully!')
    } catch (err: any) {
      setApplicationError(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate trending metric for the course based on cutoffs
  const calculateTrend = () => {
    if (!cutoffs || cutoffs.length < 2) return 'steady';
    
    // Sort by year and take the most recent two years
    const sorted = [...cutoffs].sort((a, b) => b.year - a.year);
    if (sorted.length >= 2) {
      const latest = sorted[0]?.general || 0;
      const previous = sorted[1]?.general || 0;
      
      if (latest > previous + 2) return 'rising';
      if (latest < previous - 2) return 'falling';
    }
    return 'steady';
  };

  const courseTrend = calculateTrend();

  // Loading skeleton UI for better user experience
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-gray-200 h-8 w-1/3 rounded animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="bg-gray-200 h-8 w-1/2 rounded animate-pulse mb-3"></div>
              <div className="bg-gray-100 h-6 w-1/4 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="bg-gray-100 h-5 w-1/2 rounded animate-pulse mb-2"></div>
                  <div className="bg-gray-100 h-4 w-1/3 rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="bg-gray-100 h-5 w-1/2 rounded animate-pulse mb-2"></div>
                  <div className="bg-gray-100 h-4 w-1/3 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="bg-gray-200 h-5 w-1/4 rounded animate-pulse mb-3"></div>
              <div className="bg-gray-100 h-4 w-full rounded animate-pulse mb-2"></div>
              <div className="bg-gray-100 h-4 w-full rounded animate-pulse mb-2"></div>
              <div className="bg-gray-100 h-4 w-3/4 rounded animate-pulse mb-6"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="bg-gray-200 h-6 w-1/2 rounded animate-pulse mb-6"></div>
            <div className="bg-gray-100 h-20 w-full rounded animate-pulse mb-4"></div>
            <div className="bg-gray-200 h-10 w-full rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
        <Button 
          className="mt-4"
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-lg inline-flex items-center">
          <FileText className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Course not found</p>
        </div>
        <div className="mt-6">
          <Button 
            onClick={() => navigate('/courses')}
          >
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  // Course category information
  const categoryInfo = getCategoryBadge(course.course_name);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative p-8 text-white">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <Badge className={`${categoryInfo.color} border`}>
              {categoryInfo.label}
            </Badge>
            {courseTrend === 'rising' && (
              <Badge variant="outline" className="bg-green-100/20 text-green-50 border-green-400/30">
                <TrendingUp className="h-3 w-3 mr-1" /> High Demand
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{course.course_name}</h1>
          
          <div className="flex items-center text-white/90">
            <Building className="h-4 w-4 mr-1.5" />
            <span>{college?.college_name}, {college?.city}</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="flex flex-col items-start">
              <div className="flex items-center text-white/80 mb-1 text-sm">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>Duration</span>
              </div>
              <span className="text-lg font-medium">{course.duration} years</span>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center text-white/80 mb-1 text-sm">
                <GraduationCap className="h-4 w-4 mr-1.5" />
                <span>Fee Structure</span>
              </div>
              <span className="text-lg font-medium">₹{course.fee?.toLocaleString() || 'NA'}/year</span>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center text-white/80 mb-1 text-sm">
                <Users className="h-4 w-4 mr-1.5" />
                <span>Faculty Members</span>
              </div>
              <span className="text-lg font-medium">{faculty.length}</span>
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center text-white/80 mb-1 text-sm">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Session Start</span>
              </div>
              <span className="text-lg font-medium">July 2025</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content - Course Details */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/30 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                <BookOpen className="h-4 w-4 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="eligibility" className="data-[state=active]:bg-white">
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Eligibility
              </TabsTrigger>
              <TabsTrigger value="cutoffs" className="data-[state=active]:bg-white">
                <BarChart2 className="h-4 w-4 mr-1.5" />
                Cutoffs
              </TabsTrigger>
              <TabsTrigger value="faculty" className="data-[state=active]:bg-white">
                <Users className="h-4 w-4 mr-1.5" />
                Faculty
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <BookOpenCheck className="h-5 w-5 mr-2 text-primary" />
                    About this Course
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {course.description || `${course.course_name} offers a comprehensive curriculum designed to equip students with the necessary skills and knowledge required in today's competitive industry. The program combines theoretical learning with practical applications, providing students with a solid foundation and specialized expertise in the field.`}
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Key Highlights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Industry-Aligned Curriculum</h4>
                        <p className="text-sm text-gray-600">Designed with input from industry experts</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Internship Opportunities</h4>
                        <p className="text-sm text-gray-600">Partnerships with leading organizations</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <School className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Research Projects</h4>
                        <p className="text-sm text-gray-600">Opportunity to work on cutting-edge research</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Certification Programs</h4>
                        <p className="text-sm text-gray-600">Additional certifications to boost your resume</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    Career Paths
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                      <h4 className="font-medium mb-1">Industry</h4>
                      <p className="text-sm text-gray-600">Corporate roles in leading companies</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                      <h4 className="font-medium mb-1">Research</h4>
                      <p className="text-sm text-gray-600">Academic and R&D positions</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                      <h4 className="font-medium mb-1">Entrepreneurship</h4>
                      <p className="text-sm text-gray-600">Start your own venture</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    College Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">{college?.college_name}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{college?.city}, {college?.location_state}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>Established: {college?.established_year}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Award className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>Accreditation: {college?.accreditation}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Mail className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{college?.contact_email}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="h-4 w-4 mr-1.5 text-gray-500" />
                        <span>{college?.contact_phone}</span>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Globe className="h-4 w-4 mr-1.5" />
                        <a 
                          href={college?.website_url}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" className="flex items-center">
                      <Link to={`/colleges/${college?.college_id}`}>
                        View College Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Eligibility Tab */}
            <TabsContent value="eligibility">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                      Academic Requirements
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Minimum 10+2 with Mathematics and Physics as core subjects</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Minimum aggregate of 60% marks in qualifying examination</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Entrance examination qualification (JEE/State Level)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <span>Meet the cutoff criteria for your category in the entrance exam</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Documentation Required
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>10th and 12th Mark Sheets and Certificates</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Entrance Examination Score Card</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Category Certificate (if applicable)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Income Certificate (for scholarship considerations)</span>
                      </li>
                      <li className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          <FileText className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Domicile/State Residency Certificate</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-xl font-medium mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Important Dates
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Application Opens</span>
                        <span>January 15, 2025</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Application Deadline</span>
                        <span>May 30, 2025</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Admissions Result</span>
                        <span>June 20, 2025</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Session Starts</span>
                        <span>July 15, 2025</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Cutoffs Tab */}
            <TabsContent value="cutoffs">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                    Cutoff Trends
                  </h3>
                  
                  {cutoffs.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600">No cutoff information is available for this course yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="py-3 px-4 text-left font-semibold border-b">Year</th>
                              <th className="py-3 px-4 text-left font-semibold border-b">General</th>
                              <th className="py-3 px-4 text-left font-semibold border-b">SC</th>
                              <th className="py-3 px-4 text-left font-semibold border-b">ST</th>
                              <th className="py-3 px-4 text-left font-semibold border-b">OBC</th>
                              <th className="py-3 px-4 text-left font-semibold border-b">EWS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cutoffs.map((cutoff, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{cutoff.year || '-'}</td>
                                <td className="py-3 px-4">{cutoff.general || '-'}%</td>
                                <td className="py-3 px-4">{cutoff.sc || '-'}%</td>
                                <td className="py-3 px-4">{cutoff.st || '-'}%</td>
                                <td className="py-3 px-4">{cutoff.obc || '-'}%</td>
                                <td className="py-3 px-4">{cutoff.ews || '-'}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 space-y-6">
                        <h4 className="font-medium">General Category Trend</h4>
                        <div className="space-y-3">
                          {cutoffs.slice().reverse().map((cutoff, index, arr) => {
                            // Calculate percentage filled in progress bar (assuming a scale of 0-100%)
                            const percentage = cutoff.general || 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{cutoff.year}</span>
                                  <span className="font-medium">{percentage}%</span>
                                </div>
                                <Progress value={percentage} className="h-2" />
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                            <InfoIcon className="h-4 w-4 mr-1.5" />
                            Note
                          </h4>
                          <p className="text-sm text-amber-700">
                            Cutoff percentages may vary based on the number of available seats and the 
                            entrance exam results each year. Students are advised to aim higher than the 
                            listed cutoffs to secure admission.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Faculty Tab */}
            <TabsContent value="faculty">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-medium mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Faculty Members
                  </h3>
                  
                  {faculty.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <p className="text-gray-600">No faculty information is available for this course yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {faculty.map((member) => (
                        <div 
                          key={member.faculty_id} 
                          className="flex items-start p-4 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors"
                        >
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="font-medium text-primary">
                              {member.username?.charAt(0).toUpperCase() || 'F'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{member.username}</h4>
                            <p className="text-sm text-gray-600">{member.department}</p>
                            <p className="text-sm text-gray-600 mt-1">{member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Similar Courses */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Similar Courses
              </CardTitle>
              <CardDescription>
                You might also be interested in these related courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:border-primary/20 transition-all hover:shadow">
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-blue-100 text-blue-800 border-blue-200 border">
                      Undergraduate
                    </Badge>
                    <h3 className="font-semibold">B.Tech Information Technology</h3>
                    <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                    <Button asChild variant="outline" className="w-full mt-3" size="sm">
                      <Link to={`/courses/2`} className="flex items-center justify-center">
                        View Course
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-primary/20 transition-all hover:shadow">
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-blue-100 text-blue-800 border-blue-200 border">
                      Undergraduate
                    </Badge>
                    <h3 className="font-semibold">B.Tech AI & Data Science</h3>
                    <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                    <Button asChild variant="outline" className="w-full mt-3" size="sm">
                      <Link to={`/courses/3`} className="flex items-center justify-center">
                        View Course
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="hover:border-primary/20 transition-all hover:shadow">
                  <CardContent className="p-4">
                    <Badge className="mb-2 bg-purple-100 text-purple-800 border-purple-200 border">
                      Postgraduate
                    </Badge>
                    <h3 className="font-semibold">M.Tech Computer Science</h3>
                    <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                    <Button asChild variant="outline" className="w-full mt-3" size="sm">
                      <Link to={`/courses/4`} className="flex items-center justify-center">
                        View Course
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Sidebar - Application */}
        <div className="space-y-6">
          {/* Application Card */}
          <Card className="border-0 shadow-sm sticky top-24">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Application
              </CardTitle>
              <CardDescription>
                Apply for the upcoming academic session
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 space-y-6">
              {!user ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 mb-3">Sign in to apply for this course.</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90" 
                      onClick={() => navigate('/login', { state: { from: `/courses/${courseId}` } })}
                    >
                      Login to Apply
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline">Register Now</Link>
                  </p>
                </div>
              ) : user.userType !== 'student' ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p className="text-gray-700">Only students can apply for courses.</p>
                </div>
              ) : applied ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <p className="text-green-800">You have already applied for this course.</p>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard/student')}
                  >
                    View Your Applications
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <p className="text-gray-700 mb-3">Limited seats available. Apply now for the upcoming academic session.</p>
                    <Dialog open={showDialog} onOpenChange={setShowDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                          Apply Now
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Apply for {course.course_name}</DialogTitle>
                          <DialogDescription>
                            Please complete the application form below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {applicationError && (
                          <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 flex items-center">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                            {applicationError}
                          </div>
                        )}
                        
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="faculty">Select Faculty Advisor</Label>
                            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a faculty member" />
                              </SelectTrigger>
                              <SelectContent>
                                {faculty.map(f => (
                                  <SelectItem key={f.faculty_id} value={f.faculty_id.toString()}>
                                    {f.username} - {f.department}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500">
                              The faculty advisor will guide you through the admission process
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="comments">Additional Comments (Optional)</Label>
                            <Textarea
                              id="comments"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              placeholder="Include any additional information you'd like the faculty to know"
                              rows={4}
                            />
                          </div>
                        </div>
                        
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleApply} 
                            disabled={submitting}
                            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          >
                            {submitting ? 'Submitting...' : 'Submit Application'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <p className="text-sm text-gray-500">
                    Application deadline: <span className="font-medium">May 30, 2025</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                Course Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Admission Difficulty</span>
                  <span className="font-medium">High</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Employment Rate</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Student Satisfaction</span>
                  <span className="font-medium">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Resources */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Course Brochure
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Academic Calendar
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <Building className="h-4 w-4 mr-2" />
                  Virtual Campus Tour
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-700">
                  <Users className="h-4 w-4 mr-2" />
                  Alumni Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// InfoIcon component
const InfoIcon = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
};
