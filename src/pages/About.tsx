import Layout from "@/components/layout/Layout";
import {
  Target,
  Users,
  Award,
  Sparkles,
  GraduationCap,
  Heart,
  TrendingUp,
  Calendar,
  CheckCircle,
  ChevronRight,
  Star,
  Trophy,
  Zap,
  Clock,
  Brain,
  Shield,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useRef } from "react";
import AchyutImg from "@/assets/achyut.jpg";
import PuspaImg from "@/assets/puspa.jpg";
import YadavImg from "@/assets/yadav.jpeg";

const leadershipMembers = [
  {
    name: "Achyut Poudel",
    role: "Academic Incharge & Co-founder",
    specialization: "Mathematics & Physics",
    experience: "5+ Years",
    quote:
      "Education is not just about grades—it's about building confidence and character that lasts a lifetime.",
    message:
      "Every student has unique potential waiting to be unlocked. Our approach focuses on conceptual clarity and practical understanding. Over the years, I've witnessed countless students transform from hesitant learners to confident achievers through personalized attention and genuine care.",
    gradient: "from-primary via-secondary to-accent",
    icon: Brain,
    image: AchyutImg,
  },
  {
    name: "Puspa Bastola",
    role: "Co-founder & Director",
    specialization: "Science & Biology",
    experience: "Experienced Educator",
    quote:
      "Quality education should be accessible to every student, regardless of their background.",
    message:
      "Our vision has always been to create an inclusive learning environment where students feel valued and inspired. We don't just teach subjects; we nurture curiosity, build critical thinking skills, and instill confidence. Seeing our students succeed brings us immense satisfaction.",
    gradient: "from-secondary via-accent to-primary",
    icon: Heart,
    image: PuspaImg,
  },
  {
    name: "Harischandra Yadav",
    role: "Founder and Director",
    specialization: "Multi-disciplinary Excellence",
    experience: "10+ Years",
    quote:
      "There are no weak students, only different learning styles waiting to be discovered.",
    message:
      "Our small batch sizes allow personalized attention for each student. We track progress closely, identify struggles early, and provide targeted support. Through interactive sessions and continuous feedback, we make learning engaging and exam preparation effective.",
    gradient: "from-accent via-primary to-secondary",
    icon: Users,
    image: YadavImg,
  },
];

const timeline = [
  {
    year: "2023",
    title: "Foundation",
    description:
      "The New Vision Tuition Center was established in Lamhi, Dang with a vision to transform education.",
    icon: Sparkles,
  },
  {
    year: "2024",
    title: "Rapid Growth",
    description:
      "Expanded to 100+ students with exceptional board exam results and positive community feedback.",
    icon: TrendingUp,
  },
  {
    year: "2025",
    title: "Excellence Achieved",
    description:
      "Achieved 95% success rate in board exams and entrance tests, becoming a trusted name in Dang.",
    icon: Trophy,
  },
  {
    year: "2026",
    title: "Future Ready",
    description:
      "Continuing to innovate with modern teaching methods and expanding our impact in the community.",
    icon: Zap,
  },
];

const stats = [
  {
    label: "Active Students",
    value: 150,
    suffix: "+",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Success Rate",
    value: 95,
    suffix: "%",
    icon: Trophy,
    color: "text-green-600",
  },
  {
    label: "Expert Faculty",
    value: 2,
    suffix: "",
    icon: GraduationCap,
    color: "text-purple-600",
  },
  {
    label: "Years of Excellence",
    value: 3,
    suffix: "+",
    icon: Star,
    color: "text-orange-600",
  },
];

const values = [
  {
    icon: Brain,
    title: "Concept-Based Learning",
    description:
      "Deep understanding through clear fundamentals, not rote memorization.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Users,
    title: "Small Batch Sizes",
    description: "10-15 students per batch ensuring personalized attention.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Target,
    title: "Result Oriented",
    description:
      "Focused preparation for SEE, NEB board & entrance examinations.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Shield,
    title: "Supportive Environment",
    description: "Safe, encouraging space where every student feels valued.",
    gradient: "from-primary to-accent",
  },
];

const whyChooseUs = [
  {
    title: "Expert Faculty",
    description:
      "Learn from experienced educators passionate about student success.",
    icon: GraduationCap,
  },
  {
    title: "Proven Results",
    description: "95% success rate in board exams and entrance tests.",
    icon: CheckCircle,
  },
  {
    title: "Flexible Timings",
    description: "Multiple batch options to suit your schedule.",
    icon: Clock,
  },
  {
    title: "Affordable Fees",
    description: "Quality education at prices every family can afford.",
    icon: Award,
  },
  {
    title: "Regular Assessments",
    description: "Continuous evaluation to track and improve performance.",
    icon: BookOpen,
  },
  {
    title: "Doubt Clearing",
    description: "Dedicated sessions to resolve all your queries.",
    icon: Heart,
  },
];

