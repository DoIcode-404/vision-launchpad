import { useEffect, useState, useRef } from "react";
import { Users, Trophy, GraduationCap, Star } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 150,
    suffix: "+",
    label: "Students Enrolled",
    color: "text-secondary",
  },
  {
    icon: Trophy,
    value: 92,
    suffix: "%",
    label: "Success Rate",
    color: "text-accent",
  },
  {
    icon: GraduationCap,
    value: 45,
    suffix: "+",
    label: "Top Scorers",
    color: "text-secondary",
  },
  {
    icon: Star,
    value: 3,
    suffix: "+",
    label: "Years Growing",
    color: "text-accent",
  },
];

const useCountUp = (
  end: number,
  duration: number = 2000,
  start: boolean = false,
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

const StatCard = ({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  isVisible,
}: {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  color: string;
  isVisible: boolean;
}) => {
  const count = useCountUp(value, 2000, isVisible);

  return (
    <div className="text-center p-4 md:p-6">
      <div
        className={`w-14 h-14 mx-auto mb-3 rounded-full bg-primary-foreground/10 flex items-center justify-center`}
      >
        <Icon className={`w-7 h-7 ${color}`} />
      </div>
      <div className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-1">
        {count}
        <span className={color}>{suffix}</span>
      </div>
      <div className="text-primary-foreground/70 text-sm">{label}</div>
    </div>
  );
};

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-14 hero-gradient relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Our Results Speak for Themselves
          </h2>
          <p className="text-base text-primary-foreground/70 max-w-2xl mx-auto">
            Join our growing community of successful students achieving their
            academic goals.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
