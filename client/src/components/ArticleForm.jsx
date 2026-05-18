import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";

export default function ArticleForm({ initial, onSubmit, submitting }) {
  const [values, setValues] = useState({ title: "", content: "", tags: "", author: "Admin" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (initial) {
      setValues({
        title: initial.title ?? "",
        content: initial.content ?? "",
        tags: (initial.tags ?? []).join(", "),
        author: initial.author ?? "Admin",
      });
      setImagePreview(initial.imageUrl || null);
    } else {
      setValues({ title: "", content: "", tags: "", author: "Admin" });
      setImagePreview(null);
    }
    setImageFile(null);
    setRemoveImage(false);
  }, [initial]);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2 MB. Please choose a smaller file.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", values.title.trim());
    fd.append("content", values.content.trim());
    fd.append("author", values.author.trim() || "Admin");
    fd.append("tags", values.tags);
    if (imageFile) fd.append("image", imageFile);
    if (removeImage) fd.append("removeImage", "true");
    onSubmit(fd);
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      <Input name="title" value={values.title} onChange={handleChange} placeholder="Title" required />
      <Textarea
        name="content"
        value={values.content}
        onChange={handleChange}
        placeholder="Content"
        rows={8}
        required
      />
      <Input name="tags" value={values.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
      <Input name="author" value={values.author} onChange={handleChange} placeholder="Author name" />

      {/* Image upload */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Cover Image <span className="text-gray-400 font-normal">(optional · max 2 MB)</span></p>

        {imagePreview && (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
            <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              Hover · click × to remove or choose new below
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          id="article-img"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="article-img"
          className="flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-600 transition-colors"
        >
          <ImagePlus size={17} />
          {imagePreview ? "Change image" : "Upload cover image"}
        </label>
      </div>

      <Button type="submit" disabled={submitting} className="mt-1">
        {submitting ? "Saving…" : "Save Article"}
      </Button>
    </form>
  );
}
