import { Link } from "react-router-dom";
import { ArrowRight, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getIcon } from "@/lib/icons";

interface Course {
  id: string;
  title: string;
  description: string;
  grades: string[];
  category: string;
  duration?: string;
  instructor?: string;
  iconName?: string;
  features?: string[];
  batchSize?: string;
}

const defaultCourses = [
  {
    icon: "Calculator",
    title: "Mathematics",
    grades: "Grade 6-12",
    description:
      "Build strong foundations in algebra, geometry, calculus and more.",
    color: "bg-blue-500/10 text-blue-600",
    features: ["SEE & NEB Prep", "Problem Solving", "Board Prep"],
  },
  {
    icon: "Atom",
    title: "Physics",
    grades: "Grade 11-12",
    description:
      "Master concepts from mechanics to modern physics with practical examples.",
    color: "bg-purple-500/10 text-purple-600",
    features: ["Concept Building", "Numerical Practice", "IOE/IOM Prep"],
  },
  {
    icon: "FlaskConical",
    title: "Chemistry",
    grades: "Grade 11-12",
    description:
      "From organic to inorganic, understand chemistry through visualization.",
    color: "bg-green-500/10 text-green-600",
    features: ["Organic & Inorganic", "Physical Chemistry", "Lab Concepts"],
  },
];

const CoursesPreview = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"), limit(6));
        const querySnapshot = await getDocs(q);
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];

        if (coursesData.length === 0) {
          setCourses(defaultCourses as any);
        } else {
          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(defaultCourses as any);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
          <h2 className="section-title">Our Courses</h2>
          <p className="section-subtitle">
            Comprehensive curriculum designed to build strong foundations and
            achieve academic excellence at every level.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const IconComponent = course.iconName
                  ? getIcon(course.iconName)
                  : null;
                const gradeDisplay = course.grades?.join(", ") || "All";

                return (
                  <div
                    key={course.id}
                    className={`card-elevated rounded-2xl p-5 group cursor-pointer hover-lift transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {IconComponent && (
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <IconComponent className="w-6 h-6 icon-bounce" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-xl font-semibold text-primary">
                        {course.title}
                      </h3>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/10 text-secondary">
                        {gradeDisplay}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3">
                      {course.description}
                    </p>

                    {course.features && course.features.length > 0 && (
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
                    )}

                    {course.duration && (
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Duration:</strong> {course.duration}
                      </p>
                    )}

                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                    >
                      Learn More{" "}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Button variant="default" size="lg" asChild>
                <Link to="/courses" className="flex items-center gap-2">
                  View All Courses <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CoursesPreview;
