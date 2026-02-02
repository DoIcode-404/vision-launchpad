import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  UserX,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Student, StudentStatus } from "@/types/student.types";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
} from "@/services/studentService";
import {
  formatDate,
  formatFullName,
  getStatusColor,
  exportToCSV,
} from "@/lib/utils-helpers";
import { formatNepaliCurrency } from "@/lib/nepal-data";
import AddStudentDialog from "./components/AddStudentDialog";

const AdminStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "all">(
    "all",
  );
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, searchTerm, statusFilter, courseFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      console.log("AdminStudents - Fetched students:", data);
      console.log("AdminStudents - Number of students:", data.length);
      setStudents(data);
    } catch (error) {
      console.error("AdminStudents - Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.personalInfo.firstName.toLowerCase().includes(search) ||
          student.personalInfo.lastName.toLowerCase().includes(search) ||
          student.studentId.toLowerCase().includes(search) ||
          student.personalInfo.email.toLowerCase().includes(search) ||
          student.personalInfo.phone.includes(search),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.academicInfo.status === statusFilter,
      );
    }

    // Course filter
    if (courseFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.academicInfo.courseId === courseFilter,
      );
    }

    setFilteredStudents(filtered);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudent(studentToDelete.id);
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleToggleStatus = async (student: Student) => {
    try {
      const newStatus: StudentStatus =
        student.academicInfo.status === "active" ? "inactive" : "active";

      await updateStudent(student.id, {
        academicInfo: {
          ...student.academicInfo,
          status: newStatus,
        },
      });

      toast({
        title: "Success",
        description: `Student marked as ${newStatus}.`,
      });
      fetchStudents();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student status.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const exportData = filteredStudents.map((student) => ({
      "Student ID": student.studentId,
      "Full Name": formatFullName(
        student.personalInfo.firstName,
        student.personalInfo.middleName,
        student.personalInfo.lastName,
      ),
      Email: student.personalInfo.email,
      Phone: student.personalInfo.phone,
      Course: student.academicInfo.courseName,
      Batch: student.academicInfo.batch,
      Status: student.academicInfo.status,
      "Total Fees": student.financialInfo.totalFees,
      "Paid Amount": student.financialInfo.paidAmount,
      "Pending Amount": student.financialInfo.pendingAmount,
      "Enrollment Date": formatDate(student.academicInfo.enrollmentDate),
    }));

    exportToCSV(exportData, "students");
    toast({
      title: "Success",
      description: "Students data exported successfully.",
    });
  };

  const getUniqueValues = <T,>(array: T[], key: keyof T): string[] => {
    return Array.from(new Set(array.map((item) => String(item[key])))).filter(
      Boolean,
    );
  };

  const courses = students
    .map((s) => s.academicInfo.courseName)
    .filter((value, index, self) => self.indexOf(value) === index && value);

  const stats = {
    total: students.length,
    active: students.filter((s) => s.academicInfo.status === "active").length,
    inactive: students.filter((s) => s.academicInfo.status === "inactive")
      .length,
    pendingPayments: students.filter((s) => s.financialInfo.pendingAmount > 0)
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Students Management</h1>
          <p className="text-muted-foreground">
            Manage all student records and information
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Inactive Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.inactive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingPayments}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ID, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: StudentStatus | "all") =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dropout">Dropout</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading students...
                </p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Fees Status</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.studentId}
                      </TableCell>
                      <TableCell>
                        {formatFullName(
                          student.personalInfo.firstName,
                          student.personalInfo.middleName,
                          student.personalInfo.lastName,
                        )}
                      </TableCell>
                      <TableCell>{student.academicInfo.courseName}</TableCell>
                      <TableCell>{student.academicInfo.batch}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{student.personalInfo.phone}</div>
                          <div className="text-muted-foreground">
                            {student.personalInfo.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            Paid:{" "}
                            {formatNepaliCurrency(
                              student.financialInfo.paidAmount,
                            )}
                          </div>
                          {student.financialInfo.pendingAmount > 0 && (
                            <div className="text-orange-600">
                              Due:{" "}
                              {formatNepaliCurrency(
                                student.financialInfo.pendingAmount,
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(student.academicInfo.status)}
                        >
                          {student.academicInfo.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/students/${student.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(student)}
                            title={
                              student.academicInfo.status === "active"
                                ? "Mark Inactive"
                                : "Mark Active"
                            }
                          >
                            {student.academicInfo.status === "active" ? (
                              <UserX className="h-4 w-4 text-orange-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setStudentToDelete(student);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Student Dialog */}
      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchStudents}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student record for{" "}
              {studentToDelete &&
                formatFullName(
                  studentToDelete.personalInfo.firstName,
                  studentToDelete.personalInfo.middleName,
                  studentToDelete.personalInfo.lastName,
                )}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStudents;
