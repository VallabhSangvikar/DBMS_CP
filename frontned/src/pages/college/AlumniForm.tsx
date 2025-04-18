import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CollegeService from '@/services/college.service'
import AlumniService from '@/services/alumni.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle } from 'lucide-react'

export default function AlumniForm() {
  const { id, alumniId } = useParams<{ id: string; alumniId: string }>()
  const collegeId = parseInt(id || '0')
  const isEditing = !!alumniId
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [college, setCollege] = useState<any>(null)
  
  const currentYear = new Date().getFullYear()
  
  const [formData, setFormData] = useState({
    name: '',
    graduation_year: currentYear.toString(),
    degree: '',
    current_company: '',
    designation: '',
    achievements: '',
    linkedin_profile: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!collegeId) {
        setError('Invalid college ID')
        setLoading(false)
        return
      }

      try {
        // Get college info
        const collegeData = await CollegeService.getCollegeById(collegeId)
        setCollege(collegeData)
        
        // If editing, fetch alumni data
        if (isEditing && alumniId) {
          const alumniData = await AlumniService.getNotableAlumni(collegeId)
          const alumni = alumniData.find(
            (a: any) => a.alumni_id === parseInt(alumniId)
          )
          
          if (alumni) {
            setFormData({
              name: alumni.name || '',
              graduation_year: alumni.graduation_year?.toString() || currentYear.toString(),
              degree: alumni.degree || '',
              current_company: alumni.current_company || '',
              designation: alumni.designation || '',
              achievements: alumni.achievements || '',
              linkedin_profile: alumni.linkedin_profile || ''
            })
          } else {
            setError('Alumni record not found')
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collegeId, alumniId, isEditing, currentYear])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const dataToSubmit = {
        ...formData,
        college_id: collegeId,
        graduation_year: parseInt(formData.graduation_year)
      }

      if (isEditing && alumniId) {
        await AlumniService.updateAlumni(collegeId, parseInt(alumniId), dataToSubmit)
      } else {
        await AlumniService.createAlumni(collegeId, dataToSubmit)
      }
      
      navigate(`/colleges/${collegeId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save alumni information')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading data...</div>
  }

  if (!college) {
    return <div className="p-6 text-center text-red-600">College not found</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? 'Edit Alumni Profile' : 'Add Notable Alumni'}
          </CardTitle>
          <p className="text-gray-600">{college.college_name}</p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <span className="text-red-600">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="graduation_year">Graduation Year *</Label>
                <Input
                  id="graduation_year"
                  name="graduation_year"
                  type="number"
                  min="1900"
                  max={currentYear}
                  value={formData.graduation_year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="degree">Degree/Program *</Label>
              <Input
                id="degree"
                name="degree"
                placeholder="e.g., B.Tech Computer Science"
                value={formData.degree}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="current_company">Current Company</Label>
                <Input
                  id="current_company"
                  name="current_company"
                  value={formData.current_company}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievements">Notable Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                placeholder="Describe significant achievements, awards, or contributions"
                value={formData.achievements}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin_profile">LinkedIn Profile URL</Label>
              <Input
                id="linkedin_profile"
                name="linkedin_profile"
                type="url"
                placeholder="https://www.linkedin.com/in/username"
                value={formData.linkedin_profile}
                onChange={handleChange}
              />
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/colleges/${collegeId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting 
                  ? (isEditing ? 'Updating...' : 'Adding...') 
                  : (isEditing ? 'Update Alumni' : 'Add Alumni')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
