import api from './api';
import CollegeService from './college.service';

// Types
export interface Course {
  course_id: number;
  college_id: number;
  course_name: string;
  duration: number;
  fee: number;
  college_name?: string;
}

export interface CourseFormData {
  college_id: number;
  course_name: string;
  duration: number;
  fee: number;
  eligibility?: string;
  description?: string;
}

export interface CourseCutoff {
  cutoff_id: number;
  course_id: number;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  year: number;
}

export interface CourseCutoffFormData {
  course_id: number;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  year: number;
}

export interface Application {
  application_id: number;
  student_id: number;
  course_id: number;
  faculty_id: number;
  application_date: string;
  status: string;
  comments?: string;
  course_name?: string;
  fee?: number;
  college_name?: string;
  faculty_name?: string;
  student_name?: string;
  student_email?: string;
  entrance_exam_percentile?: number;
  category?: string;
  stream?: string;
  department?: string;
}

// Course service functions
const CourseService = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data ? response.data.courses : [];
  },

  // Get course by ID
  getCourseById: async (id: number): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data.course;
  },

  // Create course
  createCourse: async (data: CourseFormData): Promise<Course> => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  // Update course
  updateCourse: async (id: number, data: Partial<CourseFormData>): Promise<Course> => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id: number): Promise<void> => {
    await api.delete(`/courses/${id}`);
  },

  // Get course cutoffs
  getCourseCutoffs: async (id: number): Promise<CourseCutoff[]> => {
    const response = await api.get(`/courses/${id}/cutoffs`);
    const cutoffs = response.data.cutoffs;
    // Assuming 'cutoffs' is the array from the API
const groupedCutoffs:any = [];

cutoffs.forEach(item => {
  const existing = groupedCutoffs.find(g => g.year === item.academic_year);

  if (existing) {
    existing[item.category.toLowerCase()] = item.cutoff_score;
  } else {
    groupedCutoffs.push({
      year: item.academic_year,
      [item.category.toLowerCase()]: item.cutoff_score,
    });
  }
});

    return groupedCutoffs ;
  },

  // Create course cutoff
  createCourseCutoff: async (data: CourseCutoffFormData): Promise<CourseCutoff> => {
    const response = await api.post('/courses/cutoff', data);
    return response.data;
  },

  // Update course cutoff
  updateCourseCutoff: async (id: number, data: Partial<CourseCutoffFormData>): Promise<CourseCutoff> => {
    const response = await api.put(`/courses/cutoff/${id}`, data);
    return response.data;
  },

  // Delete course cutoff
  deleteCourseCutoff: async (id: number): Promise<void> => {
    await api.delete(`/courses/cutoff/${id}`);
  },
  
  // Update multiple course cutoffs
  updateCourseCutoffs: async (courseId: number, cutoffs: CourseCutoffFormData[]): Promise<void> => {
    await api.put(`/courses/${courseId}/cutoffs`, { cutoffs });
  },

  // Get course applications
  getCourseApplications: async (courseId: number): Promise<Application[]> => {
    const response = await api.get(`/courses/applications/${courseId}`);
    return  response.data.applications ;
  },

  // Apply to course (student)
  applyToCourse: async (application: { course_id: number, faculty_id: number, comments?: string }): Promise<void> => {
    console.log('Applying to course:', application);
    const response=await api.post('/courses/apply', application);
    console.log(response.data);
  },

  // Get student applications
  getStudentApplications: async (): Promise<Application[]> => {
    const response = await api.get('/courses/student-applications');
    return response.data.applications;
  },

  // Get all courses with college information
  getAllCoursesWithColleges: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    const courses =  response.data.courses;
    try {
      // Get all colleges to match with courses
      const colleges = await CollegeService.getAllColleges();
      
      // Create a map of college IDs to college names for quick lookup
      const collegeMap = colleges.reduce((map: Record<number, string>, college) => {
        map[college.college_id] = college.college_name;
        return map;
      }, {});
      
      // Add college name to each course
      return courses.map(course => ({
        ...course,
        college_name: collegeMap[course.college_id] || 'Unknown College'
      }));
    } catch (err) {
      console.error('Error enriching courses with college data:', err);
      return courses;
    }
  }
};

export default CourseService;
