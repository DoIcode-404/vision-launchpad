import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, BookOpen, Trophy, MessageSquare } from "lucide-react";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    courses: 0,
    faculty: 0,
    results: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesSnap, facultySnap, resultsSnap, contactsSnap] =
          await Promise.all([
            getDocs(collection(db, "courses")),
            getDocs(collection(db, "faculty")),
            getDocs(collection(db, "results")),
            getDocs(collection(db, "contacts")),
          ]);

        setStats({
          courses: coursesSnap.size,
          faculty: facultySnap.size,
          results: resultsSnap.size,
          contacts: contactsSnap.size,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      label: "Courses",
      value: stats.courses,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      label: "Faculty Members",
      value: stats.faculty,
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Toppers/Results",
      value: stats.results,
      icon: Trophy,
      color: "bg-amber-500",
    },
    {
      label: "Contact Messages",
      value: stats.contacts,
      icon: MessageSquare,
      color: "bg-purple-500",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of your tuition center data and content
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-3xl font-bold text-primary mt-2">
                          {item.value}
                        </p>
                      </div>
                      <div className={`${item.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Placeholder for future charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Courses</span>
                      <span className="text-sm font-bold">{stats.courses}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(stats.courses * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Faculty</span>
                      <span className="text-sm font-bold">{stats.faculty}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(stats.faculty * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Toppers</span>
                      <span className="text-sm font-bold">{stats.results}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(stats.results * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Total Contact Messages
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {stats.contacts}
                    </p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      This dashboard auto-updates with your Firestore data. Add
                      more courses, faculty, and results to see changes
                      reflected here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
