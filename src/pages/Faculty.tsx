import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { BookOpen, Award, Quote } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SkeletonGrid } from "@/components/SkeletonLoader";

const defaultFaculty: FacultyMember[] = [
  {
    id: "1",
    name: "Mr. Achyut Poudel",
    subjects: ["Science", "Agriculture"],
    experience: "5+ Years",
    qualification: "B.Sc. Agriculture, AFU",
    quote:
      "Learning from nature teaches us the best lessons for life and science.",
    initials: "AP",
    color: "bg-green-500",
  },
  {
    id: "2",
    name: "Mrs. Puspa Bastola",
    subjects: ["Mathematics", "Education"],
    experience: "6+ Years",
    qualification: "M.Ed. Mathematics, TU",
    quote:
      "Every student can excel in math with the right approach and practice.",
    initials: "PB",
    color: "bg-purple-500",
  },
];

interface FacultyMember {
  id: string;
  name: string;
  subjects?: string[];
  experience?: string;
  qualification?: string;
  email?: string;
  phone?: string;
  subject?: string;
  initials?: string;
  color?: string;
  quote?: string;
  imageUrl?: string;
}

const Faculty = () => {
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const parseYears = (str: string): number => {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const facultyCount = facultyData.length;
  const combinedYears = facultyData.reduce(
    (sum, f) => sum + parseYears(f.experience || ""),
    0,
  );

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FacultyMember[];

      if (data.length === 0) {
        setFacultyData(defaultFaculty);
      } else {
        setFacultyData(data);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      setFacultyData(defaultFaculty);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Our Expert Faculty
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Learn from experienced educators who are passionate about teaching
              and committed to your success.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Stats */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                {facultyCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Expert Teachers
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                {combinedYears > 0 ? `${combinedYears}+` : "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Years Combined Exp.
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                TU/AFU
              </div>
              <div className="text-sm text-muted-foreground">
                Qualified Faculty
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Dedicated Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          {loading ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facultyData.map((faculty) => {
                const initials =
                  faculty.initials ||
                  faculty.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") ||
                  "NA";
                const color = faculty.color || "bg-blue-500";
                const subjectDisplay =
                  faculty.subject ||
                  (faculty.subjects ? faculty.subjects.join(", ") : "N/A");

                return (
                  <div
                    key={faculty.id}
                    className="card-elevated rounded-2xl overflow-hidden group"
                  >
                    {/* Avatar or Image */}
                    {faculty.imageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={faculty.imageUrl}
                          alt={faculty.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div
                        className={`h-48 ${color} flex items-center justify-center`}
                      >
                        <span className="text-5xl font-heading font-bold text-white">
                          {initials}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                        {faculty.name}
                      </h3>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 text-sm text-secondary">
                          <BookOpen className="w-4 h-4" />
                          {subjectDisplay}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Award className="w-4 h-4" />
                          {faculty.experience || "N/A"}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-4">
                        {faculty.qualification || "N/A"}
                      </p>

                      {faculty.quote && (
                        <div className="relative pt-4 border-t border-border">
                          <Quote className="w-4 h-4 text-secondary/50 absolute -top-2 left-0 bg-card" />
                          <p className="text-sm text-muted-foreground italic pl-2">
                            "{faculty.quote}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              Are You a Passionate Educator?
            </h2>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented teachers who share our vision of
              providing quality education. Join our team and make a difference.
            </p>
            <a
              href="mailto:careers@newvision.edu"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-medium transition-colors"
            >
              Send your resume to careers@newvision.edu
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Faculty;
