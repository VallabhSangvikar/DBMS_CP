import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CourseService from '@/services/course.service'
import CollegeService from '@/services/college.service'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
      alert('Application submitted successfully!')
    } catch (err: any) {
      setApplicationError(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading course details...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  if (!course) {
    return <div className="p-6 text-center">Course not found</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{course.course_name}</CardTitle>
            <p className="text-gray-600">{college?.college_name}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Duration</p>
                <p>{course.duration} years</p>
              </div>
              <div>
                <p className="font-medium">Fee</p>
                <p>₹{course.fee?.toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Course Description</h3>
              <p className="text-gray-600">
                {course.description || `${course.course_name} offers a comprehensive curriculum designed to equip students with the necessary skills and knowledge required in today's competitive industry. The program combines theoretical learning with practical applications.`}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Eligibility</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Minimum 10+2 with Mathematics and Physics</li>
                <li>Entrance examination qualification (JEE/State Level)</li>
                <li>Meet the cutoff criteria for your category</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Application/Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="space-y-4">
                <p>Sign in to apply for this course.</p>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/login', { state: { from: `/courses/${courseId}` } })}
                >
                  Login to Apply
                </Button>
              </div>
            ) : user.userType !== 'student' ? (
              <p>Only students can apply for courses.</p>
            ) : applied ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-green-800 font-medium">You have already applied for this course.</p>
                </div>
                <Button className="w-full" variant="outline" onClick={() => navigate('/dashboard/student')}>
                  View Your Applications
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Apply now for the upcoming academic session.</p>
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {course.course_name}</DialogTitle>
                      <DialogDescription>
                        Please complete the application form below.
                      </DialogDescription>
                    </DialogHeader>
                    
                    {applicationError && (
                      <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600">
                        {applicationError}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="faculty">Select Faculty</Label>
                        <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                          <SelectTrigger>
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
                      <Button onClick={handleApply} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* College Information */}
      <Card>
        <CardHeader>
          <CardTitle>College Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">{college?.college_name}</h3>
              <p className="text-gray-600">{college?.city}, {college?.location_state}</p>
              <p className="text-gray-600">Established: {college?.established_year}</p>
              <p className="text-gray-600">Accreditation: {college?.accreditation}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-gray-600">Email: {college?.contact_email}</p>
              <p className="text-gray-600">Phone: {college?.contact_phone}</p>
              <a 
                href={college?.website_url}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to={`/colleges/${college?.college_id}`}>View College Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cutoffs Information */}
      <Card>
        <CardHeader>
          <CardTitle>Cutoff Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {cutoffs.length === 0 ? (
            <p className="text-gray-600">No cutoff information available for this course.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Year</th>
                    <th className="py-2 px-4 text-left">General</th>
                    <th className="py-2 px-4 text-left">SC</th>
                    <th className="py-2 px-4 text-left">ST</th>
                    <th className="py-2 px-4 text-left">OBC</th>
                    <th className="py-2 px-4 text-left">EWS</th>
                  </tr>
                </thead>
                <tbody>
                  {cutoffs.map((cutoff,index )=> (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{cutoff.year || '-'}</td>
                      <td className="py-2 px-4">{cutoff.general || '-'}%</td>
                      <td className="py-2 px-4">{cutoff.sc || '-'}%</td>
                      <td className="py-2 px-4">{cutoff.st || '-'}%</td>
                      <td className="py-2 px-4">{cutoff.obc || '-'}%</td>
                      <td className="py-2 px-4">{cutoff.ews || '-'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Similar Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">You might also be interested in these related courses:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold">B.Tech Information Technology</h3>
                <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                <Button asChild variant="outline" className="w-full mt-3" size="sm">
                  <Link to={`/courses/2`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold">B.Tech AI & Data Science</h3>
                <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                <Button asChild variant="outline" className="w-full mt-3" size="sm">
                  <Link to={`/courses/3`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold">M.Tech Computer Science</h3>
                <p className="text-sm text-gray-600 mt-1">Example Engineering College</p>
                <Button asChild variant="outline" className="w-full mt-3" size="sm">
                  <Link to={`/courses/4`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
