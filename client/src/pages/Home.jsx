import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApi } from "../providers/ApiProvider";
import ArticleCard from "../components/ArticleCard.jsx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("q", search.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ✅ Same grid background as AdminDashboard */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),
                   linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
                   bg-[size:40px_40px]"
      />

      {/* Radial glow effect for depth */}
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Page Content */}
      <div className="relative px-4 sm:px-8 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Explore Mental Health Resources
          </motion.h1>
          <p className="text-gray-600 mt-3">
            Curated, searchable articles to help you improve your mental
            well-being and stay informed.
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 max-w-xl mx-auto mb-8"
        >
          <Input
            type="text"
            placeholder="🔍 Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Search
          </Button>
        </form>

        {/* Tag Filters */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Button
              size="sm"
              variant={tag ? "outline" : "default"}
              className="rounded-full px-4 py-1"
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
                className={`cursor-pointer rounded-full px-3 py-1 text-sm transition ${
                  tag === t
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 rounded-xl animate-pulse"
                ></div>
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">No articles found.</p>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArticleCard article={a} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
