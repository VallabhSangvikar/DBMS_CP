import api from './api';

// Types
export interface Alumni {
  alumniId: number;
  collegeId: number;
  name: string;
  graduationYear: number;
  degree: string;
  currentCompany?: string;
  designation?: string;
  package?: number;
  achievements?: string;
  linkedinProfile?: string;
  contactEmail?: string;
}

export interface AlumniFormData {
  collegeId: number;
  name: string;
  graduation_year: string | number;
  degree: string;
  current_company?: string;
  designation?: string;
  achievements?: string;
  linkedin_profile?: string;
}

// Alumni service methods
const AlumniService = {
  // Get all alumni
  getAllAlumni: async (): Promise<Alumni[]> => {
    const response = await api.get('/alumni');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get alumni by ID
  getAlumniById: async (id: number): Promise<Alumni> => {
    const response = await api.get(`/alumni/${id}`);
    return response.data;
  },

  // Get notable alumni for a college
  getNotableAlumni: async (collegeId: number): Promise<Alumni[]> => {
    const response = await api.get(`/alumni/notable/${collegeId}`);
    return response.data.alumni;
  },

  // Get college alumni
  getCollegeAlumni: async (collegeId: number): Promise<Alumni[]> => {
    const response = await api.get(`/colleges/${collegeId}/alumni`);
    return Array.isArray(response.data) ? response.data : [];
  },

  // Create alumni
  createAlumni: async (collegeId: number, data: any): Promise<Alumni> => {
    // Ensure collegeId is part of the data
    console.log('Creating alumni with data:', data);
    console.log('College ID:', collegeId);
    const alumniData = { ...data, collegeId };
    const response = await api.post('/alumni', alumniData);
    return response.data;
  },

  // Update alumni
  updateAlumni: async (collegeId: number, id: number, data: any): Promise<Alumni> => {
    // Ensure collegeId is part of the data
    const alumniData = { ...data, collegeId };
    const response = await api.put(`/alumni/${id}`, alumniData);
    return response.data;
  },

  // Delete alumni
  deleteAlumni: async (id: number): Promise<void> => {
    await api.delete(`/alumni/${id}`);
  }
};

export default AlumniService;
