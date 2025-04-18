import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const alumni = [
  {
    id: 1,
    name: "Sarah Johnson",
    graduationYear: 2020,
    company: "Google",
    role: "Software Engineer",
    location: "San Francisco",
    linkedin: "linkedin.com/sarah-johnson"
  },
  // Add more alumni...
]

export default function AlumniNetwork() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Alumni Network</h1>
        <Button>Connect with Alumni</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((person) => (
          <Card key={person.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`/avatars/${person.id}.png`} />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{person.name}</h3>
                <p className="text-sm text-gray-500">Class of {person.graduationYear}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{person.role}</p>
                <p className="text-blue-600">{person.company}</p>
                <p className="text-gray-500">📍 {person.location}</p>
                <Button variant="outline" className="w-full mt-4">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
