import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';

// Home and auth pages
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Dashboard pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import InstituteDashboard from './pages/dashboard/InstituteDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';

// College pages
import CollegeList from './pages/college/CollegeList';
import CollegeDetail from './pages/college/CollegeDetail';
import CreateEditCollege from './pages/college/CreateEditCollege';
import InfrastructureForm from './pages/college/InfrastructureForm';
import PlacementForm from './pages/college/PlacementForm';
import AlumniForm from './pages/college/AlumniForm';

// Course pages
import Courses from './pages/courses/Courses';
import CourseDetails from './pages/courses/CourseDetails';
import CutoffForm from './pages/courses/CutoffForm';
import CourseForm from './pages/courses/CourseForm';

// Student pages
import StudentProfile from './pages/student/StudentProfile';
import CollegeComparison from './pages/student/CollegeComparison';
import ScholarshipApplication from './pages/student/ScholarshipApplication';

// Faculty pages
import FacultyProfile from './pages/faculty/FacultyProfile';

// Demo mode disabled for production
const DEMO_MODE = false;

// Protected route wrapper component
interface ProtectedRouteProps {
  userTypes?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userTypes, children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user || (userTypes && !userTypes.includes(user.userType))) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/colleges" element={<CollegeList />} />
            <Route path="/colleges/:id" element={<CollegeDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            
            {/* Student routes */}
            <Route 
              path="/dashboard/student" 
              element={<ProtectedRoute userTypes={['student']}><StudentDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/profile/:action" 
              element={<ProtectedRoute userTypes={['student']}><StudentProfile /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/compare" 
              element={<ProtectedRoute userTypes={['student']}><CollegeComparison /></ProtectedRoute>} 
            />
            <Route 
              path="/scholarship/application" 
              element={<ProtectedRoute userTypes={['student']}><ScholarshipApplication /></ProtectedRoute>} 
            />
            <Route 
              path="/scholarships/:scholarshipId/apply" 
              element={<ProtectedRoute userTypes={['student']}><ScholarshipApplication /></ProtectedRoute>} 
            />
            
            {/* Institute routes */}
            <Route 
              path="/dashboard/institute" 
              element={<ProtectedRoute userTypes={['institute']}><InstituteDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/create" 
              element={<ProtectedRoute userTypes={['institute']}><CreateEditCollege /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/edit/:id" 
              element={<ProtectedRoute userTypes={['institute']}><CreateEditCollege /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:id/infrastructure" 
              element={<ProtectedRoute userTypes={['institute']}><InfrastructureForm /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:id/placement/create" 
              element={<ProtectedRoute userTypes={['institute']}><PlacementForm /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:id/placement/:placementId/edit" 
              element={<ProtectedRoute userTypes={['institute']}><PlacementForm /></ProtectedRoute>} 
            />
            <Route 
              path="/courses/:courseId/cutoffs" 
              element={<ProtectedRoute userTypes={['institute']}><CutoffForm /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:collegeId/courses/create" 
              element={<ProtectedRoute userTypes={['institute']}><CourseForm /></ProtectedRoute>} 
            />
            <Route 
              path="/courses/:courseId/edit" 
              element={<ProtectedRoute userTypes={['institute']}><CourseForm /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:id/alumni/create" 
              element={<ProtectedRoute userTypes={['institute']}><AlumniForm /></ProtectedRoute>} 
            />
            <Route 
              path="/colleges/:id/alumni/:alumniId/edit" 
              element={<ProtectedRoute userTypes={['institute']}><AlumniForm /></ProtectedRoute>} 
            />
            
            {/* Faculty routes */}
            <Route 
              path="/dashboard/faculty" 
              element={<ProtectedRoute userTypes={['faculty']}><FacultyDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/dashboard/faculty/profile/:action" 
              element={<ProtectedRoute userTypes={['faculty']}><FacultyProfile /></ProtectedRoute>} 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
