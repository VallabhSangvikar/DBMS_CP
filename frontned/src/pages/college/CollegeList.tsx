import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CollegeService, { College } from "@/services/college.service";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MapPin, 
  Award, 
  Building, 
  Calendar, 
  School, 
  Filter, 
  ArrowRight, 
  GraduationCap, 
  Users,
  BookOpen,
  X
} from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeView, setActiveView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        const data = await CollegeService.getAllColleges();
        setColleges(data);
        setFilteredColleges(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load colleges");
        console.error("Error fetching colleges:", err);
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
          college.collegeName?.toLowerCase().includes(query) ||
          college.college_name?.toLowerCase().includes(query) ||
          college.city?.toLowerCase().includes(query)
      );
    }

    // Apply state filter
    if (stateFilter !== "All States") {
      result = result.filter(
        (college) => college.locationState === stateFilter || college.location_state === stateFilter
      );
    }

    // Apply accreditation filter
    if (accreditationFilter !== "All") {
      result = result.filter(
        (college) => college.accreditation === accreditationFilter
      );
    }

    setFilteredColleges(result);
    
    // Update active filters count
    const activeFiltersCount = [
      searchQuery.trim() !== "",
      stateFilter !== "All States",
      accreditationFilter !== "All",
    ].filter(Boolean).length;
    
    // Set active filters based on which filters are applied
    const newActiveFilters = [];
    if (searchQuery.trim() !== "") newActiveFilters.push("Search");
    if (stateFilter !== "All States") newActiveFilters.push(stateFilter);
    if (accreditationFilter !== "All") newActiveFilters.push(accreditationFilter);
    
    setActiveFilters(newActiveFilters);
    
  }, [searchQuery, stateFilter, accreditationFilter, colleges]);

  // Extract unique accreditation values from colleges
  const accreditations = ["All", ...(Array.isArray(colleges) ? [...new Set(colleges.map(college => college.accreditation))] : [])];

  // Helper function to clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setStateFilter("All States");
    setAccreditationFilter("All");
  };

  // Helper to get a random color for each college card header
  const getCollegeHeaderColor = (collegeId: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600", 
      "from-teal-500 to-teal-600",
      "from-indigo-500 to-indigo-600",
      "from-emerald-500 to-emerald-600",
      "from-cyan-500 to-cyan-600",
    ];
    return colors[collegeId % colors.length];
  };

  // Helper to get the first initial of the college name for the avatar
  const getCollegeInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
  };
  
  // Helper to get a badge color based on accreditation
  const getAccreditationBadgeColor = (accreditation: string) => {
    const map: {[key: string]: string} = {
      'A++': 'bg-green-100 text-green-800 border-green-200',
      'A+': 'bg-green-100 text-green-800 border-green-200',
      'A': 'bg-blue-100 text-blue-800 border-blue-200',
      'B++': 'bg-blue-100 text-blue-800 border-blue-200',
      'B+': 'bg-amber-100 text-amber-800 border-amber-200',
      'B': 'bg-amber-100 text-amber-800 border-amber-200',
      'C': 'bg-orange-100 text-orange-800 border-orange-200',
      'D': 'bg-red-100 text-red-800 border-red-200',
    };
    
    return map[accreditation] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10 py-12 px-6 md:px-12 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect College</h1>
          <p className="text-lg max-w-xl mb-6 text-white/90">
            Explore top colleges across India, compare facilities, and discover programs that align with your academic goals.
          </p>
          
          <div className="relative max-w-2xl bg-white rounded-xl shadow-lg p-1.5 flex">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              className="pl-10 pr-4 py-6 rounded-lg border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-base"
              placeholder="Search colleges by name, location, or programs..."
              value={searchQuery}
              onChange={(e:any) => setSearchQuery(e.target.value)}
            />
            <Button className="ml-2 px-6 bg-gradient-to-r from-primary to-accent rounded-lg">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            Browse Colleges
            {activeFilters.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-0">
                {filteredColleges.length} results
              </Badge>
            )}
          </h2>
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map(filter => (
                <Badge key={filter} variant="outline" className="px-2.5 py-1 bg-gray-100">
                  {filter}
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center border-gray-300"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilters.length > 0 && (
              <span className="ml-1.5 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </Button>

          <Tabs value={activeView} onValueChange={setActiveView} className="hidden md:block">
            <TabsList className="h-9 p-1">
              <TabsTrigger value="grid" className="h-7 px-3">
                <div className="grid grid-cols-2 gap-0.5 h-4 w-4 mr-1">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="h-7 px-3">
                <div className="flex flex-col gap-0.5 h-4 w-4 mr-1">
                  <div className="bg-current rounded-sm h-[2px] w-full"></div>
                  <div className="bg-current rounded-sm h-[2px] w-full"></div>
                  <div className="bg-current rounded-sm h-[2px] w-full"></div>
                </div>
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filters Section - collapsible */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filter Colleges</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setShowFilters(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">Location</label>
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="bg-white">
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
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block text-gray-700">Accreditation</label>
              <Select value={accreditationFilter} onValueChange={setAccreditationFilter}>
                <SelectTrigger className="bg-white">
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
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <Button variant="outline" onClick={clearFilters}>Clear all</Button>
            <Button onClick={() => setShowFilters(false)}>Apply filters</Button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && <ErrorDisplay error={error} />}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-md rounded-xl">
              <div className="h-36 bg-gray-200 animate-pulse"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-3 w-1/2"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse mb-3 w-2/3"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-gray-50">
                <div className="h-9 bg-gray-200 rounded animate-pulse w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* No results message */}
      {!loading && filteredColleges.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200 mt-8">
          <Building className="mx-auto h-14 w-14 text-gray-300" />
          <h3 className="mt-4 text-xl font-medium text-gray-900">No colleges found</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            We couldn't find any colleges matching your search criteria. Try adjusting your filters or search terms.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={clearFilters}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* College grid view */}
      {!loading && filteredColleges.length > 0 && activeView === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredColleges.map((college) => (
            <Card 
              key={college.college_id} 
              className="overflow-hidden border-0 shadow-md rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Header with gradient background */}
              <div className={`h-36 bg-gradient-to-r ${getCollegeHeaderColor(college.college_id)} flex items-center justify-between px-6 relative`}>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                    {getCollegeInitial(college.college_name)}
                  </div>
                </div>
                <Badge className={`${getAccreditationBadgeColor(college.accreditation)} absolute top-4 right-4`}>
                  {college.accreditation}
                </Badge>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{college.college_name}</h3>
                <div className="flex items-center text-gray-500 mb-3">
                  <MapPin size={15} className="mr-1.5 flex-shrink-0" />
                  <span className="truncate">
                    {college.city}, {college.location_state}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <Calendar size={15} className="mr-1.5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">Est. {college.established_year}</span>
                  </div>
                  
                  <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                    <Building size={15} className="mr-1.5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm truncate">{college.campus_size || 'N/A'} acres</span>
                  </div>
                  
                  {college.courses_count && (
                    <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                      <BookOpen size={15} className="mr-1.5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{college.courses_count} Courses</span>
                    </div>
                  )}
                  
                  {college.faculty_count && (
                    <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                      <Users size={15} className="mr-1.5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{college.faculty_count} Faculty</span>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t px-6 py-4 bg-gray-50">
                <Button className="w-full" asChild>
                  <Link to={`/colleges/${college.college_id}`} className="flex items-center justify-center">
                    <School className="mr-2 h-4 w-4" />
                    View College Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* College list view */}
      {!loading && filteredColleges.length > 0 && activeView === "list" && (
        <div className="space-y-4 mt-8">
          {filteredColleges.map((college) => (
            <Card 
              key={college.college_id} 
              className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className={`w-full md:w-1/4 bg-gradient-to-r ${getCollegeHeaderColor(college.college_id)} flex items-center justify-center p-6 md:p-4 text-white`}>
                  <div className="flex flex-col items-center justify-center text-center">
                    <School className="h-8 w-8 mb-2" />
                    <h3 className="font-bold text-lg mb-1">{college.college_name}</h3>
                    <Badge className="bg-white/20 text-white border-0">
                      {college.accreditation}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-2 md:mb-0">
                      <MapPin size={16} className="mr-1.5 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {college.city}, {college.location_state}
                      </span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1.5 text-gray-500" />
                        <span className="text-sm text-gray-600">Est. {college.established_year}</span>
                      </div>
                      
                      {college.campus_size && (
                        <div className="flex items-center">
                          <Building size={16} className="mr-1.5 text-gray-500" />
                          <span className="text-sm text-gray-600">{college.campus_size} acres</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                      {college.courses_count && (
                        <Badge variant="outline" className="px-2.5 py-1 flex items-center gap-1.5">
                          <BookOpen size={12} />
                          <span>{college.courses_count} Courses</span>
                        </Badge>
                      )}
                      
                      {college.faculty_count && (
                        <Badge variant="outline" className="px-2.5 py-1 flex items-center gap-1.5">
                          <Users size={12} />
                          <span>{college.faculty_count} Faculty</span>
                        </Badge>
                      )}
                    </div>
                    
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/colleges/${college.college_id}`} className="flex items-center">
                        View Details
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination placeholder - can be implemented later */}
      {!loading && filteredColleges.length > 15 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {/* Add pagination controls here when needed */}
          </div>
        </div>
      )}
    </div>
  );
}
