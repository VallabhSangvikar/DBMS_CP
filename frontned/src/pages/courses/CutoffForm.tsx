import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CourseService from '@/services/course.service'
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Plus, Trash2 } from 'lucide-react'

export default function CutoffForm() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [course, setCourse] = useState<any>(null)
  
  const currentYear = new Date().getFullYear()
  
  const [cutoffs, setCutoffs] = useState<any[]>([
    { year: currentYear, general: '', sc: '', st: '', obc: '', ews: '' }
  ])

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {
        setError('Invalid course ID')
        setLoading(false)
        return
      }

      try {
        // Get course info
        const courseData = await CourseService.getCourseById(parseInt(courseId))
        setCourse(courseData)
        
        // Get existing cutoffs
        const cutoffsData = await CourseService.getCourseCutoffs(parseInt(courseId))
        
        if (cutoffsData && cutoffsData.length > 0) {
          // Format existing cutoffs
          const formattedCutoffs = cutoffsData.map((cutoff: any) => ({
            cutoff_id: cutoff.cutoff_id,
            year: cutoff.year,
            general: cutoff.general?.toString() || '',
            sc: cutoff.sc?.toString() || '',
            st: cutoff.st?.toString() || '',
            obc: cutoff.obc?.toString() || '',
            ews: cutoff.ews?.toString() || ''
          }))
          
          setCutoffs(formattedCutoffs)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseId])

  const handleCutoffChange = (index: number, field: string, value: string) => {
    const updatedCutoffs = [...cutoffs]
    // @ts-ignore - dynamic field assignment
    updatedCutoffs[index][field] = value
    setCutoffs(updatedCutoffs)
  }

  const addCutoff = () => {
    // Find the latest year in the existing cutoffs
    const years = cutoffs.map(c => c.year)
    const maxYear = Math.max(...years)
    
    // Add a new cutoff for the next year
    setCutoffs([
      ...cutoffs,
      { year: maxYear + 1, general: '', sc: '', st: '', obc: '', ews: '' }
    ])
  }

  const removeCutoff = (index: number) => {
    if (cutoffs.length <= 1) {
      return // Keep at least one cutoff
    }
    
    const updatedCutoffs = [...cutoffs]
    updatedCutoffs.splice(index, 1)
    setCutoffs(updatedCutoffs)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      // Format data for submission
      const cutoffsData = cutoffs.map(cutoff => ({
        ...cutoff,
        course_id: parseInt(courseId || '0'),
        year: parseInt(cutoff.year?.toString() || currentYear.toString()),
        general: parseFloat(cutoff.general || '0'),
        sc: parseFloat(cutoff.sc || '0'),
        st: parseFloat(cutoff.st || '0'),
        obc: parseFloat(cutoff.obc || '0'),
        ews: parseFloat(cutoff.ews || '0'),
      }))
      
      await CourseService.updateCourseCutoffs(parseInt(courseId || '0'), cutoffsData)
      navigate(`/courses/${courseId}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save cutoff information')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Loading course data...</div>
  }

  if (!course) {
    return <div className="p-6 text-center text-red-600">Course not found</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manage Cutoffs</CardTitle>
          <p className="text-gray-600">{course.course_name}</p>
          <p className="text-gray-600">{course.college_name}</p>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 p-3 rounded-md border border-red-200 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <span className="text-red-600">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {cutoffs.map((cutoff, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Year {cutoff.year}</h3>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeCutoff(index)}
                      disabled={cutoffs.length <= 1} // Cannot remove if only one cutoff
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`year-${index}`}>Year</Label>
                      <Input
                        id={`year-${index}`}
                        type="number"
                        min="2000"
                        max={currentYear + 1}
                        value={cutoff.year}
                        onChange={(e) => handleCutoffChange(index, 'year', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`general-${index}`}>General</Label>
                      <Input
                        id={`general-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Percentile"
                        value={cutoff.general}
                        onChange={(e) => handleCutoffChange(index, 'general', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`sc-${index}`}>SC</Label>
                      <Input
                        id={`sc-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Percentile"
                        value={cutoff.sc}
                        onChange={(e) => handleCutoffChange(index, 'sc', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`st-${index}`}>ST</Label>
                      <Input
                        id={`st-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Percentile"
                        value={cutoff.st}
                        onChange={(e) => handleCutoffChange(index, 'st', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`obc-${index}`}>OBC</Label>
                      <Input
                        id={`obc-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Percentile"
                        value={cutoff.obc}
                        onChange={(e) => handleCutoffChange(index, 'obc', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor={`ews-${index}`}>EWS</Label>
                      <Input
                        id={`ews-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Percentile"
                        value={cutoff.ews}
                        onChange={(e) => handleCutoffChange(index, 'ews', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addCutoff}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            </div>
            
            <CardFooter className="flex justify-between px-0 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Cutoffs'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
