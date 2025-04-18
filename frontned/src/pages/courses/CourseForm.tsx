import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CourseService from '@/services/course.service'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function CourseForm() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id, collegeId: urlCollegeId } = useParams<{ id: string, collegeId: string }>()
  const isEditing = !!id
  
  const [colleges, setColleges] = useState<{ id: number, name: string }[]>([])
  const [instituteCollege, setInstituteCollege] = useState<{ id: number, name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    college_id: '',
    course_name: '',
    duration: '4',
    fee: '',
    eligibility: '',
    description: ''
  })

  useEffect(() => {
    const init = async () => {
      try {
        // If institute user, first get their college
        if (user?.userType === 'institute') {
          try {
            const collegeProfile = await CollegeService.getCollegeProfile()
            if (collegeProfile) {
              setInstituteCollege({
                id: collegeProfile.college_id,
                name: collegeProfile.college_name
              })
              
              // Pre-select institute's college in the form
              setFormData(prev => ({
                ...prev,
                college_id: collegeProfile.college_id.toString()
              }))
            }
          } catch (err) {
            console.error('Failed to load institute college:', err)
          }
        } else {
          // For non-institute users, fetch all colleges for dropdown
          const collegesData = await CollegeService.getAllColleges()
          setColleges(collegesData.map(college => ({ id: college.college_id, name: college.college_name })))
        }
        
        // If editing existing course
        if (isEditing && id) {
          const course = await CourseService.getCourseById(parseInt(id))
          setFormData({
            college_id: course.college_id?.toString() || '',
            course_name: course.course_name || '',
            duration: course.duration?.toString() || '4',
            fee: course.fee?.toString() || '',
            eligibility: course.eligibility || '',
            description: course.description || ''
          })
        }
        // If creating course from institute dashboard with collegeId in URL
        else if (!isEditing && urlCollegeId) {
          setFormData(prev => ({
            ...prev,
            college_id: urlCollegeId
          }))
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [isEditing, id, urlCollegeId, user?.userType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value === '' || !isNaN(Number(value))) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // For institute users, always use their own college ID
    
      
      const dataToSubmit = {
        ...formData,
        duration: parseInt(formData.duration),
        fee: parseInt(formData.fee),
      }

      if (isEditing) {
        await CourseService.updateCourse(parseInt(id!), dataToSubmit)
        // Navigate back to proper page
        if (user?.userType === 'institute') {
          navigate('/dashboard/institute')
        } else {
          navigate('/courses')
        }
      } else {
        await CourseService.createCourse(dataToSubmit)
        // Navigate back to proper page
        if (user?.userType === 'institute') {
          navigate('/dashboard/institute')
        } else {
          navigate('/courses')
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save course data')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading course data...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {user?.userType !== 'institute' && (
              <div className="space-y-2">
                <Label htmlFor="college_id">College</Label>
                <Select 
                  value={formData.college_id} 
                  onValueChange={(value) => handleSelectChange('college_id', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map(college => (
                      <SelectItem key={college.id} value={college.id.toString()}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="course_name">Course Name</Label>
              <Input
                id="course_name"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="E.g., B.Tech Computer Science, MBA Finance"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Years)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.duration}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fee">Fee (₹/year)</Label>
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={handleNumberChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                placeholder="E.g., Minimum 60% in 12th grade, JEE score above 150"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about the course curriculum, career opportunities, etc."
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
