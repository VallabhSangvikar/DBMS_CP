import api from './api';

// Types
export interface StudentProfile {
  studentId?: number;
  userId?: number;
  collegeId?: number | null;
  entranceExamName: string;
  entranceExamPercentile: number;
  category: string;
  stream: string;
  passingYear: number;
  cutoffPoints: number;
  interestedCourses: string;
  isVerified?: boolean;
  collegeName?: string;
}

export interface StudentProfileFormData {
  collegeId?: number | null;
  entranceExamName: string;
  entranceExamPercentile: number | string;
  category: string;
  stream: string;
  passingYear: number;
  cutoffPoints: number | string;
  interestedCourses: string;
}

export interface CollegeComparison {
  colleges: Record<number, any>;
  infrastructure: Record<number, any>;
  placements: Record<number, any[]>;
  courses: Record<number, any[]>;
  scholarships: Record<number, any[]>;
}

export interface CourseApplication {
  applicationId: number;
  studentId: number;
  courseId: number;
  facultyId: number;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  courseName?: string;
  collegeName?: string;
  facultyName?: string;
}

export interface Scholarship {
  scholarship_id: number;
  college_id: number;
  college_name?: string;
  scholarship_name: string;
  amount: number;
  eligibility_criteria?: string;
  deadline?: string;
  description?: string;
}

// Student service methods
const StudentService = {
  // Create student profile
  createProfile: async (data: StudentProfileFormData): Promise<void> => {
    await api.post('/students/profile', data);
  },

  // Get student profile
  getProfile: async (): Promise<StudentProfile> => {
    const response = await api.get('/students/profile');
    return response.data.profile;
  },

  // Update student profile
  updateProfile: async (data: StudentProfileFormData): Promise<void> => {
    await api.put('/students/profile', data);
  },

  // Verify student by email
  verifyStudentByEmail: async (email: string): Promise<{ verified: boolean, college: { id: number, name: string } }> => {
    const response = await api.put('/students/verify', { email });
    return response.data;
  },

  // Compare colleges
  compareColleges: async (collegeId1: number, collegeId2: number): Promise<CollegeComparison> => {
    const response = await api.get('/students/compare-colleges', {
      params: { collegeId1, collegeId2 }
    });
    return response.data;
  },
  
  // Get all available scholarships
  getScholarships: async (): Promise<Scholarship[]> => {
    const response = await api.get('/students/scholarships');
    return response.data.scholarships || [];
  },
  
  // Get scholarships by college ID
  getCollegeScholarships: async (collegeId: number): Promise<Scholarship[]> => {
    const response = await api.get(`/colleges/${collegeId}/scholarships`);
    return response.data.scholarships || [];
  },
  
  // Apply for scholarship
  applyForScholarship: async (scholarshipId: number, applicationData: any): Promise<any> => {
    const response = await api.post(`/students/scholarships/apply/${scholarshipId}`, applicationData);
    return response.data;
  },
  
  // Get student's scholarship applications
  getScholarshipApplications: async (): Promise<any[]> => {
    const response = await api.get('/students/scholarship-applications');
    return response.data.applications || [];
  }
};

export default StudentService;
