import './App.css'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'

function App() {

  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-background text-foreground">
      <Button>Click me!</Button>

      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default App
