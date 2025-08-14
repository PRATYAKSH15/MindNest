import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApi } from "../providers/ApiProvider";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

export default function CommentBox({ articleId }) {
  const api = useApi();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await api.get(`/api/comments/${articleId}`);
    setComments(data);
  };

  useEffect(() => {
    load();
  }, [articleId]);

  const add = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post("/api/comments", { articleId, content });
      setContent("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-3">
      <h4 className="font-semibold text-lg">Comments</h4>
      <div className="grid gap-2">
        {comments.length === 0 && <p className="text-sm opacity-70">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c._id} className="border rounded p-3">
            <div className="text-sm">{c.content}</div>
            <div className="text-xs opacity-60 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <SignedIn>
        <Textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={add} disabled={loading}>{loading ? "Posting..." : "Post Comment"}</Button>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline">Sign in to comment</Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
