import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import StudentService from '@/services/student.service'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export default function StudentProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { action } = useParams<{ action: string }>()
  const isEditing = action === 'edit'
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    entranceExamName: '',
    entranceExamPercentile: '',
    category: '',
    stream: '',
    passingYear: new Date().getFullYear() + 1,
    cutoffPoints: '',
    interestedCourses: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (isEditing) {
        try {
          const profile = await StudentService.getProfile()
          setFormData({
            entranceExamName: profile.entranceExamName || '',
            entranceExamPercentile: profile.entranceExamPercentile?.toString() || '',
            category: profile.category || '',
            stream: profile.stream || '',
            passingYear: profile.passingYear || new Date().getFullYear() + 1,
            cutoffPoints: profile.cutoffPoints?.toString() || '',
            interestedCourses: profile.interestedCourses || ''
          })
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load profile data')
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [isEditing])

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
        entranceExamPercentile: parseFloat(formData.entranceExamPercentile),
        cutoffPoints: parseInt(formData.cutoffPoints),
        passingYear: parseInt(formData.passingYear.toString())
      }

      if (isEditing) {
        await StudentService.updateProfile(dataToSubmit)
      } else {
        await StudentService.createProfile(dataToSubmit)
      }
      
      navigate('/dashboard/student')
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
          <CardTitle>{isEditing ? 'Edit Profile' : 'Complete Your Profile'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="entranceExamName">Entrance Exam</Label>
              <Select 
                value={formData.entranceExamName} 
                onValueChange={(value) => handleSelectChange('entranceExamName', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select entrance exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE Main">JEE Main</SelectItem>
                  <SelectItem value="JEE Advanced">JEE Advanced</SelectItem>
                  <SelectItem value="NEET">NEET</SelectItem>
                  <SelectItem value="GATE">GATE</SelectItem>
                  <SelectItem value="CAT">CAT</SelectItem>
                  <SelectItem value="MAT">MAT</SelectItem>
                  <SelectItem value="CLAT">CLAT</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="entranceExamPercentile">Percentile Score</Label>
              <Input
                id="entranceExamPercentile"
                name="entranceExamPercentile"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.entranceExamPercentile}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stream">Stream</Label>
              <Select 
                value={formData.stream} 
                onValueChange={(value) => handleSelectChange('stream', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passingYear">Expected Passing Year</Label>
              <Input
                id="passingYear"
                name="passingYear"
                type="number"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 10}
                value={formData.passingYear}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cutoffPoints">Cutoff Points</Label>
              <Input
                id="cutoffPoints"
                name="cutoffPoints"
                type="number"
                min="0"
                max="100"
                value={formData.cutoffPoints}
                onChange={handleNumberChange}
                required
              />
              <p className="text-sm text-gray-500">Minimum points you're aiming for in college admissions</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interestedCourses">Interested Courses</Label>
              <Textarea
                id="interestedCourses"
                name="interestedCourses"
                value={formData.interestedCourses}
                onChange={handleChange}
                placeholder="E.g., Computer Science, Data Science, Civil Engineering"
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
