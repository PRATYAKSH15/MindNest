import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Home from "./pages/Home.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import AssessmentPage from "./pages/AssessmentPage.jsx";
import MoodTrackerPage from "./pages/MoodTrackerPage.jsx";
import BreathingPage from "./pages/BreathingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WeeklyReportPage from "./pages/WeeklyReportPage.jsx";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Navbar />

      {/* Main content area with full-width background */}
      <main className="w-full px-4 py-6">
        <Routes>
          {/* ✅ Landing Page is now default */}
          <Route path="/" element={<LandingPage />} />

          {/* About Page */}
          <Route path="/about" element={<AboutPage />} /> {/* 👈 Added */}

          {/* Articles listing page */}
          <Route path="/articles" element={<Home />} />

          {/* Self-assessment quizzes */}
          <Route path="/assessment" element={<AssessmentPage />} />

          {/* Mood tracker */}
          <Route path="/mood" element={<MoodTrackerPage />} />

          {/* Breathing exercises */}
          <Route path="/breathing" element={<BreathingPage />} />

          {/* User profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Weekly report */}
          <Route path="/report" element={<WeeklyReportPage />} />

          {/* Article details */}
          <Route path="/article/:id" element={<ArticleDetail />} />

          {/* Admin Dashboard */}
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

          {/* Not Found */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

      {/* ✅ Sonner toaster */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
