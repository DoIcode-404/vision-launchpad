import Layout from "@/components/layout/Layout";
import { Target, Users, Award, Sparkles, GraduationCap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Concept-Based Learning",
    description: "Strong foundations through understanding, not memorization.",
  },
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "Personalized attention with only 10-15 students per batch.",
  },
  {
    icon: Award,
    title: "Result Oriented",
    description: "Focused preparation for SEE, NEB & entrance exams.",
  },
  {
    icon: Heart,
    title: "Supportive Environment",
    description: "A positive space where every student feels encouraged.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/4 w-48 h-48 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Est. 2023 • Lamhi, Dang
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About Us
            </h1>
            <p className="text-lg text-primary-foreground/80">
              A growing tuition center dedicated to helping students in Dang 
              achieve academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are - Compact */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center">
              {/* Stats Card */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-bold">2023</div>
                      <div className="text-sm text-primary-foreground/70">Established</div>
                    </div>
                  </div>
                  <div className="h-px bg-primary-foreground/20" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-heading text-2xl font-bold text-secondary">150+</div>
                      <div className="text-xs text-primary-foreground/70">Students</div>
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-bold text-secondary">2</div>
                      <div className="text-xs text-primary-foreground/70">Teachers</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="md:col-span-3 space-y-4">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary">
                  Our Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The New Vision Tuition Center was founded in 2023 in Lamhi, Dang with 
                  a simple goal: to provide quality education to students in our community. 
                  What started with a handful of students has quickly grown into a trusted 
                  learning center.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Led by dedicated educators Achyut Poudel and Puspa Bastola, we focus on 
                  building strong foundations in Science and Mathematics while preparing 
                  students for SEE, NEB board exams, and entrance examinations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Modern Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Mission */}
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Our Mission</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To provide quality, affordable education that empowers students 
                with knowledge and confidence to excel in academics and life.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-3">Our Vision</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To become the most trusted tuition center in Dang, known for 
                producing academically excellent and confident students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values - Horizontal Scroll on Mobile */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-2">
              What Sets Us Apart
            </h2>
            <p className="text-muted-foreground">Our teaching philosophy</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-muted/50 rounded-xl p-5 text-center hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <value.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-heading font-semibold text-primary mb-1 text-sm">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-muted-foreground mb-6">
              Take the first step towards academic success. Book a free demo class today.
            </p>
            <Button variant="default" size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
