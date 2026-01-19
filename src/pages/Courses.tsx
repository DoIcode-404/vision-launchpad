import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Atom,
  FlaskConical,
  BookOpen,
  BrainCircuit,
  Trophy,
  Clock,
  Users,
  User,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getIcon } from "@/lib/icons";
import { SkeletonGrid } from "@/components/SkeletonLoader";

// Fallback courses if Firestore is empty
const defaultCourses = [
  {
    id: "1",
    icon: Calculator,
    title: "Mathematics",
    grades: ["6", "7", "8", "9", "10", "11", "12"],
    description:
      "Build strong foundations in algebra, geometry, trigonometry, calculus and more with our comprehensive math program.",
    features: [
      "SEE & NEB Curriculum",
      "Board Exam Preparation",
      "Competitive Exam Focus",
      "Weekly Tests & Assessments",
      "Doubt Clearing Sessions",
    ],
    duration: "12 months",
    batchSize: "10-15 students",
    category: "Core",
    instructor: "Expert Faculty",
  },
  {
    id: "2",
    icon: Atom,
    title: "Physics",
    grades: ["11", "12"],
    description:
      "Master concepts from mechanics to modern physics with practical examples, numerical practice, and exam-focused preparation.",
    features: [
      "Concept Building & Visualization",
      "Numerical Problem Practice",
      "IOE/IOM Pattern Questions",
      "Lab Concepts & Practicals",
      "Previous Year Paper Analysis",
    ],
    duration: "12 months",
    batchSize: "10-15 students",
    category: "Science",
    instructor: "Expert Faculty",
  },
  {
    id: "3",
    icon: FlaskConical,
    title: "Chemistry",
    grades: ["11", "12"],
    description:
      "From organic to inorganic, understand chemistry through visualization, reactions mechanisms, and practical applications.",
    features: [
      "Organic Chemistry Mastery",
      "Inorganic Chemistry Shortcuts",
      "Physical Chemistry Numericals",
      "Reaction Mechanism Focus",
      "NEB + Entrance Topics",
    ],
    duration: "12 months",
    batchSize: "10-15 students",
    category: "Science",
  },
  {
    id: "4",
    icon: BookOpen,
    title: "Science (Integrated)",
    grades: ["6", "7", "8", "9", "10"],
    description:
      "Complete science curriculum covering physics, chemistry, and biology with emphasis on conceptual understanding.",
    features: [
      "All Three Branches Covered",
      "Practical & Theory Balance",
      "SEE Preparation",
      "Regular Lab Activities",
      "Board Exam Excellence",
    ],
    duration: "12 months",
    batchSize: "15-20 students",
    category: "Core",
  },
  {
    id: "5",
    icon: BrainCircuit,
    title: "Biology",
    grades: ["11", "12"],
    description:
      "Deep dive into life sciences from cells to ecosystems with visual learning aids and IOM-focused preparation.",
    features: [
      "NEB Line-by-Line Coverage",
      "Diagram Mastery Techniques",
      "IOM Pattern Questions",
      "Assertion-Reason Practice",
      "Ecology & Human Physiology",
    ],
    duration: "12 months",
    batchSize: "10-15 students",
    category: "Science",
  },
  {
    id: "6",
    icon: Trophy,
    title: "SEE Preparation",
    grades: ["9", "10"],
    description:
      "Comprehensive SEE exam preparation covering all core subjects with focus on securing top grades.",
    features: [
      "Strong Foundation Building",
      "All Subject Coverage",
      "Model Question Practice",
      "Previous Year Analysis",
      "Mock Exam Series",
    ],
    duration: "12 months",
    batchSize: "12-15 students",
    category: "Competitive",
  },
  {
    id: "7",
    icon: Trophy,
    title: "IOE Entrance Prep",
    grades: ["11", "12"],
    description:
      "Intensive preparation for IOE Entrance with comprehensive coverage of Physics, Chemistry, and Mathematics.",
    features: [
      "Complete PCM Syllabus",
      "Previous Year Analysis",
      "Regular Mock Tests",
      "Rank Improvement Program",
      "Personal Mentoring",
    ],
    duration: "12 months",
    batchSize: "10-12 students",
    category: "Competitive",
  },
  {
    id: "8",
    icon: Trophy,
    title: "IOM Entrance Prep",
    grades: ["11", "12"],
    description:
      "Comprehensive IOM entrance preparation covering Physics, Chemistry, Biology, and Zoology with focus on high-yield topics.",
    features: [
      "Complete PCB Coverage",
      "NEB Syllabus Emphasis",
      "Question Bank Practice",
      "Weekly Full-Length Tests",
      "Merit Improvement Focus",
    ],
    duration: "12 months",
    batchSize: "10-12 students",
    category: "Competitive",
  },
];

