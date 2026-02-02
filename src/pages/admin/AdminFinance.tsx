import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  getAllTransactions,
  getFinancialSummary,
} from "@/services/financeService";
import { getStudentsWithPendingPayments } from "@/services/studentService";
import { FeeTransaction } from "@/types/finance.types";
import { formatNepaliCurrency } from "@/lib/nepal-data";
import { formatDate } from "@/lib/utils-helpers";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminFinance = () => {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchFinanceData();
  }, [selectedMonth, selectedYear]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      // Get transactions for selected month
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
      const txns = await getAllTransactions({ startDate, endDate });
      setTransactions(txns);

      // Get pending payments count
      const pendingStudents = await getStudentsWithPendingPayments();
      setPendingCount(pendingStudents.length);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch finance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const completedTxns = transactions.filter(
    (t) => t.status === "completed" || t.status === "verified",
  );

  const totalRevenue = completedTxns.reduce((sum, t) => sum + t.amount, 0);

  const revenueByMethod = {
    cash: completedTxns
      .filter((t) => t.paymentMethod === "cash")
      .reduce((sum, t) => sum + t.amount, 0),
    online: completedTxns
      .filter((t) => t.paymentMethod === "online")
      .reduce((sum, t) => sum + t.amount, 0),
    bank_transfer: completedTxns
      .filter((t) => t.paymentMethod === "bank_transfer")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  const revenueByFeeType = {
    admission_fee: completedTxns
      .filter((t) => t.feeType === "admission_fee")
      .reduce((sum, t) => sum + t.amount, 0),
    tuition_fee: completedTxns
      .filter((t) => t.feeType === "tuition_fee")
      .reduce((sum, t) => sum + t.amount, 0),
    exam_fee: completedTxns
      .filter((t) => t.feeType === "exam_fee")
      .reduce((sum, t) => sum + t.amount, 0),
    certificate_fee: completedTxns
      .filter((t) => t.feeType === "certificate_fee")
      .reduce((sum, t) => sum + t.amount, 0),
    other: completedTxns
      .filter((t) => t.feeType === "other")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  // Chart data
  const paymentMethodData = [
    { name: "Cash", value: revenueByMethod.cash, color: "#10b981" },
    { name: "Online", value: revenueByMethod.online, color: "#3b82f6" },
    {
      name: "Bank Transfer",
      value: revenueByMethod.bank_transfer,
      color: "#f59e0b",
    },
  ].filter((item) => item.value > 0);

  const feeTypeData = [
    { name: "Admission", amount: revenueByFeeType.admission_fee },
    { name: "Tuition", amount: revenueByFeeType.tuition_fee },
    { name: "Exam", amount: revenueByFeeType.exam_fee },
    { name: "Certificate", amount: revenueByFeeType.certificate_fee },
    { name: "Other", amount: revenueByFeeType.other },
  ].filter((item) => item.amount > 0);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of financial transactions and revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={String(selectedMonth)}
            onValueChange={(v) => setSelectedMonth(Number(v))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => (
                <SelectItem key={month} value={String(idx + 1)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNepaliCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTxns.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNepaliCurrency(revenueByMethod.cash)}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTxns.filter((t) => t.paymentMethod === "cash").length}{" "}
              payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Online Payments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNepaliCurrency(revenueByMethod.online)}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTxns.filter((t) => t.paymentMethod === "online").length}{" "}
              payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Pending Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Students with dues</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) =>
                      `${entry.name}: ${formatNepaliCurrency(entry.value)}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatNepaliCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fee Type Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Fee Type</CardTitle>
          </CardHeader>
          <CardContent>
            {feeTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feeTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatNepaliCurrency(value)}
                  />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No transactions found for this period.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{txn.studentName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{txn.transactionId}</span>
                      <span>•</span>
                      <span className="capitalize">
                        {txn.paymentMethod.replace("_", " ")}
                      </span>
                      <span>•</span>
                      <span>{formatDate(txn.paymentDate)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatNepaliCurrency(txn.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {txn.feeType.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinance;
