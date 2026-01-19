import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Atom, FlaskConical, BookOpen, BrainCircuit, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  {
    icon: Calculator,
    title: "Mathematics",
    grades: "Grade 6-12",
    description: "Build strong foundations in algebra, geometry, calculus and more.",
    color: "bg-blue-500/10 text-blue-600",
    features: ["SEE & NEB Prep", "Problem Solving", "Board Prep"],
  },
  {
    icon: Atom,
    title: "Physics",
    grades: "Grade 11-12",
    description: "Master concepts from mechanics to modern physics with practical examples.",
    color: "bg-purple-500/10 text-purple-600",
    features: ["Concept Building", "Numerical Practice", "IOE/IOM Prep"],
  },
  {
    icon: FlaskConical,
    title: "Chemistry",
    grades: "Grade 11-12",
    description: "From organic to inorganic, understand chemistry through visualization.",
    color: "bg-green-500/10 text-green-600",
    features: ["Organic & Inorganic", "Physical Chemistry", "Lab Concepts"],
  },
  {
    icon: BookOpen,
    title: "Science",
    grades: "Grade 6-10",
    description: "Integrated science curriculum covering physics, chemistry and biology.",
    color: "bg-orange-500/10 text-orange-600",
    features: ["All Branches", "Practical Focus", "SEE Prep"],
  },
  {
    icon: BrainCircuit,
    title: "Biology",
    grades: "Grade 11-12",
    description: "Deep dive into life sciences from cells to ecosystems.",
    color: "bg-pink-500/10 text-pink-600",
    features: ["NEB Complete", "Diagram Mastery", "IOM Focus"],
  },
  {
    icon: Trophy,
    title: "Entrance Exams",
    grades: "Grade 10-12",
    description: "Specialized preparation for IOE, IOM, and other entrance exams.",
    color: "bg-amber-500/10 text-amber-600",
    features: ["IOE Entrance", "IOM Entrance", "Bridge Course"],
  },
];

const CoursesPreview = () => {
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">Our Courses</h2>
          <p className="section-subtitle">
            Comprehensive curriculum designed to build strong foundations and achieve 
            academic excellence at every level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.title}
              className="card-elevated rounded-2xl p-5 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl ${course.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <course.icon className="w-6 h-6" />
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-heading text-xl font-semibold text-primary">
                  {course.title}
                </h3>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                  {course.grades}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3">
                {course.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {course.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              
              <Link
                to="/courses"
                className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="default" size="lg" asChild>
            <Link to="/courses" className="flex items-center gap-2">
              View All Courses <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesPreview;
