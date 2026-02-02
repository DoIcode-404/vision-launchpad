import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import img1 from "@/assets/img1.png";
import img2 from "@/assets/img2.png";
import img3 from "@/assets/img3.png";

const heroImages = [img1, img2, img3];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Growing Strong in Lamhi, Dang
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              <span className="text-primary-foreground">Learning Today,</span>
              <br />
              <span className="hero-text-gradient">Leading Tomorrow</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0">
              Expert guidance for Grades 1–12 in Science, Mathematics & Entrance
              Exams. Join our growing community of successful students in Dang.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  Book Free Demo Class <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/about" className="flex items-center gap-2">
                  <Play className="w-5 h-5" /> Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative animate-slide-in-right hidden lg:block">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl bg-transparent">
              {/* Image Container */}
              <div className="relative bg-transparent">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Education image ${index + 1}`}
                    className={`w-full h-auto block transition-opacity duration-1000 ease-in-out ${
                      index === currentIndex
                        ? "opacity-100 relative"
                        : "opacity-0 absolute inset-0"
                    }`}
                    style={{ backgroundColor: "transparent" }}
                  />
                ))}
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-5 -left-2 bg-card p-2 rounded-lg shadow-xl animate-float z-30">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-sm">🏆</span>
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-primary text-xs">
                      Top Rankers
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Every Year!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/30 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/30 rounded-full blur-xl" />
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
