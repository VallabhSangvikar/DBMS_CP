import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

// Indian states array for dropdown
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
]

// Accreditation grades array for dropdown
const accreditationGrades = [
  "A++", "A+", "A", "B++", "B+", "B", "C", "Not Accredited"
]

export default function CreateEditCollege() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    collegeName: '',
    establishedYear: new Date().getFullYear(),
    accreditation: '',
    locationState: '',
    city: '',
    campusSize: '',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    emailDomain: ''
  })

  useEffect(() => {
    const init = async () => {
      if (isEditing) {
        try {
          const college = await CollegeService.getCollegeById(parseInt(id))
          setFormData({
            collegeName: college.collegeName || '',
            establishedYear: college.establishedYear || new Date().getFullYear(),
            accreditation: college.accreditation || '',
            locationState: college.locationState || '',
            city: college.city || '',
            campusSize: college.campusSize?.toString() || '',
            contactEmail: college.contactEmail || user?.email || '',
            contactPhone: college.contactPhone || '',
            websiteUrl: college.websiteUrl || '',
            emailDomain: college.emailDomain || ''
          })
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load college data')
        }
      } else {
        // Set default email if creating new college
        setFormData(prev => ({
          ...prev,
          contactEmail: user?.email || ''
        }))
      }
      setLoading(false)
    }

    init()
  }, [isEditing, id, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        establishedYear: parseInt(formData.establishedYear.toString()),
        campusSize: parseInt(formData.campusSize)
      }

      if (isEditing) {
        await CollegeService.updateCollege(parseInt(id), dataToSubmit)
      } else {
        await CollegeService.createCollege(dataToSubmit)
      }
      
      navigate('/dashboard/institute')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save college data')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading college data...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit College Profile' : 'Create College Profile'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name</Label>
              <Input
                id="collegeName"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                placeholder="Enter college name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="establishedYear">Year Established</Label>
              <Input
                id="establishedYear"
                name="establishedYear"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                value={formData.establishedYear}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accreditation">Accreditation</Label>
              <Select 
                value={formData.accreditation} 
                onValueChange={(value) => handleSelectChange('accreditation', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accreditation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A++">A++</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B++">B++</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationState">State</Label>
                <Input
                  id="locationState"
                  name="locationState"
                  value={formData.locationState}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campusSize">Campus Size (acres)</Label>
              <Input
                id="campusSize"
                name="campusSize"
                type="number"
                min="0"
                value={formData.campusSize}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://example.edu"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emailDomain">Email Domain</Label>
              <Input
                id="emailDomain"
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                placeholder="example.edu"
                required
              />
              <p className="text-sm text-gray-500">
                Used for verifying students and faculty from your college
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update College' : 'Create College')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
