import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import FacultyService from '@/services/faculty.service'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function FacultyProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { action } = useParams<{ action: string }>()
  const isEditing = action === 'edit'
  
  const [colleges, setColleges] = useState<{ id: number, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    college_id: '',
    department: '',
    qualification: '',
    research_area: '',
    contact_email: '',
    publications: '',
    experience: ''
  })

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch all colleges for dropdown
        const collegesData = await CollegeService.getAllColleges()
        setColleges(collegesData.map(college => ({ 
          id: college.college_id, 
          name: college.college_name 
        })))
        
        // If editing, fetch faculty profile
        if (isEditing) {
          const profile = await FacultyService.getProfile()
          setFormData({
            college_id: profile.college_id?.toString() || '',
            department: profile.department || '',
            qualification: profile.qualification || '',
            research_area: profile.research_area || '',
            contact_email: profile.contact_email || user?.email || '',
            publications: profile.publications || '',
            experience: profile.experience?.toString() || ''
          })
        } else {
          // Set default email if creating new profile
          setFormData(prev => ({
            ...prev,
            contact_email: user?.email || ''
          }))
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [isEditing, user])

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
      const dataToSubmit = {
        ...formData,
        college_id: parseInt(formData.college_id),
        experience: parseInt(formData.experience)
      }

      if (isEditing) {
        await FacultyService.updateProfile(dataToSubmit)
      } else {
        await FacultyService.createProfile(dataToSubmit)
      }
      
      navigate('/dashboard/faculty')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading profile data...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Faculty Profile' : 'Complete Your Faculty Profile'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="college_id">College</Label>
              <Select 
                value={formData.college_id} 
                onValueChange={(value) => handleSelectChange('college_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your college" />
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
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="E.g., Computer Science, Physics, Mathematics"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="E.g., PhD in Computer Science"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="research_area">Research Areas</Label>
              <Textarea
                id="research_area"
                name="research_area"
                value={formData.research_area}
                onChange={handleChange}
                placeholder="E.g., Machine Learning, Database Systems, Cryptography"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publications">Publications</Label>
              <Textarea
                id="publications"
                name="publications"
                value={formData.publications}
                onChange={handleChange}
                placeholder="List your key publications or publication count"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                max="50"
                value={formData.experience}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update Profile' : 'Complete Profile')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
