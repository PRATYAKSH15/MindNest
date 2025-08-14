import { Button } from "@/components/ui/button";
import { useApi } from "../providers/ApiProvider";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useState } from "react";

export default function BookmarkButton({ articleId, onChange }) {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      await api.post("/api/bookmarks/toggle", { articleId });
      onChange && onChange();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <Button onClick={toggle} variant="secondary" disabled={loading}>
          {loading ? "Updating..." : "Bookmark"}
        </Button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline">Sign in to bookmark</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
