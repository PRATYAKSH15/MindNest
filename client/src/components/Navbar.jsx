import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { ChevronDown } from "lucide-react";

const TOOLS = [
  { label: "Self-Assessment", to: "/assessment", emoji: "📋" },
  { label: "Mood Tracker", to: "/mood", emoji: "📊" },
  { label: "Breathing Exercises", to: "/breathing", emoji: "🌬️" },
  { label: "Weekly Report", to: "/report", emoji: "📈" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  const mainLinks = [
    { label: "Home", to: "/" },
    { label: "Resources", to: "/articles" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/#contact", isAnchor: true },
  ];

  const isToolActive = TOOLS.some((t) => pathname === t.to);

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
          {mainLinks.map(({ label, to, isAnchor }) =>
            isAnchor ? (
              <HashLink
                key={label}
                smooth
                to={to}
                className="relative group hover:text-blue-600 transition-colors"
              >
                {label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full" />
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
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full" />
              </Link>
            )
          )}

          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-1 outline-none transition-colors ${
                isToolActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }`}
            >
              Tools
              <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {TOOLS.map(({ label, to, emoji }) => (
                <DropdownMenuItem key={to} asChild>
                  <Link
                    to={to}
                    className={`flex items-center gap-2 cursor-pointer ${
                      pathname === to ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    <span>{emoji}</span>
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side: auth */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link
              to="/profile"
              className={`hidden md:block hover:text-blue-600 transition-colors text-sm font-medium ${
                pathname === "/profile" ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              My Profile
            </Link>
            <Link
              to="/admin"
              className={`hidden md:block hover:text-blue-600 transition-colors text-sm font-medium ${
                pathname === "/admin" ? "text-blue-600 font-semibold" : "text-gray-700"
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
