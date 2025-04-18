import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import FacultyService from '@/services/faculty.service'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function FacultyDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [applications, setApplications] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [invitations, setInvitations] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to fetch real data
        const [profileData, applicationsData] = await Promise.all([
          FacultyService.getProfile().catch(() => null),
          FacultyService.getApplications().catch(() => [])
        ])
        
        setProfile(profileData)
        setApplications(applicationsData || [])
        
        // Check for pending invitations if faculty doesn't have a profile yet
        if (!profileData) {
          try {
            // This would need to be implemented in the backend - 
            // checking for invitations sent to the faculty's email
            const invitationsData = await FacultyService.getFacultyInvitations(user?.email || '')
            setInvitations(invitationsData || [])
          } catch (err) {
            console.error("Error fetching invitations:", err)
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.email])

  const getPendingApplicationsCount = () => {
    return applications.filter(app => app.status === 'pending').length
  }

  const getApprovedApplicationsCount = () => {
    return applications.filter(app => app.status === 'approved').length
  }

  const getRejectedApplicationsCount = () => {
    return applications.filter(app => app.status === 'rejected').length
  }

  const getApplicationStats = () => {
    const pending = getPendingApplicationsCount()
    const approved = getApprovedApplicationsCount()
    const rejected = getRejectedApplicationsCount()

    return [
      { name: 'Pending', value: pending , color: '#f59e0b' },
      { name: 'Approved', value: approved, color: '#10b981' },
      { name: 'Rejected', value: rejected , color: '#ef4444' }
    ]
  }

  const handleUpdateStatus = (applicationId: number, status: string) => {
    // Get comments if rejecting
    let comments = ''
    if (status === 'rejected') {
      comments = window.prompt('Add rejection comments (optional):') || ''
    } else if (status === 'approved') {
      comments = window.prompt('Add approval comments (optional):') || ''
    }

    // Call API to update status
    FacultyService.updateApplicationStatus(applicationId, { status, comments })
      .then(() => {
        // Update local state to reflect the change
        setApplications(applications.map(app => {
          if (app.application_id === applicationId) {
            return { ...app, status, comments: comments || app.comments }
          }
          return app
        }))
      })
      .catch(err => {
        console.error(err)
        alert('Failed to update application status')
      })
  }

  if (loading) {
    return <div className="p-4">Loading faculty dashboard...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Faculty Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 p-3 rounded border border-red-200 text-red-600 mb-4">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-gray-500">{profile.department}</p>
                <p className="text-gray-500">{profile.college_name}</p>
              </div>
            ) : (
              <p className="text-amber-600">Profile not completed</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant={profile ? "outline" : "default"}>
              <Link to={profile ? "/dashboard/faculty/profile/edit" : "/dashboard/faculty/profile/create"}>
                {profile ? "Edit Profile" : "Complete Profile"}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{getPendingApplicationsCount()}</p>
            <p className="text-gray-500">Require your review</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline">
              <Link to="#applications">Review Applications</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>College Information</CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <p>{profile.college_name}</p>
            ) : (
              <p className="text-gray-500">Complete your profile to see college details</p>
            )}
          </CardContent>
          <CardFooter>
            {profile && (
              <Button asChild variant="outline">
                <Link to={`/colleges/${profile.college_id}`}>View College</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Show pending invitations if no profile exists yet */}
      {!profile && invitations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">College Invitations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((invitation) => (
              <Card key={invitation.invitation_id}>
                <CardHeader>
                  <CardTitle>Invitation from {invitation.college_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>You've been invited to join as faculty in the {invitation.department} department.</p>
                    <p><span className="font-medium">College:</span> {invitation.college_name}</p>
                    <p><span className="font-medium">Department:</span> {invitation.department}</p>
                    <p><span className="font-medium">Sent on:</span> {new Date(invitation.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      try {
                        await FacultyService.respondToInvitation(invitation.invitation_id, false);
                        setInvitations(invitations.filter(inv => inv.invitation_id !== invitation.invitation_id));
                      } catch (err) {
                        console.error("Failed to reject invitation", err);
                      }
                    }}
                  >
                    Decline
                  </Button>
                  <Button 
                    onClick={async () => {
                      try {
                        await FacultyService.respondToInvitation(invitation.invitation_id, true);
                        // After accepting an invitation, navigate to profile creation
                        window.location.href = "/dashboard/faculty/profile/create";
                      } catch (err) {
                        console.error("Failed to accept invitation", err);
                      }
                    }}
                  >
                    Accept & Create Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {applications.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getApplicationStats()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {getApplicationStats().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center">No applications data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Applications Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Recent Applications</h3>
                {applications.length === 0 ? (
                  <p className="text-gray-500">No applications to display</p>
                ) : (
                  <div className="space-y-2">
                    {applications.slice(0, 3).map(app => (
                      <div key={app.application_id} className="p-2 border rounded flex justify-between items-center">
                        <div>
                          <p className="font-medium">{app.student_name}</p>
                          <p className="text-sm text-gray-500">{app.course_name}</p>
                        </div>
                        <Badge 
                          variant={
                            app.status === 'approved' ? 'default' :
                            app.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="#applications">View All Applications</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div id="applications" className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Course Applications</h2>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">No applications have been submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map(application => (
              <Card key={application.application_id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{application.student_name}</CardTitle>
                    <Badge 
                      variant={
                        application.status === 'approved' ? 'default' :
                        application.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium">{application.course_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application Date</p>
                      <p>{new Date(application.application_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p>{application.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Entrance Exam Score</p>
                      <p>{application.entrance_exam_percentile}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stream</p>
                      <p>{application.stream}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{application.student_email}</p>
                    </div>
                  </div>
                  
                  {application.comments && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="italic">{application.comments}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {application.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(application.application_id, 'rejected')}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(application.application_id, 'approved')}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
