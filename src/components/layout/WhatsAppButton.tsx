import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = "9779869637226";
  const message =
    "Hello! I'm interested in learning more about The New Vision Tuition Center.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  useEffect(() => {
    // Delay appearance for smooth entry
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Show tooltip after 3 seconds
    const tooltipTimeout = setTimeout(() => {
      setShowTooltip(true);
      // Hide tooltip after 5 seconds
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(tooltipTimeout);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 transition-all duration-300 ${showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
      >
        <div className="bg-card text-foreground text-sm px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          Need help? Chat with us! 💬
          <div className="absolute bottom-0 right-6 w-3 h-3 bg-card transform rotate-45 translate-y-1.5" />
        </div>
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 relative"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white relative z-10 group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