const categories = ["All", "Core", "Science", "Competitive"];
const gradeFilters = ["All Grades", "6-10", "11-12"];

interface Course {
  id: string;
  title: string;
  description: string;
  grades: string[];
  duration: string;
  instructor?: string;
  category: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconName?: string;
  features?: string[];
  batchSize?: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];

      if (coursesData.length === 0) {
        setCourses(defaultCourses);
      } else {
        setCourses(coursesData);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses(defaultCourses);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const categoryMatch =
      selectedCategory === "All" || course.category === selectedCategory;

    let gradeMatch = true;
    if (selectedGrade === "6-10") {
      gradeMatch = course.grades.some((g) =>
        ["6", "7", "8", "9", "10"].includes(g),
      );
    } else if (selectedGrade === "11-12") {
      gradeMatch = course.grades.some((g) => ["11", "12"].includes(g));
    }

    return categoryMatch && gradeMatch;
  });

  if (loading) {
    return (
      <Layout>
        <div className="section-padding">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <div className="h-10 bg-muted rounded w-1/2 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 mx-auto animate-pulse" />
            </div>
            <SkeletonGrid count={6} />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section - Compact */}
      {/* Hero Section - Compact */}
      <section className="hero-gradient pt-28 pb-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Our Courses
            </h1>
            <p className="text-base md:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Comprehensive curriculum designed to build strong foundations and
              achieve academic excellence from Grade 6 to competitive exams.
            </p>
          </div>
        </div>
        {/* Bottom curve divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6 bg-muted/30"
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)",
          }}
        />
      </section>

      {/* Filters - Unified Container */}
      <section className="py-4 bg-muted/30 sticky top-16 z-40 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="bg-background rounded-xl shadow-sm border border-border/50 p-3 md:p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category Filters - Left */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
                <span className="text-xs font-medium text-muted-foreground mr-2 hidden sm:block">
                  Category:
                </span>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-secondary text-secondary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Divider for mobile */}
              <div className="w-full h-px bg-border/50 md:hidden" />

              {/* Grade Filters - Right */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground mr-2 hidden sm:block">
                  Grade:
                </span>
                {gradeFilters.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      selectedGrade === grade
                        ? "bg-secondary text-secondary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredCourses.length} course
                {filteredCourses.length !== 1 ? "s" : ""}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-background rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border/30 flex flex-col h-full"
                  >
                    <div className="p-5 md:p-6 flex flex-col h-full">
                      {/* Header with icon and grade badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                          {(() => {
                            let IconComponent;
                            if (course.iconName) {
                              IconComponent = getIcon(course.iconName);
                            } else if (course.icon) {
                              IconComponent = course.icon;
                            } else {
                              IconComponent = BookOpen;
                            }
                            return (
                              <IconComponent className="w-6 h-6 text-secondary" />
                            );
                          })()}
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground whitespace-nowrap">
                          Grade{" "}
                          {course.grades.length > 3
                            ? `${course.grades[0]}-${course.grades[course.grades.length - 1]}`
                            : course.grades.join(", ")}
                        </span>
                      </div>

                      {/* Title and description */}
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration || "N/A"}
                        </div>
                        {course.batchSize && (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {course.batchSize}
                          </div>
                        )}
                        {course.instructor && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {course.instructor}
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {course.features && course.features.length > 0 && (
                        <div className="space-y-1.5 mb-5 flex-grow">
                          {course.features.slice(0, 3).map((feature) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
                              <span className="text-muted-foreground text-xs">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full mt-auto"
                        asChild
                      >
                        <Link
                          to="/contact"
                          className="flex items-center justify-center gap-2"
                        >
                          Enquire Now <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12 bg-background rounded-2xl">
                  <p className="text-muted-foreground">
                    No courses found matching your filters.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedGrade("All Grades");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
