import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "@/components/ui/button";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { label: "Home", to: "/" },
    { label: "About Us", to: "/about" },
    { label: "Why It Matters", to: "/#whymatters", isAnchor: true },
    { label: "Resources", to: "/articles" },
    { label: "Contact Us", to: "/#contact", isAnchor: true },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-gray-900 font-extrabold text-2xl tracking-tight hover:text-blue-600 transition-colors"
        >
          🧠 MindNest
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
          {links.map(({ label, to, isAnchor }) =>
            isAnchor ? (
              <HashLink
                key={label}
                smooth
                to={to}
                className="relative group hover:text-blue-600 transition-colors"
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
              </HashLink>
            ) : (
              <Link
                key={label}
                to={to}
                className={`relative group transition-colors ${
                  pathname === to
                    ? "text-blue-600 font-semibold"
                    : "hover:text-blue-600"
                }`}
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            )
          )}
        </nav>

        {/* Right side: auth */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              to="/admin"
              className={`hidden md:block hover:text-blue-600 transition-colors ${
                pathname === "/admin" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              My Articles
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
