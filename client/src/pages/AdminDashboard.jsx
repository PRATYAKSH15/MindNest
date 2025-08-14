import { useEffect, useState } from "react";
import { useApi } from "../providers/ApiProvider";
import ArticleForm from "../components/ArticleForm.jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const api = useApi();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/articles");
      setArticles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (payload) => {
    setSaving(true);
    try {
      await api.post("/api/articles", payload);
      await load();
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const update = async (id, payload) => {
    setSaving(true);
    try {
      await api.put(`/api/articles/${id}`, payload);
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
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({})}>New Article</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing?._id ? "Edit Article" : "Create Article"}</DialogTitle>
            </DialogHeader>
            <ArticleForm
              initial={editing && editing._id ? editing : null}
              onSubmit={(payload) =>
                editing?._id ? update(editing._id, payload) : create(payload)
              }
              submitting={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="opacity-70">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="opacity-70">No articles yet.</p>
      ) : (
        <div className="grid gap-3">
          {articles.map((a) => (
            <div key={a._id} className="border rounded p-4 flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs opacity-70">{(a.tags || []).join(", ")}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(a)}>Edit</Button>
                <Button variant="destructive" onClick={() => remove(a._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
