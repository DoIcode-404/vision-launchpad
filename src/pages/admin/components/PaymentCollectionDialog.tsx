import { useState, useEffect } from "react";
import { Loader2, Search, Check, ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { Student } from "@/types/student.types";
import { PaymentMethod, FeeType } from "@/types/finance.types";
import { getAllStudents } from "@/services/studentService";
import { cn } from "@/lib/utils";

interface PaymentDetails {
  receivedBy?: string;
  platform?: string;
  transactionRef?: string;
  bankName?: string;
  accountNumber?: string;
  depositSlipNumber?: string;
  transferDate?: Date;
}
import { recordPayment } from "@/services/financeService";
import {
  FEE_TYPES,
  PAYMENT_METHODS,
  PAYMENT_PLATFORMS,
  formatNepaliCurrency,
} from "@/lib/nepal-data";

interface PaymentCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedStudent?: Student | null;
  onSuccess: () => void;
}

const PaymentCollectionDialog = ({
  open,
  onOpenChange,
  preselectedStudent,
  onSuccess,
}: PaymentCollectionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openStudentCombobox, setOpenStudentCombobox] = useState(false);
  const { currentUser } = useAdmin();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash" as PaymentMethod,
    feeType: "tuition_fee" as FeeType,
    notes: "",
    // Cash
    receivedBy: "",
    // Online
    platform: "",
    transactionRef: "",
    // Bank Transfer
    bankName: "",
    accountNumber: "",
    depositSlipNumber: "",
    transferDate: "",
  });

  useEffect(() => {
    if (open) {
      fetchStudents();
      if (preselectedStudent) {
        setSelectedStudent(preselectedStudent);
        setFormData((prev) => ({ ...prev, studentId: preselectedStudent.id }));
      } else {
        resetForm();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preselectedStudent]);

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents({ status: "active" });
      console.log("Fetched students:", data); // Debug log with full data
      console.log("Number of students:", data.length);
      setStudents(data);
      if (data.length === 0) {
        toast({
          title: "No Active Students",
          description: "No active students found. Please add students first.",
        });
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      feeType: "tuition_fee",
      notes: "",
      receivedBy: "",
      platform: "",
      transactionRef: "",
      bankName: "",
      accountNumber: "",
      depositSlipNumber: "",
      transferDate: "",
    });
    setSelectedStudent(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStudentSelect = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setSelectedStudent(student || null);
    setFormData((prev) => ({ ...prev, studentId }));
  };

  const validateForm = (): boolean => {
    if (!formData.studentId || !formData.amount || !formData.paymentDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const amount = Number(formData.amount);
    if (amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Amount must be greater than 0.",
        variant: "destructive",
      });
      return false;
    }

    // Validate based on payment method
    if (formData.paymentMethod === "cash" && !formData.receivedBy) {
      toast({
        title: "Validation Error",
        description: "Please specify who received the cash payment.",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.paymentMethod === "online" &&
      (!formData.platform || !formData.transactionRef)
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please provide payment platform and transaction reference.",
        variant: "destructive",
      });
      return false;
    }

    if (
      formData.paymentMethod === "bank_transfer" &&
      (!formData.bankName || !formData.depositSlipNumber)
    ) {
      toast({
        title: "Validation Error",
        description: "Please provide bank name and deposit slip number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!currentUser || !selectedStudent || !validateForm()) return;

    setLoading(true);
    try {
      const paymentDetails: PaymentDetails = {};

      // Set payment details based on method
      if (formData.paymentMethod === "cash") {
        paymentDetails.receivedBy = formData.receivedBy;
      } else if (formData.paymentMethod === "online") {
        paymentDetails.platform = formData.platform;
        paymentDetails.transactionRef = formData.transactionRef;
      } else if (formData.paymentMethod === "bank_transfer") {
        paymentDetails.bankName = formData.bankName;
        paymentDetails.accountNumber = formData.accountNumber;
        paymentDetails.depositSlipNumber = formData.depositSlipNumber;
        paymentDetails.transferDate = formData.transferDate
          ? new Date(formData.transferDate)
          : undefined;
      }

      await recordPayment(
        {
          studentId: formData.studentId,
          studentName: `${selectedStudent.personalInfo.firstName} ${selectedStudent.personalInfo.lastName}`,
          courseId: selectedStudent.academicInfo.courseId,
          courseName: selectedStudent.academicInfo.courseName,
          amount: Number(formData.amount),
          paymentDate: new Date(formData.paymentDate),
          paymentMethod: formData.paymentMethod,
          paymentDetails,
          feeType: formData.feeType,
          notes: formData.notes,
          status: "completed",
          collectedBy: currentUser.uid,
          collectedByName: currentUser.email || "Admin",
        },
        currentUser.uid,
        currentUser.email || "Admin",
      );

      toast({
        title: "Success",
        description: "Payment recorded successfully!",
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Collect Payment</DialogTitle>
          <DialogDescription>
            Record a new fee payment from a student
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Student Selection */}
          <div>
            <Label>Student *</Label>
            <Popover
              open={openStudentCombobox}
              onOpenChange={setOpenStudentCombobox}
            >
              <PopoverTrigger asChild disabled={!!preselectedStudent}>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStudentCombobox}
                  className="w-full justify-between"
                  disabled={!!preselectedStudent}
                >
                  {formData.studentId
                    ? (() => {
                        const student = students.find(
                          (s) => s.id === formData.studentId,
                        );
                        return student
                          ? `${student.studentId} - ${student.personalInfo.firstName} ${student.personalInfo.lastName}`
                          : "Select student...";
                      })()
                    : "Select student..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0">
                <Command>
                  <CommandInput placeholder="Search student by name or ID..." />
                  <CommandEmpty>No student found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {students.map((student) => (
                      <CommandItem
                        key={student.id}
                        value={`${student.studentId} ${student.personalInfo.firstName} ${student.personalInfo.lastName}`}
                        onSelect={() => {
                          handleStudentSelect(student.id);
                          setOpenStudentCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.studentId === student.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <div className="flex-1">
                          <div className="font-medium">
                            {student.studentId} -{" "}
                            {student.personalInfo.firstName}{" "}
                            {student.personalInfo.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student.academicInfo.courseName} |{" "}
                            {student.academicInfo.batch}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Student Financial Info */}
          {selectedStudent && (
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Student Financial Status</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Fees:</span>
                  <p className="font-semibold">
                    {formatNepaliCurrency(
                      selectedStudent.financialInfo.totalFees,
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid:</span>
                  <p className="font-semibold text-green-600">
                    {formatNepaliCurrency(
                      selectedStudent.financialInfo.paidAmount,
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pending:</span>
                  <p className="font-semibold text-orange-600">
                    {formatNepaliCurrency(
                      selectedStudent.financialInfo.pendingAmount,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (NPR) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  handleInputChange("paymentDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: PaymentMethod) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feeType">Fee Type *</Label>
              <Select
                value={formData.feeType}
                onValueChange={(value: FeeType) =>
                  handleInputChange("feeType", value)
                }
              >
                <SelectTrigger id="feeType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method Specific Fields */}
          {formData.paymentMethod === "cash" && (
            <div>
              <Label htmlFor="receivedBy">Received By *</Label>
              <Input
                id="receivedBy"
                value={formData.receivedBy}
                onChange={(e) =>
                  handleInputChange("receivedBy", e.target.value)
                }
                placeholder="Name of staff who received cash"
              />
            </div>
          )}

          {formData.paymentMethod === "online" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Payment Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    handleInputChange("platform", value)
                  }
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_PLATFORMS.online.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transactionRef">Transaction Reference *</Label>
                <Input
                  id="transactionRef"
                  value={formData.transactionRef}
                  onChange={(e) =>
                    handleInputChange("transactionRef", e.target.value)
                  }
                  placeholder="Transaction ID from payment platform"
                />
              </div>
            </div>
          )}

          {formData.paymentMethod === "bank_transfer" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select
                    value={formData.bankName}
                    onValueChange={(value) =>
                      handleInputChange("bankName", value)
                    }
                  >
                    <SelectTrigger id="bankName">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_PLATFORMS.banks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="depositSlipNumber">Deposit Slip No. *</Label>
                  <Input
                    id="depositSlipNumber"
                    value={formData.depositSlipNumber}
                    onChange={(e) =>
                      handleInputChange("depositSlipNumber", e.target.value)
                    }
                    placeholder="Slip number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleInputChange("accountNumber", e.target.value)
                    }
                    placeholder="Bank account number"
                  />
                </div>
                <div>
                  <Label htmlFor="transferDate">Transfer Date</Label>
                  <Input
                    id="transferDate"
                    type="date"
                    value={formData.transferDate}
                    onChange={(e) =>
                      handleInputChange("transferDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional notes about this payment..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Record Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentCollectionDialog;
