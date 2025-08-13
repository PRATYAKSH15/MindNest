import './App.css'
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'

function App() {
  const { getToken, isSignedIn } = useAuth();

  const handleGetToken = async () => {
    if (!isSignedIn) {
      console.log("❌ Not signed in");
      return;
    }
    try {
      const token = await getToken({ template: 'backend' }); // JWT template from Clerk dashboard
      console.log("🔑 Clerk JWT Token:", token);
      alert("Token logged in console. Copy it for Postman!");
    } catch (err) {
      console.error("Error getting token:", err);
    }
  };

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
        <Button onClick={handleGetToken} variant="secondary">
          Get Clerk Token
        </Button>
      </SignedIn>
    </div>
  );
}

export default App;
