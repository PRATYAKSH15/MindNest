// import './App.css'
// import { Button } from '@/components/ui/button'
// import { SignInButton, UserButton, SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'

// function App() {
//   const { getToken, isSignedIn } = useAuth();

//   const handleGetToken = async () => {
//     if (!isSignedIn) {
//       console.log("❌ Not signed in");
//       return;
//     }
//     try {
//       const token = await getToken({ template: 'backend' }); // JWT template from Clerk dashboard
//       console.log("🔑 Clerk JWT Token:", token);
//       alert("Token logged in console. Copy it for Postman!");
//     } catch (err) {
//       console.error("Error getting token:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-background text-foreground">
//       <Button>Click me!</Button>

//       <SignedOut>
//         <SignInButton mode="modal">
//           <Button variant="outline">Sign In</Button>
//         </SignInButton>
//       </SignedOut>

//       <SignedIn>
//         <UserButton />
//         <Button onClick={handleGetToken} variant="secondary">
//           Get Clerk Token
//         </Button>
//       </SignedIn>
//     </div>
//   );
// }

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Toaster } from "sonner"; // ✅ Use Sonner instead of ShadCN toaster

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminDashboard />
                </SignedIn>
                <SignedOut>
                  <div className="flex flex-col gap-4 items-start">
                    <p className="text-sm opacity-80">
                      Please sign in to access the admin dashboard.
                    </p>
                    <SignInButton mode="modal">
                      <button className="underline">Sign In</button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
      {/* ✅ Sonner toaster for notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
}