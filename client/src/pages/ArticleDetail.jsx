import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../providers/ApiProvider";
import BookmarkButton from "../components/BookmarkButton.jsx";
import CommentBox from "../components/CommentBox.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ArticleDetail() {
  const api = useApi();
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/articles/${id}`);
      setArticle(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: article.title, text: "Check this out on MindNest", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  if (loading) return <p className="opacity-70">Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  return (
    <div className="grid gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <div className="text-sm opacity-70">By {article.author ?? "Admin"}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(article.tags ?? []).map((t) => <Badge key={t} variant="secondary">#{t}</Badge>)}
          </div>
        </div>
        <div className="flex gap-2">
          <BookmarkButton articleId={article._id} onChange={() => {}} />
          <Button variant="outline" onClick={share}>Share</Button>
        </div>
      </div>

      <article className="prose max-w-none dark:prose-invert">
        <p style={{ whiteSpace: "pre-wrap" }}>{article.content}</p>
      </article>

      <CommentBox articleId={article._id} />
    </div>
  );
}
