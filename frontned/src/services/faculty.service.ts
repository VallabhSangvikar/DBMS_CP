import api from './api';

// Types
export interface FacultyProfile {
  faculty_id?: number;
  user_id?: number;
  college_id: number;
  department: string;
  qualification: string;
  research_area?: string;
  contact_email: string;
  publications?: string;
  experience?: number;
  college_name?: string;
}

export interface FacultyProfileFormData {
  college_id: number;
  department: string;
  qualification: string;
  research_area?: string;
  contact_email: string;
  publications?: string;
  experience?: number;
}

export interface FacultyInvitation {
  email: string;
  department: string;
  college_id: number;
  role?: string;
}

export interface Application {
  application_id: number;
  course_id: number;
  student_id: number;
  faculty_id: number;
  application_date: string;
  status: string;
  comments?: string;
  course_name?: string;
  student_name?: string;
  student_email?: string;
  entrance_exam_percentile?: number;
  category?: string;
  stream?: string;
}

export interface ApplicationStatusUpdate {
  status: 'approved' | 'rejected';
  comments?: string;
}

// Faculty service methods
const FacultyService = {
  // Create faculty profile
  createProfile: async (data: FacultyProfileFormData): Promise<FacultyProfile> => {
    const response = await api.post('/faculty/profile', data);
    return response.data;
  },

  // Get faculty profile
  getProfile: async (): Promise<FacultyProfile> => {
    const response = await api.get('/faculty/profile');
    return response.data.profile;
  },

  // Update faculty profile
  updateProfile: async (data: Partial<FacultyProfileFormData>): Promise<FacultyProfile> => {
    const response = await api.put('/faculty/profile', data);
    return response.data;
  },

  // Get faculty applications
  getApplications: async (): Promise<Application[]> => {
    const response = await api.get('/faculty/applications');
    return response.data.applications;
  },

  // Update application status
  updateApplicationStatus: async (applicationId: number, updateData: ApplicationStatusUpdate): Promise<Application> => {
    const response = await api.put(`/faculty/applications/${applicationId}`, updateData);
    return response.data;
  },
  
  // Invite faculty (sent by institute)
  inviteFaculty: async (invitation: FacultyInvitation): Promise<any> => {
    const response = await api.post('/faculty/invite', invitation);
    return response.data;
  },
  
  // Get pending faculty invitations for an institute
  getPendingInvitations: async (collegeId: number): Promise<any[]> => {
    const response = await api.get(`/faculty/invitations/${collegeId}`);
    return response.data.invitations || [];
  },
  
  // Accept/reject faculty invitation (by faculty)
  respondToInvitation: async (invitationId: number, accept: boolean): Promise<any> => {
    const response = await api.put(`/faculty/invitation/${invitationId}`, { accept });
    return response.data;
  },
  
  // Get invitations for a faculty email
  getFacultyInvitations: async (email: string): Promise<any[]> => {
    const response = await api.get(`/faculty/invitations/email/${email}`);
    return response.data.invitations || [];
  }
};

export default FacultyService;
