import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-education.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Growing Strong in Lamhi, Dang
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Empowering Students for a{" "}
              <span className="hero-text-gradient">Brighter Academic Future</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto lg:mx-0">
              Expert guidance for Grades 6–12 in Science, Mathematics & Entrance Exams. 
              Join our growing community of successful students in Dang.
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

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-primary-foreground/10">
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                  150+
                </div>
                <div className="text-sm text-primary-foreground/70">Students Taught</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                  92%
                </div>
                <div className="text-sm text-primary-foreground/70">Success Rate</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                  2
                </div>
                <div className="text-sm text-primary-foreground/70">Expert Faculty</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-slide-in-right hidden lg:block">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Students learning in classroom"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <div className="font-heading font-bold text-primary">Top Rankers</div>
                    <div className="text-sm text-muted-foreground">Every Year!</div>
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
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
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
