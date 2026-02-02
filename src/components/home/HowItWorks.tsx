import { Phone, UserPlus, BookOpen, Trophy } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const steps = [
  {
    step: 1,
    icon: Phone,
    title: "Contact Us",
    description:
      "Reach out via phone, WhatsApp, or visit our center for a free consultation.",
    color: "bg-blue-500",
  },
  {
    step: 2,
    icon: UserPlus,
    title: "Free Demo Class",
    description:
      "Attend a complimentary demo class to experience our teaching methodology firsthand.",
    color: "bg-secondary",
  },
  {
    step: 3,
    icon: BookOpen,
    title: "Join Your Batch",
    description:
      "Enroll in a batch suitable for your grade and schedule. Start your learning journey!",
    color: "bg-accent",
  },
  {
    step: 4,
    icon: Trophy,
    title: "Achieve Results",
    description:
      "With consistent effort and our guidance, achieve academic excellence and top grades.",
    color: "bg-primary",
  },
];

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 px-4 bg-muted/30 overflow-hidden"
    >
      <div className="container mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Your journey to academic success starts with four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`relative transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-1/2 z-0 transition-all duration-1000 ${isVisible ? "scale-x-100" : "scale-x-0"}`}
                  style={{
                    transitionDelay: `${(index + 1) * 200}ms`,
                    transformOrigin: "left",
                  }}
                >
                  <div
                    className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary transition-all duration-300 ${isVisible ? "scale-100" : "scale-0"}`}
                    style={{ transitionDelay: `${(index + 2) * 200}ms` }}
                  />
                </div>
              )}

              <div className="relative z-10 text-center group">
                {/* Step Number */}
                <div className="relative inline-block mb-4">
                  <div
                    className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <item.icon className="w-9 h-9 text-white group-hover:animate-bounce" />
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-secondary flex items-center justify-center text-xs font-bold text-primary shadow-md transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
                    style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  >
                    {item.step}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
