import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AlumniService, { Alumni } from '../../services/alumni.service'
import CollegeService from '../../services/college.service'
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Badge } from '../../components/ui/badge'
import { LinkedinIcon, MoreHorizontal, PlusCircle, Mail } from 'lucide-react'
import { Input } from '../../components/ui/input'

export default function AlumniList() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const collegeId = user?.college_id || parseInt(id || '0')
  
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [college, setCollege] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [alumniToDelete, setAlumniToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const isInstitute = user?.userType === 'institute'
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniData, collegeData] = await Promise.all([
          AlumniService.getCollegeAlumni(collegeId),
          CollegeService.getCollegeById(collegeId)
        ])
        setAlumni(alumniData)
        setCollege(collegeData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load alumni data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collegeId])

  const handleDelete = async () => {
    if (!alumniToDelete) return
    
    setDeleting(true)
    try {
      await AlumniService.deleteAlumni(alumniToDelete)
      // Remove from local state
      setAlumni(prevAlumni => prevAlumni.filter(a => a.alumni_id !== alumniToDelete))
      setShowDeleteDialog(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete alumni')
    } finally {
      setDeleting(false)
      setAlumniToDelete(null)
    }
  }

  const confirmDelete = (alumniId: number) => {
    setAlumniToDelete(alumniId)
    setShowDeleteDialog(true)
  }

  const filteredAlumni = alumni.filter(alumnus => 
    alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (alumnus.current_company && alumnus.current_company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    alumnus.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-4">Loading alumni data...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alumni Network: {college?.college_name}</h1>
          <p className="text-gray-500">Connect with graduates from this college</p>
        </div>
        
        {isInstitute && (
          <Button onClick={() => navigate(`/dashboard/institute/college/${collegeId}/alumni/add`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Alumni
          </Button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <Input
          placeholder="Search alumni by name, company, or degree..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredAlumni.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">
              {searchTerm 
                ? 'No alumni match your search criteria.' 
                : 'No alumni have been added to this college yet.'}
            </p>
            {isInstitute && searchTerm === '' && (
              <Button onClick={() => navigate(`/dashboard/institute/college/${collegeId}/alumni/add`)}>
                Add First Alumni
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Alumni Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Graduation Year</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Current Position</TableHead>
                  <TableHead>Contact</TableHead>
                  {isInstitute && <TableHead className="w-16">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlumni.map(alumnus => (
                  <TableRow key={alumnus.alumni_id}>
                    <TableCell className="font-medium">{alumnus.name}</TableCell>
                    <TableCell>{alumnus.graduation_year}</TableCell>
                    <TableCell>{alumnus.degree}</TableCell>
                    <TableCell>
                      {alumnus.current_company && (
                        <div>
                          <div>{alumnus.current_company}</div>
                          {alumnus.designation && (
                            <div className="text-sm text-gray-500">{alumnus.designation}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {alumnus.linkedin_profile && (
                          <a 
                            href={alumnus.linkedin_profile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <LinkedinIcon size={18} />
                          </a>
                        )}
                        {alumnus.contact_email && (
                          <a 
                            href={`mailto:${alumnus.contact_email}`}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Mail size={18} />
                          </a>
                        )}
                      </div>
                    </TableCell>
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
                              navigate(`/dashboard/institute/college/${collegeId}/alumni/${alumnus.alumni_id}/edit`)
                            }>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => confirmDelete(alumnus.alumni_id)}
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
              Are you sure you want to delete this alumni record? This action cannot be undone.
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
