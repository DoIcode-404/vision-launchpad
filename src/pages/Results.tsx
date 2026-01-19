import Layout from "@/components/layout/Layout";
import { Trophy, Star, Medal, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SkeletonGrid } from "@/components/SkeletonLoader";

interface Topper {
  id: string;
  name: string;
  exam: string;
  rank: string;
  score: string;
  initials: string;
  color: string;
}

interface Achievement {
  id?: string;
  year: string;
  ioe: string;
  iom: string;
  board90: string;
  boardToppers: string;
}

const defaultToppers: Topper[] = [
  {
    id: "1",
    name: "Bikash Thapa",
    exam: "IOE Entrance 2024",
    rank: "Rank 45",
    score: "98.5%",
    initials: "BT",
    color: "bg-amber-500",
  },
  {
    id: "2",
    name: "Srijana Sharma",
    exam: "IOM Entrance 2024",
    rank: "Rank 78",
    score: "92.3%",
    initials: "SS",
    color: "bg-pink-500",
  },
  {
    id: "3",
    name: "Rajan KC",
    exam: "IOE Entrance 2024",
    rank: "Top 1%",
    score: "Top 1%",
    initials: "RK",
    color: "bg-blue-500",
  },
  {
    id: "4",
    name: "Sunita Gurung",
    exam: "SEE 2024",
    rank: "District Topper",
    score: "GPA 4.0",
    initials: "SG",
    color: "bg-green-500",
  },
  {
    id: "5",
    name: "Kamal Poudel",
    exam: "Class 12 NEB",
    rank: "School Topper",
    score: "3.92 GPA",
    initials: "KP",
    color: "bg-purple-500",
  },
  {
    id: "6",
    name: "Anita Bhandari",
    exam: "SEE 2024",
    rank: "Dang Topper",
    score: "GPA 4.0",
    initials: "AB",
    color: "bg-cyan-500",
  },
];

const defaultAchievements: Achievement[] = [
  { year: "2024", ioe: "12", iom: "8", board90: "35+", boardToppers: "5" },
  { year: "2023", ioe: "8", iom: "5", board90: "28+", boardToppers: "4" },
  { year: "2022", ioe: "5", iom: "2", board90: "20+", boardToppers: "3" },
];

const Results = () => {
  const [toppers, setToppers] = useState<Topper[]>(defaultToppers);
  const [achievements, setAchievements] =
    useState<Achievement[]>(defaultAchievements);
  const [stats, setStats] = useState({
    ioe: 0,
    iom: 0,
    success: 0,
    toppers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [qs, achSnap] = await Promise.all([
          getDocs(collection(db, "results")),
          getDocs(collection(db, "achievements")),
        ]);

        const data: Topper[] = qs.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Topper, "id">),
        }));
        if (data.length > 0) setToppers(data);

        // Fetch achievements if available
        const achData: Achievement[] = achSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Achievement, "id">),
        }));
        if (achData.length > 0) {
          setAchievements(
            achData.sort((a, b) => parseInt(b.year) - parseInt(a.year)),
          );
        }

        // Compute stats dynamically
        const ioeCount = data.filter((r) => r.exam.includes("IOE")).length;
        const iomCount = data.filter((r) => r.exam.includes("IOM")).length;
        const toppersCount = data.length;

        setStats({
          ioe: ioeCount || 25,
          iom: iomCount || 15,
          success: 92,
          toppers: toppersCount || 50,
        });
      } catch (e) {
        console.error("Failed to load results:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Our Results
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Celebrating the success of our students who have achieved
              excellence in board exams and competitive examinations.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground">
                {stats.ioe}+
              </div>
              <div className="text-sm text-secondary-foreground/80">
                IOE Selections
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground">
                {stats.iom}+
              </div>
              <div className="text-sm text-secondary-foreground/80">
                IOM Selections
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground">
                {stats.success}%
              </div>
              <div className="text-sm text-secondary-foreground/80">
                First Attempt Success
              </div>
            </div>
            <div>
              <div className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground">
                {stats.toppers}+
              </div>
              <div className="text-sm text-secondary-foreground/80">
                SEE & NEB Toppers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toppers Gallery */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Star Performers</h2>
            <p className="section-subtitle">
              Meet our recent toppers who have made us proud
            </p>
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toppers.map((topper, index) => (
                <div
                  key={topper.id}
                  className="card-elevated rounded-2xl p-6 text-center relative overflow-hidden"
                >
                  {/* Trophy Icon for top 3 */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4">
                      <Trophy
                        className={`w-6 h-6 ${index === 0 ? "text-amber-500" : index === 1 ? "text-gray-400" : "text-amber-700"}`}
                      />
                    </div>
                  )}

                  <div
                    className={`w-20 h-20 rounded-full ${topper.color} mx-auto mb-4 flex items-center justify-center`}
                  >
                    <span className="text-2xl font-heading font-bold text-white">
                      {topper.initials}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                    {topper.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {topper.exam}
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1 text-secondary">
                      <Medal className="w-4 h-4" />
                      <span className="font-semibold text-sm">
                        {topper.rank}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-accent-foreground">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-sm">
                        {topper.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Year-wise Results */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Year-wise Performance</h2>
            <p className="section-subtitle">
              Consistent excellence across all examinations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-xl shadow-lg overflow-hidden">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left font-heading">Year</th>
                  <th className="px-6 py-4 text-center font-heading">
                    IOE Selections
                  </th>
                  <th className="px-6 py-4 text-center font-heading">
                    IOM Selections
                  </th>
                  <th className="px-6 py-4 text-center font-heading">
                    90%+ in Boards
                  </th>
                  <th className="px-6 py-4 text-center font-heading">
                    School Toppers
                  </th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((row, index) => (
                  <tr
                    key={row.year}
                    className={index % 2 === 0 ? "bg-card" : "bg-muted/30"}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">
                      {row.year}
                    </td>
                    <td className="px-6 py-4 text-center text-secondary font-semibold">
                      {row.ioe}
                    </td>
                    <td className="px-6 py-4 text-center text-secondary font-semibold">
                      {row.iom}
                    </td>
                    <td className="px-6 py-4 text-center text-secondary font-semibold">
                      {row.board90}
                    </td>
                    <td className="px-6 py-4 text-center text-secondary font-semibold">
                      {row.boardToppers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recognition */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
              Recognized for Excellence
            </h2>
            <p className="text-muted-foreground mb-8">
              The New Vision Tuition Center has been recognized by various
              educational bodies for its outstanding contribution to student
              success. Our consistent track record of producing top rankers has
              made us a trusted name in education.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                Best Coaching Institute 2023
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                Excellence in Education Award
              </span>
              <span className="px-4 py-2 bg-muted rounded-full text-sm font-medium">
                Top in Dang District
              </span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Results;
