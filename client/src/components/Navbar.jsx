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
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">🧠 MindNest</Link>

        <form onSubmit={onSearch} className="flex-1 max-w-xl flex items-center gap-2">
          <Input
            placeholder="Search articles (e.g. anxiety, sleep, mindfulness)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>

        <nav className="flex items-center gap-3">
          <Link to="/" className={pathname === "/" ? "underline" : ""}>Browse</Link>
          <SignedIn>
            <Link to="/admin" className={pathname === "/admin" ? "underline" : ""}>
              Admin
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}
