import {
  Award,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Star,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const trustItems = [
  {
    icon: Award,
    title: "10+ Years",
    description: "Experience in Education",
  },
  {
    icon: GraduationCap,
    title: "Qualified Faculty",
    description: "Expert Teachers",
  },
  {
    icon: Users,
    title: "Small Batches",
    description: "Personal Attention",
  },
  {
    icon: ClipboardCheck,
    title: "Regular Tests",
    description: "Weekly Assessments",
  },
  {
    icon: BookOpen,
    title: "Study Material",
    description: "Comprehensive Notes",
  },
  {
    icon: Star,
    title: "Proven Results",
    description: "Top Grades Every Year",
  },
];

const TrustIndicators = () => {
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
      className="py-10 md:py-14 px-4 bg-background overflow-hidden"
    >
      <div className="container mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="section-title">Why Parents Trust Us</h2>
          <p className="section-subtitle">
            We've built our reputation on consistent results, caring teachers,
            and a nurturing environment for every student.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`card-elevated rounded-xl p-4 text-center group hover-lift transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <item.icon className="w-6 h-6 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-1 group-hover:text-secondary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
