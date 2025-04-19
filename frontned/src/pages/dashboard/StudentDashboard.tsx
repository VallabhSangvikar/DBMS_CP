import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  BookOpen, Clock, Award, School, GraduationCap, Calendar, BarChart4,
  CreditCard, Building, ArrowRight, User, Users, FileText, CheckCircle, 
  AlertCircle, Clock3
} from 'lucide-react'
import StudentService, { Scholarship } from "@/services/student.service"
import CourseService from "@/services/course.service"
import CollegeService from "@/services/college.service"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [scholarshipApplications, setScholarshipApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileData = await StudentService.getProfile()
        setProfile(profileData)
        
        // Fetch applications
        const applicationsData = await CourseService.getStudentApplications()
        setApplications(applicationsData)
        
        // Fetch college recommendations
        const collegesData = await CollegeService.getAllColleges()
        setColleges(collegesData.slice(0, 3))
        
        // Fetch scholarships
        const scholarshipsData = await StudentService.getScholarships()
        setScholarships(scholarshipsData)
        
        // Fetch scholarship applications
        const scholarshipAppsData = await StudentService.getScholarshipApplications()
        setScholarshipApplications(scholarshipAppsData)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to count applications by status
  const getStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 }
    applications.forEach(app => {
      if (counts.hasOwnProperty(app.status)) {
        counts[app.status as keyof typeof counts]++
      }
    })
    return counts
  }

  // Helper function to count scholarship applications by status
  const getScholarshipStatusCounts = () => {
    const counts = { pending: 0, approved: 0, rejected: 0 }
    scholarshipApplications.forEach(app => {
      if (counts.hasOwnProperty(app.status)) {
        counts[app.status as keyof typeof counts]++
      }
    })
    return counts
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden border-0 shadow-lg rounded-2xl">
          <div className="h-24 bg-gradient-to-r from-primary to-accent"></div>
          <CardContent className="pt-6 pb-8 px-8 text-center">
            <div className="h-20 w-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center mx-auto -mt-16 mb-6">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to UniPortal</h2>
            <p className="text-gray-600 mb-8">Complete your profile to get personalized college recommendations and application tracking.</p>
            <Button asChild className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Link to="/profile/create" className="flex items-center justify-center">
                <FileText className="mr-2 h-5 w-5" />
                Complete Your Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
          <p className="text-gray-600 mt-1">Manage your academic journey and applications</p>
        </div>
        <div className="flex items-center space-x-2">
          {profile.is_verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              Verified Student
            </Badge>
          )}
          <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-blue-600">Course Applications</p>
              <h3 className="text-2xl font-bold mt-1">{applications.length}</h3>
              <p className="text-sm text-blue-700 mt-1">
                {getStatusCounts().approved} approved
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-blue-500 bg-opacity-15 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-violet-50 to-violet-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-violet-600">Scholarship Applications</p>
              <h3 className="text-2xl font-bold mt-1">{scholarshipApplications.length}</h3>
              <p className="text-sm text-violet-700 mt-1">
                {getScholarshipStatusCounts().approved} approved
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-violet-500 bg-opacity-15 flex items-center justify-center">
              <Award className="h-7 w-7 text-violet-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-emerald-600">Available Scholarships</p>
              <h3 className="text-2xl font-bold mt-1">{scholarships.length}</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Open opportunities
              </p>
            </div>
            <div className="h-14 w-14 rounded-full bg-emerald-500 bg-opacity-15 flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 h-14 p-1 bg-muted rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <FileText className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="scholarships" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm py-3">
            <Award className="h-4 w-4 mr-2" />
            Scholarships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Information */}
            <Card className="md:col-span-1 border-0 shadow-md rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-accent h-3"></div>
              <CardHeader>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-4">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <CardTitle>My Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                      <BarChart4 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Entrance Exam</p>
                      <p className="font-medium">{profile.entrance_exam_name} ({profile.entrance_exam_percentile}%)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                      <Users className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium">{profile.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <BookOpen className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Stream</p>
                      <p className="font-medium">{profile.stream}</p>
                    </div>
                  </div>
                  
                  {profile.college_name && (
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                        <School className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">College</p>
                        <p className="font-medium">{profile.college_name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  <Link to="/profile/edit" className="flex items-center justify-center">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* College Information if assigned */}
            {profile.college_name ? (
              <Card className="md:col-span-2 border-0 shadow-md rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24 flex items-center px-6">
                  <School className="h-12 w-12 text-white" />
                  <div className="ml-4 text-white">
                    <h2 className="text-xl font-semibold">{profile.college_name}</h2>
                    <p className="text-sm opacity-90">Your Current College</p>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">You are registered as a student of this college. Access college resources, courses, and student services.</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{profile.college_location || "Location unavailable"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Accreditation</p>
                      <p className="font-medium">{profile.college_accreditation || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link to={`/colleges/${profile.college_id}`} className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        View College Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="md:col-span-2 border-0 shadow-md rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-24 flex items-center px-6">
                  <AlertCircle className="h-12 w-12 text-white" />
                  <div className="ml-4 text-white">
                    <h2 className="text-xl font-semibold">No College Assigned</h2>
                    <p className="text-sm opacity-90">Apply to courses to get started</p>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">You're not currently assigned to any college. Browse courses and submit applications to start your academic journey.</p>
                  <Button asChild className="bg-amber-500 hover:bg-amber-600">
                    <Link to="/courses" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Available Courses
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-4">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Course Applications</CardTitle>
                  <CardDescription>Track the status of your course applications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {applications.length === 0 ? (
                <div className="text-center py-10">
                  <div className="h-16 w-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto mb-6">You haven't applied to any courses yet. Browse available courses and submit your first application.</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => (
                    <div 
                      key={app.application_id} 
                      className="border rounded-xl p-5 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{app.course_name}</h3>
                          <p className="text-gray-500">{app.college_name}</p>
                        </div>
                        <Badge 
                          className={`px-3 py-1 text-xs ${
                            app.status === 'approved' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            app.status === 'rejected' 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                            'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {app.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {app.status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {app.status === 'pending' && <Clock3 className="h-3 w-3 mr-1" />}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">FACULTY</p>
                          <p className="font-medium">{app.faculty_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">APPLIED ON</p>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {new Date(app.application_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">APPLICATION ID</p>
                          <p className="font-medium">#{app.application_id}</p>
                        </div>
                      </div>
                      {app.comments && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">COMMENTS</p>
                          <p className="text-sm">{app.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 border-t py-4 px-6">
              <Button asChild variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                <Link to="/courses" className="flex items-center">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Browse More Courses
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="scholarships" className="space-y-8">
          {/* My Scholarship Applications */}
          <Card className="border-0 shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-100">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-violet-500 text-white flex items-center justify-center mr-4">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>My Scholarship Applications</CardTitle>
                  <CardDescription>Track your scholarship application status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {scholarshipApplications.length === 0 ? (
                <div className="text-center py-10">
                  <div className="h-16 w-16 rounded-full bg-violet-100 mx-auto flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-violet-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Scholarship Applications</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">You haven't applied for any scholarships yet. Check out available opportunities below.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {scholarshipApplications.map((app) => (
                    <div
                      key={app.application_id}
                      className="border rounded-xl p-5 hover:border-violet-200 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{app.scholarship_name}</h3>
                          <p className="text-gray-500">{app.college_name}</p>
                        </div>
                        <Badge 
                          className={`px-3 py-1 text-xs ${
                            app.status === 'approved' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            app.status === 'rejected' 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                            'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {app.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {app.status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {app.status === 'pending' && <Clock3 className="h-3 w-3 mr-1" />}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">AMOUNT</p>
                          <p className="font-medium text-green-600">₹{app.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">APPLIED ON</p>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {new Date(app.application_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">APPLICATION ID</p>
                          <p className="font-medium">#{app.application_id}</p>
                        </div>
                      </div>
                      {app.comments && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 mb-1">COMMENTS</p>
                          <p className="text-sm">{app.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Scholarships */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Award className="h-5 w-5 mr-2 text-violet-500" />
                Available Scholarships
              </h2>
              <Badge variant="outline" className="px-3 py-1.5">
                {scholarships.length} Available
              </Badge>
            </div>
            
            {scholarships.length === 0 ? (
              <Card className="border-0 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Scholarships Available</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    There are currently no scholarships available for application. Check back later for new opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.scholarship_id} className="border-0 shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-600"></div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{scholarship.scholarship_name}</CardTitle>
                          <CardDescription className="mt-1">{scholarship.college_name}</CardDescription>
                        </div>
                        <div className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">
                          ₹{scholarship.amount.toLocaleString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          {scholarship.eligibility_criteria && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-1">ELIGIBILITY CRITERIA</p>
                              <p className="text-sm">{scholarship.eligibility_criteria}</p>
                            </div>
                          )}
                          
                          {scholarship.deadline && (
                            <div className="flex items-center text-sm text-amber-700 mt-2">
                              <Clock className="h-4 w-4 mr-1.5" />
                              Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {scholarship.description && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-600">{scholarship.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90" asChild>
                        <Link to={`/scholarships/${scholarship.scholarship_id}/apply`}>Apply Now</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* College Recommendations */}
      <div className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            Recommended Colleges
          </h2>
          <Button asChild variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
            <Link to="/colleges" className="flex items-center">
              <ArrowRight className="h-4 w-4 mr-1.5" />
              View All
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Card key={college.college_id} className="border-0 shadow-md rounded-xl overflow-hidden card-hover">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 flex items-end p-4">
                <Badge className="bg-white text-blue-600">{college.accreditation}</Badge>
              </div>
              <CardContent className="pt-5">
                <h3 className="font-bold text-xl mb-1">{college.college_name}</h3>
                <p className="text-gray-500 mb-4 flex items-center text-sm">
                  <Building className="h-3.5 w-3.5 mr-1" />
                  {college.city}, {college.location_state}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Established</p>
                    <p className="font-medium">{college.established_year}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Campus</p>
                    <p className="font-medium">{college.campus_size || '–'} acres</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to={`/colleges/${college.college_id}`}>
                    View College
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
