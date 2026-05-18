import { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";

const HOTLINES = [
  { name: "iCall", number: "9152987821" },
  { name: "Vandrevala Foundation", number: "1860-2662-345" },
  { name: "NIMHANS", number: "080-46110007" },
];

export default function CrisisBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("crisis_banner_dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("crisis_banner_dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 text-red-700 text-sm flex-wrap">
          <Phone size={14} className="flex-shrink-0" />
          <span className="font-semibold">In crisis? Help is available 24/7:</span>
          {HOTLINES.map((h) => (
            <a
              key={h.name}
              href={`tel:${h.number}`}
              className="font-bold underline hover:text-red-900 transition-colors"
            >
              {h.name}: {h.number}
            </a>
          ))}
        </div>
        <button
          onClick={dismiss}
          className="text-red-400 hover:text-red-600 flex-shrink-0 transition-colors"
          aria-label="Dismiss crisis banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
