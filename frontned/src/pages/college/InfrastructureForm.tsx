import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CollegeService from '@/services/college.service'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function InfrastructureForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const collegeId = parseInt(id || '0')
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    collegeId: collegeId,
    hostel: false,
    library: false,
    lab: false,
    sports: false,
    digitalLearningResources: false
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchInfrastructure = async () => {
      try {
        if (collegeId) {
          const infrastructure = await CollegeService.getCollegeInfrastructure(collegeId)
          if (infrastructure) {
            setFormData({
              collegeId,
              hostel: infrastructure.hostel,
              library: infrastructure.library,
              lab: infrastructure.lab,
              sports: infrastructure.sports,
              digitalLearningResources: infrastructure.digitalLearningResources
            })
            setIsEditing(true)
          }
        }
      } catch (err) {
        console.error('Infrastructure not found, will create new', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInfrastructure()
  }, [collegeId])

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (isEditing) {
        await CollegeService.updateInfrastructure(formData)
      } else {
        await CollegeService.createInfrastructure(formData)
      }
      
      navigate(`/colleges/${collegeId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save infrastructure data')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading infrastructure data...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Update Infrastructure' : 'Add Infrastructure Details'}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hostel" className="text-base">Hostel Facilities</Label>
                <Switch 
                  id="hostel" 
                  checked={formData.hostel}
                  onCheckedChange={(checked) => handleSwitchChange('hostel', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="library" className="text-base">Library</Label>
                <Switch 
                  id="library" 
                  checked={formData.library}
                  onCheckedChange={(checked) => handleSwitchChange('library', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="lab" className="text-base">Labs & Equipment</Label>
                <Switch 
                  id="lab" 
                  checked={formData.lab}
                  onCheckedChange={(checked) => handleSwitchChange('lab', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sports" className="text-base">Sports Facilities</Label>
                <Switch 
                  id="sports" 
                  checked={formData.sports}
                  onCheckedChange={(checked) => handleSwitchChange('sports', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="digitalLearningResources" className="text-base">Digital Learning Resources</Label>
                <Switch 
                  id="digitalLearningResources" 
                  checked={formData.digitalLearningResources}
                  onCheckedChange={(checked) => handleSwitchChange('digitalLearningResources', checked)}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Saving...' : (isEditing ? 'Update Infrastructure' : 'Add Infrastructure')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
