import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sita Thapa",
    role: "Parent of Class 10 Student",
    content:
      "The New Vision has transformed my son's approach to mathematics. His grades improved significantly in just 6 months. The teachers are incredibly patient and dedicated.",
    rating: 5,
    image: "ST",
  },
  {
    id: 2,
    name: "Bibek Sharma",
    role: "Class 12 Student - IOE Aspirant",
    content:
      "The faculty here truly understands the IOE entrance pattern. Their problem-solving techniques and regular mock tests are helping me prepare confidently. Great teaching!",
    rating: 5,
    image: "BS",
  },
  {
    id: 3,
    name: "Mrs. Kamala Adhikari",
    role: "Parent of Class 8 Student",
    content:
      "Small batch sizes mean my daughter gets personal attention. The regular parent-teacher meetings keep us informed about her progress. Highly recommend!",
    rating: 5,
    image: "KA",
  },
  {
    id: 4,
    name: "Rajan KC",
    role: "SEE Top Scorer",
    content:
      "Science concepts that seemed difficult became clear here. The practical teaching methods helped me score GPA 4.0 in SEE. Best tuition center in Dang!",
    rating: 5,
    image: "RK",
  },
  {
    id: 5,
    name: "Mina Gurung",
    role: "Parent of Class 11 Student",
    content:
      "Both my children study here and have shown remarkable improvement. The study material is comprehensive and the doubt-clearing sessions are invaluable.",
    rating: 5,
    image: "MG",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const changeTestimonial = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  const nextTestimonial = () => {
    changeTestimonial((currentIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    changeTestimonial(
      (currentIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 px-4 bg-background overflow-hidden"
    >
      <div className="container mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <h2 className="section-title">What Parents & Students Say</h2>
          <p className="section-subtitle">
            Real experiences from our community of successful students and
            satisfied parents.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto relative transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Main Testimonial Card */}
          <div className="bg-card rounded-2xl p-6 md:p-10 shadow-xl border border-border relative overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10 animate-pulse-scale">
              <Quote className="w-20 h-20 text-primary" />
            </div>

            {/* Stars */}
            <div
              className={`flex items-center gap-1 mb-4 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
            >
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-accent text-accent"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* Content */}
            <p
              className={`text-base md:text-lg text-foreground leading-relaxed mb-6 relative z-10 transition-all duration-300 ${isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
            >
              "{testimonials[currentIndex].content}"
            </p>

            {/* Author */}
            <div
              className={`flex items-center gap-3 transition-all duration-300 ${isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-heading font-bold hover:scale-110 transition-transform">
                {testimonials[currentIndex].image}
              </div>
              <div>
                <div className="font-heading font-semibold text-primary">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:scale-110 hover:-translate-x-1 transition-all shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => changeTestimonial(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-secondary"
                      : "w-2.5 bg-border hover:bg-muted-foreground hover:scale-125"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary hover:scale-110 hover:translate-x-1 transition-all shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
