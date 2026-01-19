import { X, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="announcement-banner relative">
      <div className="container mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>
          <strong>Admissions Open!</strong> Limited seats for 2024-25 batch.{" "}
          <Link to="/contact" className="underline font-semibold hover:no-underline">
            Enquire Now →
          </Link>
        </span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-success-foreground/10 rounded transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
