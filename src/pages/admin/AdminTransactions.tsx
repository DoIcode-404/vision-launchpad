import { useState, useEffect } from "react";
import { Search, Filter, Download, Receipt, Eye } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FeeTransaction, PaymentMethod, FeeType } from "@/types/finance.types";
import { getAllTransactions } from "@/services/financeService";
import { formatDate, getStatusColor, exportToCSV } from "@/lib/utils-helpers";
import { formatNepaliCurrency } from "@/lib/nepal-data";
import PaymentCollectionDialog from "@/pages/admin/components/PaymentCollectionDialog";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    FeeTransaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | "all"
  >("all");
  const [feeTypeFilter, setFeeTypeFilter] = useState<FeeType | "all">("all");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, paymentMethodFilter, feeTypeFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.transactionId.toLowerCase().includes(search) ||
          txn.studentName.toLowerCase().includes(search) ||
          txn.receiptNumber.toLowerCase().includes(search),
      );
    }

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter(
        (txn) => txn.paymentMethod === paymentMethodFilter,
      );
    }

    // Fee type filter
    if (feeTypeFilter !== "all") {
      filtered = filtered.filter((txn) => txn.feeType === feeTypeFilter);
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = () => {
    const exportData = filteredTransactions.map((txn) => ({
      "Transaction ID": txn.transactionId,
      "Receipt No": txn.receiptNumber,
      "Student Name": txn.studentName,
      Course: txn.courseName,
      "Amount (NPR)": txn.amount,
      "Payment Date": formatDate(txn.paymentDate),
      "Payment Method": txn.paymentMethod,
      "Fee Type": txn.feeType,
      Status: txn.status,
      "Collected By": txn.collectedByName,
    }));

    exportToCSV(exportData, "transactions");
    toast({
      title: "Success",
      description: "Transactions data exported successfully.",
    });
  };

  const stats = {
    total: transactions.length,
    completed: transactions.filter(
      (t) => t.status === "completed" || t.status === "verified",
    ).length,
    totalAmount: transactions
      .filter((t) => t.status === "completed" || t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all payment transactions
          </p>
        </div>
        <Button onClick={() => setPaymentDialogOpen(true)}>
          <Receipt className="mr-2 h-4 w-4" />
          New Payment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNepaliCurrency(stats.totalAmount)}
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
                  placeholder="Search by transaction ID, student name, or receipt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={paymentMethodFilter}
              onValueChange={(value: PaymentMethod | "all") => setPaymentMethodFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={feeTypeFilter}
              onValueChange={(value: FeeType | "all") => setFeeTypeFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fee Types</SelectItem>
                <SelectItem value="admission_fee">Admission Fee</SelectItem>
                <SelectItem value="tuition_fee">Tuition Fee</SelectItem>
                <SelectItem value="exam_fee">Exam Fee</SelectItem>
                <SelectItem value="certificate_fee">Certificate Fee</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading transactions...
                </p>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No transactions found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Collected By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">
                        {txn.transactionId}
                      </TableCell>
                      <TableCell>{txn.receiptNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{txn.studentName}</div>
                          <div className="text-sm text-muted-foreground">
                            {txn.courseName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(txn.paymentDate)}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatNepaliCurrency(txn.amount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {txn.paymentMethod.replace("_", " ")}
                      </TableCell>
                      <TableCell className="capitalize">
                        {txn.feeType.replace("_", " ")}
                      </TableCell>
                      <TableCell className="text-sm">
                        {txn.collectedByName}
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Collection Dialog */}
      <PaymentCollectionDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};

export default AdminTransactions;
