import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useState } from "react";

export default function Navbar() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const { pathname } = useLocation();

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    nav(`/?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center gap-6">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-gray-900 font-bold text-xl tracking-tight hover:text-gray-700 transition-colors"
        >
          🧠 MindNest
        </Link>

        {/* Search Bar */}
        {/* <form
          onSubmit={onSearch}
          className="flex-1 max-w-xl flex items-center gap-2"
        >
          <Input
            placeholder="Search articles (e.g. anxiety, sleep, mindfulness)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-gray-50 border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Search
          </Button>
        </form> */}

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-gray-700 font-medium">
          <Link
            to="/articles"
            className={`hover:text-blue-600 transition-colors ${
              pathname === "/" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            About us
          </Link>

          <Link
            to="/articles"
            className={`hover:text-blue-600 transition-colors ${
              pathname === "/" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Why need us
          </Link>

          <Link
            to="/articles"
            className={`hover:text-blue-600 transition-colors ${
              pathname === "/" ? "text-blue-600 font-semibold" : ""
            }`}
          >
            Browse
          </Link>

          <SignedIn>
            <Link
              to="/admin"
              className={`hover:text-blue-600 transition-colors ${
                pathname === "/admin" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Admin
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
