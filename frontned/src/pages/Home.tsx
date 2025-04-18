import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mb-6">Welcome to UniPortal</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Your comprehensive platform for academic management, networking, and career opportunities
        </p>
        <div className="flex gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="lg">Explore Courses</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Academic Excellence</h3>
            <p className="text-gray-600">Access quality courses and learning resources</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Career Opportunities</h3>
            <p className="text-gray-600">Find internships and job placements</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Alumni Network</h3>
            <p className="text-gray-600">Connect with successful graduates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
