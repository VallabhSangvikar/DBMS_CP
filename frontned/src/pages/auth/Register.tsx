import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AlertCircle, Mail, Lock, User, Phone, School, Building, UserCheck, GraduationCap, CheckCircle } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'student',
    phone: ''
  })
 
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUserTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, userType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (!formData.phone) {
      setError('Phone number is required')
      return
    }

    if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      setError('Phone number must be between 10 and 15 digits')
      return
    }
    
    try {
      setError('')
      setLoading(true)
      
      // Call the register function from AuthContext with all required fields
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.userType,
        formData.phone
      )
      
      // Redirect based on user type
      const redirectPath = getRedirectPath(formData.userType)
      navigate(redirectPath)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create account. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Helper to get the right redirect path based on user type
  const getRedirectPath = (userType: string) => {
    switch (userType) {
      case 'student':
        return '/profile/create'
      case 'institute':
        return '/colleges/create'
      case 'faculty':
        return '/dashboard/faculty/profile/create'
      default:
        return '/'
    }
  }
  
  // Get icon for user type
  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <GraduationCap className="h-5 w-5 text-primary" />
      case 'institute':
        return <Building className="h-5 w-5 text-primary" />
      case 'faculty':
        return <UserCheck className="h-5 w-5 text-primary" />
      default:
        return <User className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[85vh]">
      {/* Left side - Benefits section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-accent to-primary text-white p-8 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-6">
            <School className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Join UniPortal Today</h2>
          <p className="text-lg opacity-90 mb-8">
            Create your account and unlock a world of academic opportunities tailored to your needs and aspirations.
          </p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-left">
            <h3 className="text-xl font-semibold mb-4">Why sign up?</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Personalized experience</p>
                  <p className="text-sm opacity-80">Get recommendations based on your preferences and academic profile</p>
                </div>
              </li>
              <li className="flex">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Seamless applications</p>
                  <p className="text-sm opacity-80">Apply to multiple colleges and keep track of all your applications in one place</p>
                </div>
              </li>
              <li className="flex">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Scholarship alerts</p>
                  <p className="text-sm opacity-80">Never miss an opportunity with timely notifications about scholarships</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
              {getUserTypeIcon(formData.userType)}
            </div>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-gray-500 mt-2">Join thousands of students and institutions on UniPortal</p>
          </div>
          
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            {error && (
              <div className="bg-red-50 p-4 border-l-4 border-red-500 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-red-600">{error}</span>
              </div>
            )}
            
            <CardContent className="pt-6 pb-8 px-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Label className="text-gray-700 mb-3 block">I am a:</Label>
                  <RadioGroup 
                    value={formData.userType} 
                    onValueChange={handleUserTypeChange}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="relative">
                      <RadioGroupItem 
                        value="student" 
                        id="student" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="student" 
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                      >
                        <GraduationCap className="h-6 w-6 mb-2 text-gray-600 peer-data-[state=checked]:text-primary" />
                        <span className="text-sm font-medium">Student</span>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="institute" 
                        id="institute" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="institute" 
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                      >
                        <Building className="h-6 w-6 mb-2 text-gray-600 peer-data-[state=checked]:text-primary" />
                        <span className="text-sm font-medium">Institute</span>
                      </Label>
                    </div>
                    
                    <div className="relative">
                      <RadioGroupItem 
                        value="faculty" 
                        id="faculty" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="faculty" 
                        className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-gray-50"
                      >
                        <UserCheck className="h-6 w-6 mb-2 text-gray-600 peer-data-[state=checked]:text-primary" />
                        <span className="text-sm font-medium">Faculty</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 mt-4 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-95 transition-opacity"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-t-white border-white/30 rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Log in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
