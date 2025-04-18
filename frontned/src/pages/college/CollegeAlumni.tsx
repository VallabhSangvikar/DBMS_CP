import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AlumniService, { Alumni } from '../../services/alumni.service'
import CollegeService from '../../services/college.service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { LinkedinIcon, Mail, Building, Award } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

export default function CollegeAlumni() {
  const { id } = useParams()
  const collegeId = parseInt(id || '0')
  
  const [alumni, setAlumni] = useState<Alumni[]>([])
  const [notableAlumni, setNotableAlumni] = useState<Alumni[]>([])
  const [college, setCollege] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('latest')
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alumniData, collegeData, notableAlumniData] = await Promise.all([
          AlumniService.getCollegeAlumni(collegeId),
          CollegeService.getCollegeById(collegeId),
          AlumniService.getNotableAlumni(collegeId)
        ])
        setAlumni(alumniData)
        setCollege(collegeData)
        setNotableAlumni(notableAlumniData)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load alumni data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collegeId])

  const filteredAlumni = alumni.filter(alumnus => 
    alumnus.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (alumnus.current_company && alumnus.current_company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    alumnus.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    switch (sortOption) {
      case 'latest':
        return b.graduation_year - a.graduation_year;
      case 'oldest':
        return a.graduation_year - b.graduation_year;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return <div className="p-4">Loading alumni data...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{college?.college_name} Alumni Network</h1>
      <p className="text-gray-500 mb-6">Connect with graduates from {college?.college_name}</p>
      
      {error && (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
          {error}
        </div>
      )}

      {notableAlumni.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Notable Alumni</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notableAlumni.map(alumnus => (
              <Card key={alumnus.alumni_id} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {alumnus.name}
                    <Award className="ml-2 h-5 w-5 text-yellow-500" />
                  </CardTitle>
                  <CardDescription>
                    Class of {alumnus.graduation_year} • {alumnus.degree}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {alumnus.current_company && (
                    <div className="flex items-start space-x-2">
                      <Building className="h-4 w-4 mt-1 text-gray-500" />
                      <div>
                        <div className="font-medium">{alumnus.current_company}</div>
                        {alumnus.designation && (
                          <div className="text-sm text-gray-500">{alumnus.designation}</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {alumnus.achievements && (
                    <p className="text-sm mt-2">{alumnus.achievements}</p>
                  )}
                  
                  <div className="flex space-x-2 mt-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
        <Input
          placeholder="Search alumni by name, company, or degree..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Recent Graduates</SelectItem>
            <SelectItem value="oldest">Oldest Graduates</SelectItem>
            <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
            <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedAlumni.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p>
              {searchTerm 
                ? 'No alumni match your search criteria.' 
                : 'No alumni records available for this college.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAlumni.map(alumnus => (
            <Card key={alumnus.alumni_id} className="h-full">
              <CardHeader>
                <CardTitle>{alumnus.name}</CardTitle>
                <CardDescription>
                  Class of {alumnus.graduation_year} • {alumnus.degree}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {alumnus.current_company && (
                  <div className="flex items-start space-x-2">
                    <Building className="h-4 w-4 mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium">{alumnus.current_company}</div>
                      {alumnus.designation && (
                        <div className="text-sm text-gray-500">{alumnus.designation}</div>
                      )}
                    </div>
                  </div>
                )}
                
                {alumnus.achievements && (
                  <p className="text-sm mt-2">{alumnus.achievements}</p>
                )}
                
                <div className="flex space-x-2 mt-2">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
