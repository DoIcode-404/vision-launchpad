import { Timestamp } from "firebase/firestore";

export type PaymentMethod = "cash" | "online" | "bank_transfer";
export type FeeType =
  | "admission_fee"
  | "tuition_fee"
  | "exam_fee"
  | "certificate_fee"
  | "other";
export type TransactionStatus =
  | "completed"
  | "pending"
  | "verified"
  | "refunded";
export type InstallmentStatus = "pending" | "paid" | "partial" | "overdue";

export interface OnlinePaymentDetails {
  transactionRef: string;
  platform: string;
}

export interface BankTransferDetails {
  bankName: string;
  accountNumber: string;
  depositSlipNumber: string;
  transferDate: Date;
}

export interface CashPaymentDetails {
  receivedBy: string;
}

export interface PaymentDetails {
  // Online payment
  transactionRef?: string;
  platform?: string;

  // Bank transfer
  bankName?: string;
  accountNumber?: string;
  depositSlipNumber?: string;
  transferDate?: Date;

  // Cash
  receivedBy?: string;
}

export interface FeeTransaction {
  id: string;
  transactionId: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  feeType: FeeType;
  fiscalYear: string;
  notes: string;
  status: TransactionStatus;
  collectedBy: string;
  collectedByName: string;
  createdAt: Timestamp;
}

export interface CourseRevenue {
  courseName: string;
  amount: number;
  studentCount: number;
}

export interface PaymentMethodBreakdown {
  cash: number;
  online: number;
  bank_transfer: number;
}

export interface FeeTypeBreakdown {
  admission_fee: number;
  tuition_fee: number;
  exam_fee: number;
  certificate_fee: number;
  other: number;
}

export interface Revenue {
  totalCollected: number;
  byPaymentMethod: PaymentMethodBreakdown;
  byCourse: Record<string, CourseRevenue>;
  byFeeType: FeeTypeBreakdown;
}

export interface StudentMetrics {
  newEnrollments: number;
  activeStudents: number;
  totalStudents: number;
  completions: number;
  dropouts: number;
}

export interface PendingPayments {
  totalPending: number;
  studentCount: number;
}

export interface FinancialSummary {
  id: string;
  month: number;
  year: number;
  bsMonth?: string;
  bsYear?: string;
  fiscalYear: string;
  revenue: Revenue;
  studentMetrics: StudentMetrics;
  pendingPayments: PendingPayments;
  updatedAt: Timestamp;
}

export interface FeeInstallment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  paidDate: Date | null;
  paidAmount: number;
  status: InstallmentStatus;
  linkedTransactionId: string;
  reminderSent: boolean;
  lastReminderDate: Date | null;
  notes: string;
  createdAt: Timestamp;
}
