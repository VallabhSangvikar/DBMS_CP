import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CollegeService from "@/services/college.service"
import CourseService from "@/services/course.service"
import AlumniService from '@/services/alumni.service';

export default function CollegeDetail() {
  const { id } = useParams<{ id: string }>()
  const collegeId = parseInt(id || "0")
  
  const [college, setCollege] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [infrastructure, setInfrastructure] = useState<any>(null)
  const [faculty, setFaculty] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])
  const [notableAlumni, setNotableAlumni] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!collegeId) {
        setError("Invalid college ID")
        setLoading(false)
        return
      } 
        // Try to fetch real data
        try {
          const collegeData = await CollegeService.getCollegeById(collegeId)
          if (collegeData) {
            setCollege(collegeData)
            
            // Fetch related data
            const coursesData = await CollegeService.getCollegeCourses(collegeId)
            if (coursesData && coursesData.length > 0) {
              setCourses(coursesData)
            }
            
            const infraData = await CollegeService.getCollegeInfrastructure(collegeId)
            if (infraData) {
              setInfrastructure(infraData)
            }
            
            const facultyData = await CollegeService.getCollegeFaculty(collegeId)
            if (facultyData && facultyData.length > 0) {
              setFaculty(facultyData)
            }
            
            const placementsData = await CollegeService.getCollegePlacements(collegeId)
            if (placementsData && placementsData.length > 0) {
              setPlacements(placementsData)
            }
            
            const notableAlumniData = await AlumniService.getNotableAlumni(collegeId)
            if (notableAlumniData && notableAlumniData.length > 0) {
              setNotableAlumni(notableAlumniData)
            }
            
            // Fetch scholarship data
            const scholarshipsData = await CollegeService.getCollegeScholarships(collegeId)
            if (scholarshipsData && scholarshipsData.length > 0) {
              setScholarships(scholarshipsData)
            }
          }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load college data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collegeId])


  if (loading) {
    return <div className="p-6 text-center">Loading college details...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!college) {
    return <div className="p-6 text-center">College not found</div>
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{college.college_name}</h1>
            <p className="text-gray-600">{college.city}, {college.location_state}</p>
            <p className="text-gray-600">Established: {college.established_year}</p>
            <p className="text-gray-600">Accreditation: {college.accreditation}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">{college.contact_email}</p>
            <p className="text-gray-600">{college.contact_phone}</p>
            <a href={college.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Visit Website
            </a>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
          
          {courses.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No courses available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course.course_id}>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{course.course_name}</h3>
                  </CardHeader>
                  <CardContent>
                    <p>Duration: {course.duration} years</p>
                    <p>Fee: ₹{course.fee.toLocaleString()}</p>
                    <Link to={`/courses/${course.course_id}`}>
                      <Button variant="outline" className="w-full mt-4">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="infrastructure">
          <h2 className="text-xl font-semibold mb-4">Infrastructure</h2>
          
          {!infrastructure ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Infrastructure details not available.</p>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className={`p-4 rounded-lg border text-center ${infrastructure.hostel ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-medium">Hostel</p>
                    <p>{infrastructure.hostel ? 'Available' : 'Not Available'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border text-center ${infrastructure.library ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-medium">Library</p>
                    <p>{infrastructure.library ? 'Available' : 'Not Available'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border text-center ${infrastructure.lab ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-medium">Labs</p>
                    <p>{infrastructure.lab ? 'Available' : 'Not Available'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border text-center ${infrastructure.sports ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-medium">Sports</p>
                    <p>{infrastructure.sports ? 'Available' : 'Not Available'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border text-center ${infrastructure.digital_learning_resources ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="font-medium">Digital Learning</p>
                    <p>{infrastructure.digital_learning_resources ? 'Available' : 'Not Available'}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">Campus Size:</p>
                  <p>{college.campus_size} acres</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="faculty">
          <h2 className="text-xl font-semibold mb-4">Faculty</h2>
          
          {faculty.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No faculty information available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faculty.map((member) => (
                <Card key={member.faculty_id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">{member.username}</h3>
                    <p className="text-gray-600">{member.department}</p>
                    <div className="mt-2 space-y-1">
                      <p><span className="font-medium">Qualification:</span> {member.qualification}</p>
                      {member.research_area && (
                        <p><span className="font-medium">Research Area:</span> {member.research_area}</p>
                      )}
                      {member.experience && (
                        <p><span className="font-medium">Experience:</span> {member.experience} years</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="placements">
          <h2 className="text-xl font-semibold mb-4">Placement Statistics</h2>
          
          {placements.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No placement information available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {placements.map((placement) => (
                <Card key={placement.placement_id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">Academic Year: {placement.academic_year}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium">{placement.total_students_placed}</p>
                        <p className="text-gray-600">Students Placed</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium">{placement.placement_percentage}%</p>
                        <p className="text-gray-600">Placement Rate</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="font-medium">₹{placement.average_package?.toLocaleString() || 'N/A'}</p>
                        <p className="text-gray-600">Average Package</p>
                      </div>
                    </div>
                    {placement.highest_package && (
                      <p className="mt-4"><span className="font-medium">Highest Package:</span> ₹{placement.highest_package.toLocaleString()}</p>
                    )}
                    {placement.top_recruiters && (
                      <p className="mt-2"><span className="font-medium">Top Recruiters:</span> {placement.top_recruiters}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scholarships">
          <h2 className="text-xl font-semibold mb-4">Available Scholarships</h2>
          
          {scholarships.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No scholarships information available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.scholarship_id}>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{scholarship.scholarship_name}</h3>
                    {scholarship.deadline && (
                      <Badge variant="outline" className="mt-1">
                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-green-700">₹{scholarship.amount?.toLocaleString()}</p>
                      
                      {scholarship.description && (
                        <p className="text-gray-700">{scholarship.description}</p>
                      )}
                      
                      
                        <div className="mt-2">
                          <p className="font-semibold">Eligibility Criteria:</p>
                          <p className="text-gray-700">{scholarship.eligibility_criteria || 'This will be discussed while admission'}</p>
                        </div>
                    
                      
                      {scholarship.application_process && (
                        <div className="mt-2">
                          <p className="font-semibold">How to Apply:</p>
                          <p className="text-gray-700">{scholarship.application_process}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* For students who are logged in, show apply button */}
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" className="w-full">
                        <Link to={`/scholarships/${scholarship.scholarship_id}/apply`}>
                          Apply Now
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alumni">
          <h2 className="text-xl font-semibold mb-4">Notable Alumni</h2>
          
          {notableAlumni.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No alumni information available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {notableAlumni.map(alumnus => (
                <Card key={alumnus.alumni_id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                    <p className="text-gray-600">{alumnus.degree}, {alumnus.graduation_year}</p>
                    
                    {(alumnus.current_company || alumnus.designation) && (
                      <div className="mt-2">
                        <p>
                          <span className="font-medium">Currently:</span> {alumnus.designation} at {alumnus.current_company}
                        </p>
                      </div>
                    )}
                    
                    {alumnus.achievements && (
                      <p className="mt-2"><span className="font-medium">Achievements:</span> {alumnus.achievements}</p>
                    )}
                    
                    {alumnus.linkedin_profile && (
                      <p className="mt-2">
                        <a 
                          href={alumnus.linkedin_profile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
