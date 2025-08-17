import { useEffect, useState } from "react";
import { useApi } from "../providers/ApiProvider";
import { useUser } from "@clerk/clerk-react"; // ✅ get logged in user
import { Link } from "react-router-dom"; // ✅ back link
import ArticleForm from "../components/ArticleForm.jsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const api = useApi();
  const { user } = useUser(); // ✅ Clerk logged-in user
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!user) return; // wait for user
    setLoading(true);
    try {
      // ✅ only fetch this user's articles
      const { data } = await api.get(`/api/articles?authorId=${user.id}`);
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  const create = async (payload) => {
    setSaving(true);
    try {
      // ✅ always include current user as author
      await api.post("/api/articles", { ...payload, author: user.id });
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    try {
      await api.put(`/api/articles/${id}`, { ...payload, author: user.id });
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this article?")) return;
    await api.delete(`/api/articles/${id}`);
    await load();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Back to Resources */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
        >
          ← Back to Resources
        </Link>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
              <p className="text-sm text-muted-foreground">
                Manage and organize only your own articles
              </p>
            </div>

            <Dialog
              open={!!editing}
              onOpenChange={(o) => !o && setEditing(null)}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => setEditing({})}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editing?._id ? "Edit Article" : "Create Article"}
                  </DialogTitle>
                </DialogHeader>
                <ArticleForm
                  initial={editing && editing._id ? editing : null}
                  onSubmit={(payload) =>
                    editing?._id
                      ? update(editing._id, payload)
                      : create(payload)
                  }
                  submitting={saving}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Articles Section */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">No articles yet. 🚀</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Card
                  key={a._id}
                  className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{a.title}</CardTitle>
                    <CardDescription>
                      {(a.tags || []).length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {a.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No tags
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(a)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(a._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
