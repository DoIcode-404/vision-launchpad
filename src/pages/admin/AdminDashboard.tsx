import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Mail, BookOpen } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCourses: 0,
    totalFaculty: 0,
    pendingContacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch contacts
      const contactsSnapshot = await getDocs(collection(db, "contacts"));
      const totalContacts = contactsSnapshot.size;

      // Fetch pending contacts
      const pendingQuery = query(
        collection(db, "contacts"),
        where("status", "==", "new"),
      );
      const pendingSnapshot = await getDocs(pendingQuery);
      const pendingContacts = pendingSnapshot.size;

      // Fetch courses
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const totalCourses = coursesSnapshot.size;

      // Fetch faculty
      const facultySnapshot = await getDocs(collection(db, "faculty"));
      const totalFaculty = facultySnapshot.size;

      setStats({
        totalContacts,
        totalCourses,
        totalFaculty,
        pendingContacts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statsCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts.toString(),
      icon: Mail,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Faculty Members",
      value: stats.totalFaculty.toString(),
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Follow-ups",
      value: stats.pendingContacts.toString(),
      icon: BarChart3,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to Vision Launchpad Admin Panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Contacts</span>
              <span className="font-semibold">{stats.totalContacts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Pending Follow-ups</span>
              <span className="font-semibold">{stats.pendingContacts}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Active Courses</span>
              <span className="font-semibold">{stats.totalCourses}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
