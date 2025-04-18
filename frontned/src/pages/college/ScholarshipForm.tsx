import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ScholarshipForm() {
  const navigate = useNavigate()
  const { id, scholarshipId } = useParams<{ id: string, scholarshipId: string }>()
  const collegeId = parseInt(id || '0')
  const isEditing = !!scholarshipId
  
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    collegeId: collegeId,
    name: '',
    description: '',
    eligibilityCriteria: '',
    amount: '',
    applicationProcess: '',
    deadline: ''
  })

  useEffect(() => {
    // Fetch scholarship data if editing
    if (isEditing && scholarshipId) {
      const fetchScholarship = async () => {
        try {
          // In a real implementation, you'd fetch the specific scholarship by ID
          // For now, we'll get all scholarships and find the right one
          const scholarships = await CollegeService.getCollegeScholarships(collegeId)
          const scholarship = scholarships.find(s => s.id === parseInt(scholarshipId))
          
          if (scholarship) {
            // Format the date to YYYY-MM-DD for the input
            const deadlineDate = new Date(scholarship.deadline)
            const formattedDeadline = deadlineDate.toISOString().split('T')[0]
            
            setFormData({
              collegeId,
              name: scholarship.name || '',
              description: scholarship.description || '',
              eligibilityCriteria: scholarship.eligibilityCriteria || '',
              amount: scholarship.amount?.toString() || '',
              applicationProcess: scholarship.applicationProcess || '',
              deadline: formattedDeadline || ''
            })
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load scholarship data')
        } finally {
          setLoading(false)
        }
      }
      fetchScholarship()
    } else {
      setLoading(false)
    }
  }, [collegeId, scholarshipId, isEditing])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
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
        amount: parseInt(formData.amount)
      }

      if (isEditing && scholarshipId) {
        await CollegeService.updateScholarship(parseInt(scholarshipId), dataToSubmit)
      } else {
        await CollegeService.createScholarship(dataToSubmit)
      }
      
      navigate(`/colleges/${collegeId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save scholarship data')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading scholarship data...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Scholarship' : 'Add Scholarship'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Scholarship Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g., Merit Scholarship, Sports Excellence Award"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={handleNumberChange}
                placeholder="Scholarship amount"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed information about the scholarship"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
              <Textarea
                id="eligibilityCriteria"
                name="eligibilityCriteria"
                value={formData.eligibilityCriteria}
                onChange={handleChange}
                placeholder="Who can apply for this scholarship"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="applicationProcess">Application Process</Label>
              <Textarea
                id="applicationProcess"
                name="applicationProcess"
                value={formData.applicationProcess}
                onChange={handleChange}
                placeholder="Steps to apply for this scholarship"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update Scholarship' : 'Add Scholarship')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
