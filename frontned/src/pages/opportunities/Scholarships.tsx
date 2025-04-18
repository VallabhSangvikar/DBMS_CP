import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const scholarships = [
  {
    id: 1,
    name: "Merit Scholarship 2024",
    amount: "$5000",
    deadline: "2024-05-01",
    eligibility: "CGPA above 3.5",
    requirements: ["Academic excellence", "Leadership qualities"],
    remainingDays: 30
  },
  // Add more scholarships...
]

export default function Scholarships() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scholarship Opportunities</h1>
        <Button>Filter Scholarships</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scholarships.map((scholarship) => (
          <Card key={scholarship.id}>
            <CardHeader>
              <h3 className="text-xl font-semibold">{scholarship.name}</h3>
              <p className="text-2xl text-green-600 font-bold">{scholarship.amount}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Eligibility</p>
                  <p className="text-gray-600">{scholarship.eligibility}</p>
                </div>
                <div>
                  <p className="font-medium">Requirements</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {scholarship.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {scholarship.remainingDays} days remaining
                  </p>
                  <Progress value={scholarship.remainingDays} max={90} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Apply Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
