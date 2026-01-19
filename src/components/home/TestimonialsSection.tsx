import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sita Thapa",
    role: "Parent of Class 10 Student",
    content: "The New Vision has transformed my son's approach to mathematics. His grades improved significantly in just 6 months. The teachers are incredibly patient and dedicated.",
    rating: 5,
    image: "ST",
  },
  {
    id: 2,
    name: "Bibek Sharma",
    role: "Class 12 Student - IOE Aspirant",
    content: "The faculty here truly understands the IOE entrance pattern. Their problem-solving techniques and regular mock tests are helping me prepare confidently. Great teaching!",
    rating: 5,
    image: "BS",
  },
  {
    id: 3,
    name: "Mrs. Kamala Adhikari",
    role: "Parent of Class 8 Student",
    content: "Small batch sizes mean my daughter gets personal attention. The regular parent-teacher meetings keep us informed about her progress. Highly recommend!",
    rating: 5,
    image: "KA",
  },
  {
    id: 4,
    name: "Rajan KC",
    role: "SEE Top Scorer",
    content: "Science concepts that seemed difficult became clear here. The practical teaching methods helped me score GPA 4.0 in SEE. Best tuition center in Dang!",
    rating: 5,
    image: "RK",
  },
  {
    id: 5,
    name: "Mina Gurung",
    role: "Parent of Class 11 Student",
    content: "Both my children study here and have shown remarkable improvement. The study material is comprehensive and the doubt-clearing sessions are invaluable.",
    rating: 5,
    image: "MG",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-12 md:py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">What Parents & Students Say</h2>
          <p className="section-subtitle">
            Real experiences from our community of successful students and satisfied parents.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Main Testimonial Card */}
          <div className="bg-card rounded-2xl p-6 md:p-10 shadow-xl border border-border relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 opacity-10">
              <Quote className="w-20 h-20 text-primary" />
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>

            {/* Content */}
            <p className="text-base md:text-lg text-foreground leading-relaxed mb-6 relative z-10">
              "{testimonials[currentIndex].content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-heading font-bold">
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
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all shadow-md"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-secondary"
                      : "bg-border hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all shadow-md"
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
