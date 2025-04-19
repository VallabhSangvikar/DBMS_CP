import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Mail, Lock, School, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  
  // Get the intended destination from location state or default to home
  const from = location.state?.from || '/'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    try {
      setError('')
      setLoading(true)
      
      // Call the login function from AuthContext with proper credentials object
      await login({ email, password })
      
      // Redirect to the intended destination
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to login. Please check your credentials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[85vh]">
      {/* Left side - Login form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
              <School className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome back to UniPortal</h1>
            <p className="text-gray-500 mt-2">Log in to your account to continue your academic journey</p>
          </div>
          
          <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
            {error && (
              <div className="bg-red-50 p-4 border-l-4 border-red-500 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-red-600">{error}</span>
              </div>
            )}
            
            <CardContent className="pt-6 pb-8 px-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-6 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-95 transition-opacity"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-t-white border-white/30 rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    'Log in'
                  )}
                </Button>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Right side - Hero image and content */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-primary to-accent text-white p-8 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <h2 className="text-3xl font-bold mb-6">Discover Your Academic Future</h2>
          <p className="text-lg opacity-90 mb-8">
            Explore top colleges, find the perfect courses, and connect with faculty members on your journey to academic success.
          </p>
          <div className="flex flex-col space-y-4 items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 w-full max-w-xs">
              <p className="text-sm mb-2 opacity-90">Benefits of joining UniPortal:</p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Explore 500+ colleges nationwide</span>
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Apply for courses with a single click</span>
                </li>
                <li className="flex items-center">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Track scholarship opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
