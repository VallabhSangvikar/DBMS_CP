import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, GraduationCap, Users, BookOpen, Building } from "lucide-react"
import CollegeService from "@/services/college.service"
import CourseService from "@/services/course.service"
import FacultyService, { FacultyInvitation } from "@/services/faculty.service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InstituteDashboard() {
  const { user } = useAuth()
  const [college, setCollege] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [faculty, setFaculty] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const [alumni, setAlumni] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("courses")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [invitation, setInvitation] = useState<FacultyInvitation>({
    email: "",
    department: "",
  })

  useEffect(() => {
    const fetchData = async () => {
        try {
          // Fetch college profile
          const collegeData = await CollegeService.getCollegeProfile()
          if (collegeData) {
            setCollege(collegeData)
            
            // Once we have the college ID, fetch related data in parallel
            const collegeId = collegeData.college_id;
            
            // Use Promise.all to fetch multiple resources in parallel
            const [
              courseData, 
              facultyData, 
              placementData,
              alumniData,
              applicationData
            ] = await Promise.all([
              CollegeService.getCollegeCourses(collegeId),
              CollegeService.getCollegeFaculty(collegeId),
              CollegeService.getCollegePlacements(collegeId),
              CollegeService.getCollegeAlumni(collegeId),
              CourseService.getCourseApplications(collegeId) // This might need to be adjusted based on your API
            ]);
            
            // Update state with fetched data
            setCourses(courseData || []);
            setFaculty(facultyData || []);
            setPlacements(placementData || []);
            setAlumni(alumniData || []);
            setApplications(applicationData || []);
          }
        } 
        catch (err: any) {
          setError(err.response?.data?.message || "Failed to load data")
          console.error(err)
        } finally {
          setLoading(false)
        }
    }

    fetchData()
  }, [])
  console.log(courses, faculty, placements, alumni, applications)
  // Helper function to generate dummy college

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!college) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Welcome, Institute Admin</h2>
              <p className="text-gray-600">Complete your college profile to get started.</p>
              <Link to="/colleges/create">
                <Button className="w-full">Create College Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Institute Dashboard</h1>
        <Link to={`/colleges/edit/${college.college_id}`}>
          <Button>Edit College Profile</Button>
        </Link>
      </div>

      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{college.college_name}</h2>
              <p className="text-gray-600">{college.city}, {college.location_state}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1 opacity-70" />
                  Est. {college.established_year}
                </span>
                <Badge variant="outline" className="font-medium">{college.accreditation}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">{college.contact_email}</p>
              <p className="text-gray-600">{college.contact_phone}</p>
              <a href={college.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                {college.website_url}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{courses.length}</p>
              <h3 className="text-gray-600">Courses Offered</h3>
            </div>
            <BookOpen className="h-10 w-10 text-blue-500 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{applications.length}</p>
              <h3 className="text-gray-600">New Applications</h3>
            </div>
            <Users className="h-10 w-10 text-green-500 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">{faculty.length}</p>
              <h3 className="text-gray-600">Faculty Members</h3>
            </div>
            <GraduationCap className="h-10 w-10 text-purple-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="courses" className="py-2">Courses</TabsTrigger>
          <TabsTrigger value="infrastructure" className="py-2">Infrastructure</TabsTrigger>
          <TabsTrigger value="faculty" className="py-2">Faculty</TabsTrigger>
          <TabsTrigger value="placements" className="py-2">Placements</TabsTrigger>
          <TabsTrigger value="alumni" className="py-2">Alumni</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Offered Courses</h2>
            <Link to={`/colleges/${college.college_id}/courses/create`}>
              <Button>Add Course</Button>
            </Link>
          </div>
          
          {courses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No courses available. Add your first course!</p>
                <Button className="mt-4" asChild>
                  <Link to={`/colleges/${college.college_id}/courses/create`}>Add Course</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.course_id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <h4 className="font-semibold text-lg">{course.course_name}</h4>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-600">Duration: {course.duration} years</p>
                    <p className="text-gray-600">Annual Fee: ₹{course.fee.toLocaleString()}</p>
                    <p className="text-gray-600">Seats: {course.max_seats}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/courses/${course.course_id}/edit`}>Edit</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to={`/courses/${course.course_id}/cutoffs`}>Manage Cutoffs</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="infrastructure" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Infrastructure</h2>
            <Link to={`/colleges/${college.college_id}/infrastructure`}>
              <Button>Update Infrastructure</Button>
            </Link>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 bg-green-50 border-green-100 text-center">
                  <Building className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-medium">Campus Size</h3>
                  <p className="text-lg">{college.campus_size} acres</p>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-100 text-center">
                  <h3 className="font-medium">Hostel Facilities</h3>
                  <p className="mt-1">Available for both boys and girls</p>
                </div>
                <div className="border rounded-lg p-4 bg-purple-50 border-purple-100 text-center">
                  <h3 className="font-medium">Labs & Library</h3>
                  <p className="mt-1">Modern facilities available</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-600">
                  Configure your college infrastructure details like hostels, libraries, labs, and sports facilities.
                </p>
                <Button className="mt-4" asChild variant="outline">
                  <Link to={`/colleges/${college.college_id}/infrastructure`}>Manage Infrastructure Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Faculty</h2>
            <Button onClick={() => setInviteDialogOpen(true)}>Invite Faculty</Button>
          </div>
          
          {faculty.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No faculty members have joined yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faculty.map((member) => (
                <Card key={member.faculty_id}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold">{member.username}</h3>
                    <p className="text-gray-600">{member.department}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><span className="font-medium">Qualification:</span> {member.qualification}</p>
                      <p><span className="font-medium">Experience:</span> {member.experience}</p>
                      <p><span className="font-medium">Email:</span> {member.contact_email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="placements" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Placement Records</h2>
            <Link to={`/colleges/${college.college_id}/placement/create`}>
              <Button>Add Placement Record</Button>
            </Link>
          </div>
          
          {placements.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No placement records available yet.</p>
                <Button className="mt-4" asChild>
                  <Link to={`/colleges/${college.college_id}/placement/create`}>Add Placement Record</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {placements.map((placement) => (
                <Card key={placement.placement_id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">Academic Year: {placement.academic_year}</h3>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/colleges/${college.college_id}/placement/${placement.placement_id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium text-lg">{placement.total_students_placed}</p>
                        <p className="text-gray-600">Students Placed</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium text-lg">{placement.placement_percentage}%</p>
                        <p className="text-gray-600">Placement Rate</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium text-lg">₹{(placement.average_package/100000).toFixed(1)} LPA</p>
                        <p className="text-gray-600">Average Package</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p><span className="font-medium">Highest Package:</span> ₹{(placement.highest_package/100000).toFixed(1)} LPA</p>
                      <p><span className="font-medium">Top Recruiters:</span> {placement.top_recruiters}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alumni" className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Notable Alumni</h2>
            <Link to={`/colleges/${college.college_id}/alumni/create`}>
              <Button>Add Alumni</Button>
            </Link>
          </div>
          
          
          {alumni.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">No alumni records available yet.</p>
                <Button className="mt-4" asChild>
                  <Link to={`/colleges/${college.college_id}/alumni/create`}>Add Alumni Record</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alumni.map((alumnus) => (
                <Card key={alumnus.alumni_id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/colleges/${college.college_id}/alumni/${alumnus.alumni_id}/edit`}>Edit</Link>
                      </Button>
                    </div>
                    <p className="text-gray-600">{alumnus.degree}, {alumnus.graduation_year}</p>
                    <div className="mt-2 space-y-1">
                      <p><span className="font-medium">Current Position:</span> {alumnus.designation} at {alumnus.current_company}</p>
                      <p><span className="font-medium">Achievements:</span> {alumnus.achievements}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">No applications received yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrance Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.application_id}>
                      <td className="px-6 py-4 whitespace-nowrap">{app.student_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.course_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.application_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.entrance_exam} ({app.percentile}%)</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={
                          app.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button size="sm" variant="outline">View Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Faculty</DialogTitle>
            <DialogDescription>
              Enter the email and department of the faculty member you want to invite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={invitation.email}
                onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                id="department"
                value={invitation.department}
                onValueChange={(value) => setInvitation({ ...invitation, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                try {
                  await FacultyService.inviteFaculty(invitation)
                  setInviteDialogOpen(false)
                } catch (error) {
                  console.error("Failed to send invitation", error)
                }
              }}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  )
}
