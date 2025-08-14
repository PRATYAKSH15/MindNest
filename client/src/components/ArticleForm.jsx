import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ArticleForm({ initial, onSubmit, submitting }) {
  const [values, setValues] = useState({
    title: "",
    content: "",
    tags: "",
    author: "Admin",
  });

  useEffect(() => {
    if (initial) {
      setValues({
        title: initial.title ?? "",
        content: initial.content ?? "",
        tags: (initial.tags ?? []).join(", "),
        author: initial.author ?? "Admin",
      });
    }
  }, [initial]);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      title: values.title.trim(),
      content: values.content.trim(),
      author: values.author.trim() || "Admin",
      tags: values.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <Input name="title" value={values.title} onChange={handleChange} placeholder="Title" required />
      <Textarea name="content" value={values.content} onChange={handleChange} placeholder="Content" rows={8} required />
      <Input name="tags" value={values.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
      <Input name="author" value={values.author} onChange={handleChange} placeholder="Author" />
      <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Article"}</Button>
    </form>
  );
}
