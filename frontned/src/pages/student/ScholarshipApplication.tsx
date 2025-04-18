import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import StudentService from '@/services/student.service'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ScholarshipApplication() {
  const navigate = useNavigate()
  const { scholarshipId } = useParams<{ scholarshipId: string }>()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [scholarship, setScholarship] = useState<any>(null)
  const [formData, setFormData] = useState({
    statement: '',
    achievements: '',
    financialNeed: '',
    documents: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!scholarshipId) {
        setError('Invalid scholarship ID')
        setLoading(false)
        return
      }

      try {
        // Fetch scholarship details
        const scholarships = await StudentService.getScholarships()
        const selectedScholarship = scholarships.find(s => s.scholarship_id === parseInt(scholarshipId))
        
        if (!selectedScholarship) {
          setError('Scholarship not found')
        } else {
          setScholarship(selectedScholarship)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load scholarship data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [scholarshipId])

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
      await StudentService.applyForScholarship(parseInt(scholarshipId!), {
        ...formData,
        scholarshipId: parseInt(scholarshipId!)
      })
      
      navigate('/dashboard/student')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading scholarship data...</div>
  }

  if (error && !scholarship) {
    return <div className="p-6 text-center text-red-600">{error}</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Scholarship Application</CardTitle>
          {scholarship && (
            <CardDescription>{scholarship.scholarship_name} - {scholarship.college_name}</CardDescription>
          )}
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}

          {scholarship && (
            <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Scholarship Details</h3>
              <p><span className="font-medium">Amount:</span> ₹{scholarship.amount.toLocaleString()}</p>
              {scholarship.eligibility_criteria && (
                <p><span className="font-medium">Eligibility:</span> {scholarship.eligibility_criteria}</p>
              )}
              {scholarship.deadline && (
                <p><span className="font-medium">Deadline:</span> {new Date(scholarship.deadline).toLocaleDateString()}</p>
              )}
              {scholarship.description && (
                <p className="mt-2 text-sm">{scholarship.description}</p>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="statement">Personal Statement</Label>
              <Textarea
                id="statement"
                name="statement"
                value={formData.statement}
                onChange={handleChange}
                placeholder="Tell us why you are applying for this scholarship and how it will help your education..."
                rows={5}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="achievements">Academic Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="List your key academic achievements, awards, and extracurricular activities..."
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="financialNeed">Financial Need Statement</Label>
              <Textarea
                id="financialNeed"
                name="financialNeed"
                value={formData.financialNeed}
                onChange={handleChange}
                placeholder="Explain your financial situation and why you need this scholarship..."
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documents">Supporting Documents</Label>
              <Input
                id="documents"
                name="documents"
                value={formData.documents}
                onChange={handleChange}
                placeholder="Please list any supporting documents (you can submit these later if required)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: You may be asked to provide physical copies or upload documents later in the process.
              </p>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/student')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}