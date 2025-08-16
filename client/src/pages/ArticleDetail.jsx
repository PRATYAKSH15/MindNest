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

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading article...</p>;
  if (!article) return <p className="text-center text-red-500 mt-10">Article not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10 space-y-8">
      
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          
          {/* Title & Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{article.title}</h1>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              By <span className="font-medium">{article.author ?? "Admin"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(article.tags ?? []).map((t) => (
                <Badge key={t} variant="secondary" className="text-sm">#{t}</Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3 md:mt-0">
            <BookmarkButton articleId={article._id} onChange={() => {}} />
            <Button variant="outline" onClick={share}>Share</Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 prose max-w-none dark:prose-invert transition-all duration-300">
        <p style={{ whiteSpace: "pre-wrap" }}>{article.content}</p>
      </article>

      {/* Comments */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
        <CommentBox articleId={article._id} />
      </div>

    </div>
  );
}
