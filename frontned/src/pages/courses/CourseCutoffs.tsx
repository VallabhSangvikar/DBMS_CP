import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import CourseService, { CourseCutoff } from '../../services/course.service'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../components/ui/dropdown-menu'
import { MoreHorizontal, PlusCircle } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'

export default function CourseCutoffs() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const courseIdNum = parseInt(courseId || '0')
  
  const [cutoffs, setCutoffs] = useState<CourseCutoff[]>([])
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [cutoffToDelete, setCutoffToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const isInstitute = user?.userType === 'institute'
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, cutoffsData] = await Promise.all([
          CourseService.getCourseById(courseIdNum),
          CourseService.getCourseCutoffs(courseIdNum)
        ])
        setCourse(courseData)
        setCutoffs(cutoffsData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load cutoff data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [courseIdNum])

  const handleDelete = async () => {
    if (!cutoffToDelete) return
    
    setDeleting(true)
    try {
      await CourseService.deleteCourseCutoff(cutoffToDelete)
      // Remove from local state
      setCutoffs(prevCutoffs => prevCutoffs.filter(c => c.cutoff_id !== cutoffToDelete))
      setShowDeleteDialog(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete cutoff')
    } finally {
      setDeleting(false)
      setCutoffToDelete(null)
    }
  }

  const confirmDelete = (cutoffId: number) => {
    setCutoffToDelete(cutoffId)
    setShowDeleteDialog(true)
  }

  if (loading) {
    return <div className="p-4">Loading cutoff data...</div>
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
          Course not found
        </div>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Cutoff Details: {course.course_name}</h1>
          <p className="text-gray-500">Manage entrance percentile requirements</p>
        </div>
        
        {isInstitute && (
          <Button onClick={() => navigate(`/dashboard/institute/courses/${courseIdNum}/cutoffs/add`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Cutoff
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
          {error}
        </div>
      )}
      
      {cutoffs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">No cutoff details have been added for this course yet.</p>
            {isInstitute && (
              <Button onClick={() => navigate(`/dashboard/institute/courses/${courseIdNum}/cutoffs/add`)}>
                Add Cutoff Details
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cutoff History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>General</TableHead>
                  <TableHead>OBC</TableHead>
                  <TableHead>SC</TableHead>
                  <TableHead>ST</TableHead>
                  <TableHead>EWS</TableHead>
                  {isInstitute && <TableHead className="w-16">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {cutoffs.map(cutoff => (
                  <TableRow key={cutoff.cutoff_id}>
                    <TableCell>
                      {cutoff.year}
                      {cutoff.year === new Date().getFullYear() && (
                        <Badge variant="outline" className="ml-2">Current</Badge>
                      )}
                    </TableCell>
                    <TableCell>{cutoff.general}%</TableCell>
                    <TableCell>{cutoff.obc}%</TableCell>
                    <TableCell>{cutoff.sc}%</TableCell>
                    <TableCell>{cutoff.st}%</TableCell>
                    <TableCell>{cutoff.ews}%</TableCell>
                    {isInstitute && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => 
                              navigate(`/dashboard/institute/courses/${courseIdNum}/cutoffs/${cutoff.cutoff_id}/edit`)
                            }>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => confirmDelete(cutoff.cutoff_id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this cutoff record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
