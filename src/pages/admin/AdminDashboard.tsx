import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Users,
  Mail,
  BookOpen,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatNepaliCurrency } from "@/lib/nepal-data";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalCourses: 0,
    totalFaculty: 0,
    pendingContacts: 0,
    totalStudents: 0,
    activeStudents: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // Fetch students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const totalStudents = studentsSnapshot.size;

      // Fetch active students
      const activeQuery = query(
        collection(db, "students"),
        where("academicInfo.status", "==", "active"),
      );
      const activeSnapshot = await getDocs(activeQuery);
      const activeStudents = activeSnapshot.size;

      // Calculate monthly revenue (current month)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const transactionsSnapshot = await getDocs(
        collection(db, "feeTransactions"),
      );
      let monthlyRevenue = 0;

      transactionsSnapshot.forEach((doc) => {
        const data = doc.data();
        const paymentDate = data.paymentDate?.toDate();
        if (
          paymentDate >= startOfMonth &&
          paymentDate <= endOfMonth &&
          (data.status === "completed" || data.status === "verified")
        ) {
          monthlyRevenue += data.amount || 0;
        }
      });

      // Calculate pending payments
      let pendingPayments = 0;
      studentsSnapshot.forEach((doc) => {
        const data = doc.data();
        pendingPayments += data.financialInfo?.pendingAmount || 0;
      });

      setStats({
        totalContacts,
        totalCourses,
        totalFaculty,
        pendingContacts,
        totalStudents,
        activeStudents,
        monthlyRevenue,
        pendingPayments,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statsCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      subtitle: `${stats.activeStudents} active`,
      icon: GraduationCap,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/students",
    },
    {
      title: "This Month Revenue",
      value: formatNepaliCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      link: "/admin/finance",
    },
    {
      title: "Pending Payments",
      value: formatNepaliCurrency(stats.pendingPayments),
      icon: BarChart3,
      color: "bg-orange-50 text-orange-600",
      link: "/admin/students",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-purple-50 text-purple-600",
      link: "/admin/courses",
    },
    {
      title: "Faculty Members",
      value: stats.totalFaculty.toString(),
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
      link: "/admin/faculty",
    },
    {
      title: "Pending Contacts",
      value: stats.pendingContacts.toString(),
      icon: Mail,
      color: "bg-pink-50 text-pink-600",
      link: "/admin/contacts",
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link || "#"}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
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
                  {"subtitle" in stat && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/students">
              <Button className="w-full" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Manage Students
              </Button>
            </Link>
            <Link to="/admin/transactions">
              <Button className="w-full" variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Collect Payment
              </Button>
            </Link>
            <Link to="/admin/finance">
              <Button className="w-full" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Finance Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Students</span>
                <span className="font-semibold">{stats.activeStudents}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  Revenue This Month
                </span>
                <span className="font-semibold text-green-600">
                  {formatNepaliCurrency(stats.monthlyRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Pending</span>
                <span className="font-semibold text-orange-600">
                  {formatNepaliCurrency(stats.pendingPayments)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
