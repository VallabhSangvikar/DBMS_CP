import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'

export default function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link to="/" className="text-xl font-bold">EduConnect</Link>
        
        <div className="mx-6 flex gap-6">
          <Button><Link to="/courses" className="text-foreground/60 hover:text-foreground">
            Courses
          </Link></Button>
          <Link to="/forum" className="text-foreground/60 hover:text-foreground">
            Forum
          </Link>
          <Link to="/reviews" className="text-foreground/60 hover:text-foreground">
            Reviews
          </Link>
          <Link to="/alumni-network" className="text-foreground/60 hover:text-foreground">
            Alumni
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Sign up</Link>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
