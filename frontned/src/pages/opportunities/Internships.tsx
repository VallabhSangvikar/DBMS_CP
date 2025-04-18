import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

// Define type for internship entries
interface Internship {
  id: number;
  company: string;
  position: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: string;
  skills: string[];
  description?: string;
}

export default function Internships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    // Fetch internships from API
    async function fetchInternships() {
      try {
        setLoading(true);
        // This would be replaced with an actual API call in production
        // const response = await api.get('/internships');
        // setInternships(response.data);
        
        // Using placeholder data for now
        setTimeout(() => {
          const data = [
            {
              id: 1,
              company: "Tech Solutions Inc.",
              position: "Software Engineering Intern",
              location: "Remote",
              duration: "3 months",
              stipend: "₹15,000/month",
              deadline: "2024-06-15",
              skills: ["React", "Node.js", "MongoDB"],
              description: "Join our engineering team to work on exciting projects using modern web technologies."
            },
            {
              id: 2,
              company: "Data Analytics Co.",
              position: "Data Science Intern",
              location: "Bangalore",
              duration: "6 months",
              stipend: "₹20,000/month",
              deadline: "2024-05-30",
              skills: ["Python", "SQL", "Machine Learning"],
              description: "Help us analyze large datasets and build predictive models."
            }
          ];
          setInternships(data);
          setFilteredInternships(data);
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load internships");
        setLoading(false);
      }
    }
    
    fetchInternships();
  }, []);

  // Filter internships based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredInternships(internships);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredInternships(
        internships.filter(
          (internship) =>
            internship.position.toLowerCase().includes(query) ||
            internship.company.toLowerCase().includes(query) ||
            internship.skills.some(skill => skill.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, internships]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Internship Opportunities</h1>
        {user && <Button>Post Internship</Button>}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10"
          placeholder="Search by position, company, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-4/5 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded border border-red-200 text-red-600">
          {error}
        </div>
      )}
      
      {!loading && filteredInternships.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No internships found matching your search.</p>
        </div>
      )}

      {!loading && filteredInternships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInternships.map((internship) => (
            <Card key={internship.id}>
              <CardHeader>
                <h3 className="text-xl font-semibold">{internship.position}</h3>
                <p className="text-lg text-blue-600">{internship.company}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>📍 {internship.location}</p>
                  <p>⏱️ {internship.duration}</p>
                  <p>💰 {internship.stipend}</p>
                  {internship.description && <p className="mt-2">{internship.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {internship.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Deadline: {new Date(internship.deadline).toLocaleDateString()}</p>
                <Button>Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
