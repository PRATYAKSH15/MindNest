import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../providers/ApiProvider";
import ArticleCard from "../components/ArticleCard.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const api = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(q);

  const load = async () => {
    setLoading(true);
    try {
      const url = q
        ? `/api/articles/search?q=${encodeURIComponent(q)}`
        : "/api/articles";
      const { data } = await api.get(url);
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [q]);

  const tags = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => (a.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const filtered = useMemo(() => {
    if (!tag) return articles;
    return articles.filter((a) => (a.tags || []).includes(tag));
  }, [articles, tag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // ✅ Prevent redirect
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Explore Resources</h1>
        <p className="text-sm opacity-80">
          Curated, searchable mental health articles.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <Input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Tag Filters */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={tag ? "outline" : "default"}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete("tag");
              setSearchParams(params);
            }}
          >
            All
          </Button>
          {tags.map((t) => (
            <Badge
              key={t}
              className={`cursor-pointer ${tag === t ? "ring-2 ring-primary" : ""}`}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("tag", t);
                setSearchParams(params);
              }}
            >
              #{t}
            </Badge>
          ))}
        </div>
      )}

      {/* Article List */}
      {loading ? (
        <p className="opacity-70">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="opacity-70">No articles found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
