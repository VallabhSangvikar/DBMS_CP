import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PlacementForm() {
  const navigate = useNavigate()
  const { id, placementId } = useParams<{ id: string, placementId: string }>()
  const collegeId = parseInt(id || '0')
  const isEditing = !!placementId
  
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    college_id: collegeId,
    year: new Date().getFullYear(),
    company_name: '',
    students_placed: '',
    average_salary: '',
    highest_salary: '',
    sector: ''
  })

  useEffect(() => {
    // Fetch placement data if editing
    if (isEditing && placementId) {
      const fetchPlacement = async () => {
        try {
          const placements = await CollegeService.getCollegePlacements(collegeId)
          const placement = placements.find(p => p.placement_id === parseInt(placementId))
          
          if (placement) {
            setFormData({
              college_id: collegeId,
              year: placement.year || new Date().getFullYear(),
              company_name: placement.company_name || '',
              students_placed: placement.students_placed?.toString() || '',
              average_salary: placement.average_salary?.toString() || '',
              highest_salary: placement.highest_salary?.toString() || '',
              sector: placement.sector || '',
            })
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load placement data')
        } finally {
          setLoading(false)
        }
      }
      fetchPlacement()
    } else {
      setLoading(false)
    }
  }, [collegeId, placementId, isEditing])

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
        year: parseInt(formData.year.toString()),
        students_placed: parseInt(formData.students_placed),
        average_salary: parseInt(formData.average_salary),
        highest_salary: parseInt(formData.highest_salary)
      }

      if (isEditing && placementId) {
        await CollegeService.updatePlacement(parseInt(placementId), dataToSubmit)
      } else {
        await CollegeService.createPlacement(dataToSubmit)
      }
      
      navigate(`/colleges/${collegeId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save placement data')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading placement data...</div>
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Placement Record' : 'Add Placement Record'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="year">Placement Year</Label>
              <Select 
                value={formData.year.toString()} 
                onValueChange={(value) => handleSelectChange('year', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="E.g., Google, Microsoft, TCS"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Industry Sector</Label>
              <Select 
                value={formData.sector} 
                onValueChange={(value) => handleSelectChange('sector', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">IT & Software</SelectItem>
                  <SelectItem value="Finance">Finance & Banking</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Consulting">Consulting</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="students_placed">Number of Students Placed</Label>
              <Input
                id="students_placed"
                name="students_placed"
                type="number"
                min="0"
                value={formData.students_placed}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="average_salary">Average Salary (₹/year)</Label>
              <Input
                id="average_salary"
                name="average_salary"
                type="number"
                min="0"
                value={formData.average_salary}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="highest_salary">Highest Salary (₹/year)</Label>
              <Input
                id="highest_salary"
                name="highest_salary"
                type="number"
                min="0"
                value={formData.highest_salary}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update Placement Record' : 'Add Placement Record')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
