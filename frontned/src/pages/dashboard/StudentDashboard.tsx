import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
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

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  if (error && !profile) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Welcome to UniPortal</h2>
              <p className="text-gray-600">Complete your profile to get started with your college journey</p>
              <Link to="/profile/create">
                <Button className="w-full">Complete Your Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Information */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="font-medium">Entrance Exam:</span> {profile.entrance_exam_name}</p>
                <p><span className="font-medium">Percentile:</span> {profile.entrance_exam_percentile}</p>
                <p><span className="font-medium">Category:</span> {profile.category}</p>
                <p><span className="font-medium">Stream:</span> {profile.stream}</p>
                <p><span className="font-medium">College:</span> {profile.college_name || 'Not assigned'}</p>
                {profile.is_verified && <Badge className="mt-2">Verified</Badge>}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/profile/edit">Edit Profile</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* College Information if assigned */}
            {profile.college_name && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>My College</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{profile.college_name}</h3>
                  <p className="text-sm text-gray-600 mb-4">You are registered as a student of this college.</p>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/colleges/${profile.college_id}`}>View College Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <div className="space-y-6">
            {/* Course Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Course Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications yet. Browse courses to apply!</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.application_id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{app.course_name}</h3>
                          <Badge 
                            variant={
                              app.status === 'approved' ? 'default' : 
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">College:</span> {app.college_name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Faculty:</span> {app.faculty_name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Applied on:</span> {new Date(app.application_date).toLocaleDateString()}
                        </p>
                        {app.comments && (
                          <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                            <span className="font-medium">Comments:</span> {app.comments}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scholarships">
          <div className="space-y-6">
            {/* My Scholarship Applications */}
            <Card>
              <CardHeader>
                <CardTitle>My Scholarship Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {scholarshipApplications.length === 0 ? (
                  <p className="text-gray-500">No scholarship applications yet. Apply for scholarships below!</p>
                ) : (
                  <div className="space-y-4">
                    {scholarshipApplications.map((app) => (
                      <div key={app.application_id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{app.scholarship_name}</h3>
                          <Badge 
                            variant={
                              app.status === 'approved' ? 'default' : 
                              app.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">College:</span> {app.college_name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Amount:</span> ₹{app.amount.toLocaleString()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Applied on:</span> {new Date(app.application_date).toLocaleDateString()}
                        </p>
                        {app.comments && (
                          <p className="text-sm mt-2 p-2 bg-gray-50 rounded">
                            <span className="font-medium">Comments:</span> {app.comments}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Scholarships */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Scholarships</h2>
              {scholarships.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No scholarships available at this time.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarships.map((scholarship) => (
                    <Card key={scholarship.scholarship_id}>
                      <CardHeader>
                        <CardTitle>{scholarship.scholarship_name}</CardTitle>
                        <CardDescription>{scholarship.college_name}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p><span className="font-medium">Amount:</span> ₹{scholarship.amount.toLocaleString()}</p>
                          {scholarship.eligibility_criteria && (
                            <p><span className="font-medium">Eligibility:</span> {scholarship.eligibility_criteria}</p>
                          )}
                          {scholarship.deadline && (
                            <p><span className="font-medium">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}</p>
                          )}
                          {scholarship.description && (
                            <p className="text-sm text-gray-600">{scholarship.description}</p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link to={`/scholarships/${scholarship.scholarship_id}/apply`}>Apply Now</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* College Recommendations */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended Colleges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <Card key={college.college_id}>
              <CardHeader>
                <CardTitle>{college.college_name}</CardTitle>
                <p className="text-gray-600">{college.city}, {college.location_state}</p>
              </CardHeader>
              <CardContent>
                <p><span className="font-medium">Established:</span> {college.established_year}</p>
                <p><span className="font-medium">Accreditation:</span> {college.accreditation}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/colleges/${college.college_id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="link">
            <Link to="/colleges">View All Colleges</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
