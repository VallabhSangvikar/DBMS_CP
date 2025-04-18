import api from './api';

// Types
export interface College {
  collegeId: number;
  collegeName: string;
  establishedYear: number;
  accreditation: string;
  locationState: string;
  city: string;
  campusSize: number;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  emailDomain: string;
  userId?: number;
}

export interface CollegeFormData {
  collegeName: string;
  establishedYear: number;
  accreditation: string;
  locationState: string;
  city: string;
  campusSize: number;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  emailDomain: string;
}

export interface Infrastructure {
  collegeId: number;
  infrastructureId?: number;
  hostel: boolean;
  library: boolean;
  lab: boolean;
  sports: boolean;
  digitalLearningResources: boolean;
}

export interface InfrastructureFormData {
  collegeId: number;
  hostel: boolean;
  library: boolean;
  lab: boolean;
  sports: boolean;
  digitalLearningResources: boolean;
}

export interface Faculty {
  facultyId: number;
  collegeId: number;
  userId?: number;
  department: string;
  qualification: string;
  researchArea?: string;
  contactEmail: string;
  publications?: string;
  experience?: number;
  username?: string;
}

export interface Placement {
  placementId: number;
  collegeId: number;
  year: number;
  companyName: string;
  studentsPlaced: number;
  averageSalary: number;
  highestSalary: number;
  sector: string;
}

export interface PlacementFormData {
  collegeId: number;
  year: number;
  companyName: string;
  studentsPlaced: number | string;
  averageSalary: number | string;
  highestSalary: number | string;
  sector: string;
}

export interface Scholarship {
  scholarshipId: number;
  collegeId: number;
  name: string;
  description: string;
  eligibilityCriteria: string;
  amount: number;
  applicationProcess: string;
  deadline: string;
}

export interface ScholarshipFormData {
  collegeId: number;
  name: string;
  description: string;
  eligibilityCriteria: string;
  amount: number;
  applicationProcess: string;
  deadline: string;
}

// College service
const CollegeService = {
  // Get all colleges
  getAllColleges: async (): Promise<College[]> => {
    const response = await api.get('/colleges');
    return response.data ? response.data.colleges : [];
  },
  getCollegeProfile: async (): Promise<College> => {
    const response = await api.get(`/colleges/profile`);
    return  response.data.college ;
  },
  // Get college by ID
  getCollegeById: async (id: number): Promise<College> => {
    const response = await api.get(`/colleges/${id}`);
    return response.data.college;
  },

  // Create college
  createCollege: async (data: CollegeFormData): Promise<College> => {
    const response = await api.post('/colleges', data);
    return response.data.college;
  },

  // Update college
  updateCollege: async (id: number, data: Partial<CollegeFormData>): Promise<College> => {
    const response = await api.put(`/colleges/${id}`, data);
    return response.data.college;
  },

  // Delete college
  deleteCollege: async (id: number): Promise<void> => {
    await api.delete(`/colleges/${id}`);
  },

  // Get college courses
  getCollegeCourses: async (id: number): Promise<any[]> => {
    const response = await api.get(`/colleges/${id}/courses`);
    return response.data ? response.data.courses : [];
  },

  // Get college infrastructure
  getCollegeInfrastructure: async (id: number): Promise<Infrastructure> => {
    const response = await api.get(`/colleges/${id}/infrastructure`);
    return response.data.infrastructure;
  },

  // Create college infrastructure
  createInfrastructure: async (data: InfrastructureFormData): Promise<Infrastructure> => {
    const response = await api.post('/colleges/infrastructure', data);
    return response.data.infrastructure;
  },

  // Update college infrastructure
  updateInfrastructure: async (data: InfrastructureFormData): Promise<Infrastructure> => {
    const response = await api.put('/colleges/infrastructure', data);
    return response.data.infrastructure;
  },

  // Get college faculty
  getCollegeFaculty: async (id: number): Promise<Faculty[]> => {
    const response = await api.get(`/colleges/${id}/faculty`);
    return response.data? response.data.faculty : [];
  },

  // Get college placements
  getCollegePlacements: async (id: number): Promise<Placement[]> => {
    const response = await api.get(`/colleges/${id}/placement`);
    return response.data ? response.data.placements : [];
  },

  // Create placement record
  createPlacement: async (data: PlacementFormData): Promise<Placement> => {
    const response = await api.post('/colleges/placement', data);
    return response.data.placement;
  },

  // Update placement record
  updatePlacement: async (id: number, data: Partial<PlacementFormData>): Promise<Placement> => {
    const response = await api.put(`/colleges/placement/${id}`, data);
    return response.data.placement;
  },

  // Delete placement record
  deletePlacement: async (id: number): Promise<void> => {
    await api.delete(`/colleges/placement/${id}`);
  },

  // Get college scholarships
  getCollegeScholarships: async (id: number): Promise<Scholarship[]> => {
    const response = await api.get(`/colleges/${id}/scholarships`);
    console.log(response.data)
    return response.data ? response.data.scholarships : [];
  },

  // Create scholarship
  createScholarship: async (data: ScholarshipFormData): Promise<Scholarship> => {
    const response = await api.post('/colleges/scholarship', data);
    return response.data;
  },

  // Update scholarship
  updateScholarship: async (id: number, data: Partial<ScholarshipFormData>): Promise<Scholarship> => {
    const response = await api.put(`/colleges/scholarship/${id}`, data);
    return response.data;
  },

  // Delete scholarship
  deleteScholarship: async (id: number): Promise<void> => {
    await api.delete(`/colleges/scholarship/${id}`);
  },

  // Get college alumni
  getCollegeAlumni: async (id: number): Promise<any[]> => {
    const response = await api.get(`/colleges/${id}/alumni`);
    return response.data ? response.data.alumni : [];
  }
};

export default CollegeService;
