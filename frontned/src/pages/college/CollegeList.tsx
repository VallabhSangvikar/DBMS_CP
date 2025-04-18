import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CollegeService, { College } from "@/services/college.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Award, Building, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardSkeleton } from "@/components/ui/skeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Badge } from "@/components/ui/badge";

// Generate a list of Indian states for filtering
const indianStates = [
  "All States",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All States");
  const [accreditationFilter, setAccreditationFilter] = useState("All");

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        const data = await CollegeService.getAllColleges(); // Debugging line
        setColleges(data); // Assuming the API returns an object with a 'colleges' property
        setFilteredColleges(data); // Assuming the API returns an object with a 'colleges' property
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load colleges");
        console.error("Error fetching colleges:", err);
        // Set empty arrays instead of using dummy data
        setColleges([]);
        setFilteredColleges([]);
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, []);

  // Apply all filters whenever the filter states change
  useEffect(() => {
    let result = colleges;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (college) =>
          college.collegeName.toLowerCase().includes(query) ||
          college.city.toLowerCase().includes(query)
      );
    }

    // Apply state filter
    if (stateFilter !== "All States") {
      result = result.filter(
        (college) => college.locationState === stateFilter
      );
    }

    // Apply accreditation filter
    if (accreditationFilter !== "All") {
      result = result.filter(
        (college) => college.accreditation === accreditationFilter
      );
    }

    setFilteredColleges(result);
  }, [searchQuery, stateFilter, accreditationFilter, colleges]);

  // Extract unique accreditation values from colleges
  const accreditations = ["All", ...(Array.isArray(colleges) ? [...new Set(colleges.map(college => college.accreditation))] : [])];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Explore Colleges</h1>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10"
            placeholder="Search by college name or city..."
            value={searchQuery}
            onChange={(e:any) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by state" />
          </SelectTrigger>
          <SelectContent>
            {indianStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by accreditation" />
          </SelectTrigger>
          <SelectContent>
            {accreditations.map((accreditation) => (
              <SelectItem key={accreditation} value={accreditation}>
                {accreditation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error display */}
      {error && <ErrorDisplay error={error} />}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* No results message */}
      {!loading && filteredColleges.length === 0 && (
        <div className="text-center py-10">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No colleges found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* College grid */}
      {!loading && filteredColleges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key={1} >
          {filteredColleges.map((college) => (
            <Link to={`/colleges/${college.college_id}`} key={college.college_id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="text-xl">{college.college_name}</span>
                    <Badge>{college.accreditation}</Badge>
                  </CardTitle>
                  <div className="flex items-center text-gray-500">
                    <MapPin size={16} className="mr-1" />
                    <span>
                      {college.city}, {college.location_state}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Calendar size={16} className="mr-2" />
                      <span>Est. {college.established_year}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Award size={16} className="mr-2" />
                      <span>Accreditation: {college.accreditation}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Building size={16} className="mr-2" />
                      <span>Campus Size: {college.campus_size} acres</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View College
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
