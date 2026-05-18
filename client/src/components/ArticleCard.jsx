import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function ArticleCard({ article }) {
  return (
    <div className="rounded-xl border hover:shadow-md transition-shadow overflow-hidden bg-white flex flex-col">
      {article.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/article/${article._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{article.content}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(article.tags ?? []).map((t) => (
            <Badge key={t} variant="secondary">#{t}</Badge>
          ))}
        </div>
        <div className="text-xs opacity-60 mt-2">By {article.author ?? "Admin"}</div>
      </div>
    </div>
  );
}
