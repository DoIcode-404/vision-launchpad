import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  BookOpen,
  DollarSign,
  FileText,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/types/student.types";
import { FeeTransaction, FeeInstallment } from "@/types/finance.types";
import { getStudentById } from "@/services/studentService";
import {
  getTransactionHistory,
  getStudentInstallments,
} from "@/services/financeService";
import {
  formatDate,
  formatFullName,
  getStatusColor,
  getInitials,
  getAvatarColor,
  calculateAge,
} from "@/lib/utils-helpers";
import { formatNepaliCurrency } from "@/lib/nepal-data";
import PaymentCollectionDialog from "@/pages/admin/components/PaymentCollectionDialog";

const AdminStudentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [installments, setInstallments] = useState<FeeInstallment[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      console.log("Fetching student with ID:", id);
      const studentData = await getStudentById(id);
      console.log("Fetched student data:", studentData);

      if (!studentData) {
        toast({
          title: "Error",
          description: "Student not found.",
          variant: "destructive",
        });
        navigate("/admin/students");
        return;
      }

      setStudent(studentData);
      const txns = await getTransactionHistory(id);
      const installs = await getStudentInstallments(id);
      setTransactions(txns);
      setInstallments(installs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Student not found.</p>
      </div>
    );
  }

  const fullName = formatFullName(
    student.personalInfo.firstName,
    student.personalInfo.middleName,
    student.personalInfo.lastName,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/students")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Student Details</h1>
          <p className="text-muted-foreground">{student.studentId}</p>
        </div>
        <Button onClick={() => setPaymentDialogOpen(true)}>
          <Receipt className="mr-2 h-4 w-4" />
          Collect Payment
        </Button>
      </div>

      {/* Student Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.documents.photo} />
              <AvatarFallback
                className={`text-2xl ${getAvatarColor(fullName)}`}
              >
                {getInitials(
                  student.personalInfo.firstName,
                  student.personalInfo.lastName,
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-muted-foreground">
                  {student.personalInfo.email}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student.personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {calculateAge(student.personalInfo.dateOfBirth)} years old
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {student.academicInfo.courseName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={getStatusColor(student.academicInfo.status)}>
                    {student.academicInfo.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNepaliCurrency(student.financialInfo.totalFees)}
            </div>
            {student.financialInfo.discount > 0 && (
              <p className="text-xs text-muted-foreground">
                Discount: {formatNepaliCurrency(student.financialInfo.discount)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNepaliCurrency(student.financialInfo.paidAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {transactions.length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatNepaliCurrency(student.financialInfo.pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {installments.filter((i) => i.status === "pending").length}{" "}
              pending installments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Info</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="installments">Installments</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="mt-1">{fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="mt-1">
                    {formatDate(student.personalInfo.dateOfBirth)} (
                    {calculateAge(student.personalInfo.dateOfBirth)} years)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <p className="mt-1 capitalize">
                    {student.personalInfo.gender}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Citizenship No.
                  </label>
                  <p className="mt-1">{student.personalInfo.citizenship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="mt-1">{student.personalInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="mt-1">{student.personalInfo.phone}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Province
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.address.province}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      District
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.address.district}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Municipality
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.address.municipality}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Ward No.
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.address.wardNo}
                    </p>
                  </div>
                  {student.personalInfo.address.tole && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Tole/Locality
                      </label>
                      <p className="mt-1">
                        {student.personalInfo.address.tole}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.guardianInfo.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Relation
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.guardianInfo.relation || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.guardianInfo.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Occupation
                    </label>
                    <p className="mt-1">
                      {student.personalInfo.guardianInfo.occupation || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Information Tab */}
        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Course
                  </label>
                  <p className="mt-1">{student.academicInfo.courseName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Batch
                  </label>
                  <p className="mt-1">{student.academicInfo.batch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Academic Year
                  </label>
                  <p className="mt-1">{student.academicInfo.academicYear}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Enrollment Date
                  </label>
                  <p className="mt-1">
                    {formatDate(student.academicInfo.enrollmentDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge
                      variant={getStatusColor(student.academicInfo.status)}
                    >
                      {student.academicInfo.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {student.academicInfo.previousEducation.level && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Previous Education</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Level
                        </label>
                        <p className="mt-1">
                          {student.academicInfo.previousEducation.level}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Board/University
                        </label>
                        <p className="mt-1">
                          {student.academicInfo.previousEducation.board}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Institution
                        </label>
                        <p className="mt-1">
                          {student.academicInfo.previousEducation.institution}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Passed Year
                        </label>
                        <p className="mt-1">
                          {student.academicInfo.previousEducation.passedYear}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No transactions found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">
                          {txn.transactionId}
                        </TableCell>
                        <TableCell>{formatDate(txn.paymentDate)}</TableCell>
                        <TableCell>
                          {formatNepaliCurrency(txn.amount)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {txn.paymentMethod.replace("_", " ")}
                        </TableCell>
                        <TableCell className="capitalize">
                          {txn.feeType.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(txn.status)}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installments Tab */}
        <TabsContent value="installments">
          <Card>
            <CardHeader>
              <CardTitle>Installment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {installments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No installments scheduled.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Installment #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Paid Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installments.map((inst) => (
                      <TableRow key={inst.id}>
                        <TableCell>
                          Installment {inst.installmentNumber}
                        </TableCell>
                        <TableCell>
                          {formatNepaliCurrency(inst.amount)}
                        </TableCell>
                        <TableCell>{formatDate(inst.dueDate)}</TableCell>
                        <TableCell>
                          {inst.paidDate ? formatDate(inst.paidDate) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(inst.status)}>
                            {inst.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Collection Dialog */}
      <PaymentCollectionDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        preselectedStudent={student}
        onSuccess={fetchStudentData}
      />
    </div>
  );
};

export default AdminStudentDetails;