const About = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set(),
  );
  const [currentLeader, setCurrentLeader] = useState(0);
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Auto-rotate leadership carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLeader((prev) => (prev + 1) % leadershipMembers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 },
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation - trigger on mount since stats appear in hero
  useEffect(() => {
    if (!hasAnimated) {
      setHasAnimated(true);
      stats.forEach((stat, index) => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounters((prev) => {
              const newCounters = [...prev];
              newCounters[index] = end;
              return newCounters;
            });
            clearInterval(timer);
          } else {
            setCounters((prev) => {
              const newCounters = [...prev];
              newCounters[index] = Math.floor(start);
              return newCounters;
            });
          }
        }, 16);
      });
    }
  }, [hasAnimated]);

  return (
    <Layout>
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 text-center text-white py-32">
          <div className="animate-slide-up">
            <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Established 2023 • Lamhi, Dang
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              About <span className="text-accent">The New Vision</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-300">
              Empowering students with quality education, experienced faculty,
              and personalized attention for academic excellence
            </p>

            {/* Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in animation-delay-500">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all hover:scale-105 hover-lift"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="font-bold text-3xl mb-1">
                    {counters[index]}
                    {stat.suffix}
                  </div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Journey Timeline */}
      <section
        id="timeline-section"
        ref={(el) => (sectionRefs.current["timeline-section"] = el)}
        className="py-20 bg-background relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Our Journey
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Growth Story
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small beginning to becoming a trusted name in education
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block" />

            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative mb-12 transition-all duration-700 ${
                  visibleSections.has("timeline-section")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="flex-1 md:text-right md:even:text-left">
                    <Card className="p-6 hover:shadow-lg transition-all hover-lift group">
                      <div className="flex items-start gap-4 md:block">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
                            {item.year}
                          </Badge>
                          <h3 className="font-heading text-xl font-bold text-primary mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Center Circle */}
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg hidden md:block flex-shrink-0" />

                  <div className="flex-1 hidden md:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Split */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-primary to-secondary text-white hover:shadow-2xl transition-all hover-lift relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                  Our Mission
                </h3>
                <p className="text-white/90 leading-relaxed">
                  To provide quality, affordable education that empowers
                  students with knowledge, confidence, and skills to excel in
                  academics and life. We are committed to creating an inclusive
                  learning environment where every student can thrive.
                </p>
              </div>
            </Card>

            <Card className="p-8 md:p-12 bg-gradient-to-br from-secondary to-accent text-white hover:shadow-2xl transition-all hover-lift relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                  Our Vision
                </h3>
                <p className="text-white/90 leading-relaxed">
                  To become the most trusted tuition center in Dang, recognized
                  for producing academically excellent, confident, and
                  well-rounded students who are prepared to face future
                  challenges with determination.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership Carousel */}
      <section
        id="leadership-section"
        ref={(el) => (sectionRefs.current["leadership-section"] = el)}
        className="py-20 bg-background relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Users className="w-4 h-4 mr-2" />
              Our Leadership
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Messages from Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from the dedicated educators committed to your success
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative min-h-[500px]">
              {leadershipMembers.map((leader, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    currentLeader === index
                      ? "opacity-100 scale-100 relative"
                      : "opacity-0 scale-95 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <Card className="overflow-hidden shadow-2xl">
                    <div
                      className={`bg-gradient-to-r ${leader.gradient} p-8 md:p-12 text-white relative`}
                    >
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="relative z-10 flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold flex-shrink-0 overflow-hidden">
                          {leader.image ? (
                            <img
                              src={leader.image}
                              alt={leader.name}
                              className="w-full h-full object-cover rounded-2xl"
                            />
                          ) : (
                            leader.name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                            {leader.name}
                          </h3>
                          <p className="text-white/90 mb-3">{leader.role}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-white/20 backdrop-blur text-white border-0">
                              <leader.icon className="w-4 h-4 mr-1" />
                              {leader.specialization}
                            </Badge>
                            <Badge className="bg-white/20 backdrop-blur text-white border-0">
                              {leader.experience}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 md:p-12">
                      <div className="relative mb-6 p-6 bg-muted/50 rounded-xl">
                        <Sparkles className="absolute top-4 left-4 w-6 h-6 text-primary/20" />
                        <p className="text-lg md:text-xl italic text-foreground pl-8">
                          "{leader.quote}"
                        </p>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {leader.message}
                      </p>
                      <div className="mt-6 pt-6 border-t flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-primary">
                            — {leader.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {leader.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {leadershipMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentLeader(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentLeader === index
                      ? "bg-primary w-8"
                      : "bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`View message ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Bento Grid */}
      <section
        id="values-section"
        ref={(el) => (sectionRefs.current["values-section"] = el)}
        className="py-20 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              What Sets Us Apart
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our teaching philosophy
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className={`p-6 hover:shadow-lg transition-all duration-500 hover:-translate-y-2 group ${
                  visibleSections.has("values-section")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2 group-hover:text-primary/80 transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section
        id="stats-section"
        ref={(el) => (sectionRefs.current["stats-section"] = el)}
        className="py-20 bg-gradient-to-br from-primary to-secondary text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Building a legacy of academic excellence in Dang
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-10 h-10 text-accent" />
                </div>
                <div className="font-heading text-4xl md:text-5xl font-bold mb-2">
                  {counters[index]}
                  {stat.suffix}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Award className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Your Success Is Our Priority
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six compelling reasons to join The New Vision
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all hover-lift group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:32px_32px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join The New Vision and experience the difference quality education
            makes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="hover:scale-105 transition-transform btn-ripple"
            >
              <Link to="/contact">
                <GraduationCap className="w-5 h-5 mr-2" />
                Book Free Demo Class
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 hover:scale-105 transition-all"
            >
              <Link to="/courses">View Our Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
