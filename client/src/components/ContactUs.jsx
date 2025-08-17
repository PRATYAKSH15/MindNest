import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("✅ Thanks for reaching out! We’ll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        const data = await res.json();
        setStatus(`❌ ${data.error || "Something went wrong."}`);
      }
    } catch (err) {
      setStatus("❌ Could not connect to server. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-muted" id="contact">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-8">
          Have feedback, suggestions, or just want to say hello? Fill out the
          form below — we’d love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <Input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <Textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            required
          />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </section>
  );
}
