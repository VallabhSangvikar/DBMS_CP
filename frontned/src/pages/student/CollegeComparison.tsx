import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import CollegeService from '@/services/college.service'
import { Building } from 'lucide-react'

export default function CollegeComparison() {
  const [colleges, setColleges] = useState<any[]>([])
  const [collegeId1, setCollegeId1] = useState<string>('')
  const [collegeId2, setCollegeId2] = useState<string>('')
  const [college1, setCollege1] = useState<any>(null)
  const [college2, setCollege2] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comparing, setComparing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchColleges = async () => {
 
  
        setLoading(true);
        
        // Try to get real data
        try {
          const data = await CollegeService.getAllColleges();
          if (data && data.length > 0) {
            setColleges(data);
          } 
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load colleges');
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  const handleCompare = async () => {
    if (!collegeId1 || !collegeId2) {
      setError('Please select two colleges to compare');
      return;
    }
    
    setComparing(true);
    setError('');
    
    try {
      const id1 = parseInt(collegeId1);
      const id2 = parseInt(collegeId2);
      
      // Find the colleges in our list
      const foundCollege1 = colleges.find(c => c.college_id === id1);
      const foundCollege2 = colleges.find(c => c.college_id === id2);
      
      if (foundCollege1 && foundCollege2) {
        setCollege1(foundCollege1);
        setCollege2(foundCollege2);
      } else {
        // This should never happen if our select dropdowns are built from the same list
        setError('Could not find college data for comparison');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to compare colleges');
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading colleges...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <h1 className="text-3xl font-bold">Compare Colleges</h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium">First College</label>
              <Select value={collegeId1} onValueChange={setCollegeId1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem 
                      key={college.college_id} 
                      value={college.college_id.toString()}
                      disabled={college.college_id.toString() === collegeId2}
                    >
                      {college.college_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="font-medium">Second College</label>
              <Select value={collegeId2} onValueChange={setCollegeId2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(college => (
                    <SelectItem 
                      key={college.college_id} 
                      value={college.college_id.toString()}
                      disabled={college.college_id.toString() === collegeId1}
                    >
                      {college.college_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mt-4">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleCompare} 
            className="w-full mt-6" 
            disabled={!collegeId1 || !collegeId2 || comparing}
          >
            {comparing ? 'Comparing...' : 'Compare Colleges'}
          </Button>
        </CardContent>
      </Card>
      
      {college1 && college2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Comparison Results</h2>
          
          <div className="grid grid-cols-3 gap-4 bg-white rounded-lg border overflow-x-auto">
            <div className="font-semibold p-4 border-b bg-gray-50">Criteria</div>
            <div className="font-semibold p-4 border-b border-l bg-gray-50">{college1.college_name}</div>
            <div className="font-semibold p-4 border-b border-l bg-gray-50">{college2.college_name}</div>
            
            <div className="p-4 border-b">Established</div>
            <div className="p-4 border-b border-l">{college1.established_year}</div>
            <div className="p-4 border-b border-l">{college2.established_year}</div>
            
            <div className="p-4 border-b">Accreditation</div>
            <div className="p-4 border-b border-l">{college1.accreditation}</div>
            <div className="p-4 border-b border-l">{college2.accreditation}</div>
            
            <div className="p-4 border-b">Location</div>
            <div className="p-4 border-b border-l">{`${college1.city}, ${college1.location_state}`}</div>
            <div className="p-4 border-b border-l">{`${college2.city}, ${college2.location_state}`}</div>
            
            <div className="p-4 border-b">Campus Size (Acres)</div>
            <div className="p-4 border-b border-l">{college1.campus_size}</div>
            <div className="p-4 border-b border-l">{college2.campus_size}</div>
            
            <div className="p-4 border-b">College Ranking</div>
            <div className="p-4 border-b border-l">{college1.college_ranking || 'Not Available'}</div>
            <div className="p-4 border-b border-l">{college2.college_ranking || 'Not Available'}</div>
            
            <div className="p-4 border-b">Faculty Count</div>
            <div className="p-4 border-b border-l">{college1.total_faculty || 'Not Available'}</div>
            <div className="p-4 border-b border-l">{college2.total_faculty || 'Not Available'}</div>
            
            <div className="p-4 border-b">Student-Faculty Ratio</div>
            <div className="p-4 border-b border-l">{college1.student_faculty_ratio || 'Not Available'}</div>
            <div className="p-4 border-b border-l">{college2.student_faculty_ratio || 'Not Available'}</div>
            
            <div className="p-4 border-b">Research Output</div>
            <div className="p-4 border-b border-l">{college1.research_output || 'Not Available'}</div>
            <div className="p-4 border-b border-l">{college2.research_output || 'Not Available'}</div>
            
            <div className="p-4">Website</div>
            <div className="p-4 border-l">
              <a 
                href={college1.website_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                {college1.website_url}
              </a>
            </div>
            <div className="p-4 border-l">
              <a 
                href={college2.website_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                {college2.website_url}
              </a>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" asChild>
              <a href={`/colleges/${college1.college_id}`}>View {college1.college_name}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/colleges/${college2.college_id}`}>View {college2.college_name}</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
