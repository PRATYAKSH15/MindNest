import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ArticleCard({ article }) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-sm transition">
      <Link to={`/article/${article._id}`}>
        <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
      </Link>
      <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(article.tags ?? []).map((t) => (
          <Badge key={t} variant="secondary">#{t}</Badge>
        ))}
      </div>
      <div className="text-xs opacity-70 mt-2">By {article.author ?? "Admin"}</div>
    </div>
  );
}
