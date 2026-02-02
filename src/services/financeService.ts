import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FeeTransaction,
  FinancialSummary,
  FeeInstallment,
  PaymentMethod,
  FeeType,
  InstallmentStatus,
} from "@/types/finance.types";
import { updateStudentFinancialInfo } from "./studentService";
import { getCurrentFiscalYear } from "@/lib/nepal-data";

const TRANSACTIONS_COLLECTION = "feeTransactions";
const FINANCIAL_SUMMARY_COLLECTION = "financialSummary";
const INSTALLMENTS_COLLECTION = "feeInstallments";

// Helper function to convert Firestore Timestamps to Dates
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertTransactionTimestamps = (data: any): FeeTransaction => {
  return {
    ...data,
    paymentDate: data.paymentDate?.toDate?.() || data.paymentDate,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
  } as FeeTransaction;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertInstallmentTimestamps = (data: any): FeeInstallment => {
  return {
    ...data,
    dueDate: data.dueDate?.toDate?.() || data.dueDate,
    paidDate: data.paidDate?.toDate?.() || data.paidDate,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  } as FeeInstallment;
};

// Generate unique transaction ID
export const generateTransactionId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
  const snapshot = await getDocs(transactionsRef);
  const count = snapshot.size + 1;
  return `TXN${year}${String(count).padStart(5, "0")}`;
};

// Generate receipt number
export const generateReceiptNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
  const snapshot = await getDocs(transactionsRef);
  const count = snapshot.size + 1;
  return `REC${year}${String(count).padStart(5, "0")}`;
};

// Record a new payment
export const recordPayment = async (
  paymentData: Omit<
    FeeTransaction,
    "id" | "transactionId" | "receiptNumber" | "createdAt" | "fiscalYear"
  >,
  currentUserId: string,
  currentUserName: string,
): Promise<string> => {
  try {
    const transactionId = await generateTransactionId();
    const receiptNumber = await generateReceiptNumber();
    const fiscalYear = getCurrentFiscalYear();

    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);

    const newTransaction = {
      ...paymentData,
      transactionId,
      receiptNumber,
      fiscalYear,
      collectedBy: currentUserId,
      collectedByName: currentUserName,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(transactionsRef, newTransaction);

    // Update student's financial info
    await updateStudentFinancialInfo(paymentData.studentId, paymentData.amount);

    // Update financial summary
    await updateFinancialSummary(new Date(paymentData.paymentDate));

    return docRef.id;
  } catch (error) {
    console.error("Error recording payment:", error);
    throw error;
  }
};

// Get transaction history for a student
export const getTransactionHistory = async (
  studentId: string,
): Promise<FeeTransaction[]> => {
  try {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    const q = query(transactionsRef);

    const snapshot = await getDocs(q);
    let transactions = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return convertTransactionTimestamps(data);
    });

    // Client-side filtering and sorting
    transactions = transactions.filter((t) => t.studentId === studentId);
    transactions.sort((a, b) => {
      const dateA =
        a.paymentDate instanceof Date ? a.paymentDate : new Date(a.paymentDate);
      const dateB =
        b.paymentDate instanceof Date ? b.paymentDate : new Date(b.paymentDate);
      return dateB.getTime() - dateA.getTime();
    });

    return transactions;
  } catch (error) {
    console.error("Error getting transaction history:", error);
    throw error;
  }
};

// Get all transactions with filters
interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: PaymentMethod;
  feeType?: FeeType;
  studentId?: string;
  courseId?: string;
}

export const getAllTransactions = async (
  filters?: TransactionFilters,
): Promise<FeeTransaction[]> => {
  try {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    const q = query(transactionsRef);

    const snapshot = await getDocs(q);

    let transactions = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return convertTransactionTimestamps(data);
    });

    // Client-side filtering
    if (filters?.studentId) {
      transactions = transactions.filter(
        (t) => t.studentId === filters.studentId,
      );
    }

    if (filters?.courseId) {
      transactions = transactions.filter(
        (t) => t.courseId === filters.courseId,
      );
    }

    if (filters?.paymentMethod) {
      transactions = transactions.filter(
        (t) => t.paymentMethod === filters.paymentMethod,
      );
    }

    if (filters?.feeType) {
      transactions = transactions.filter((t) => t.feeType === filters.feeType);
    }

    if (filters?.startDate) {
      transactions = transactions.filter(
        (t) => new Date(t.paymentDate) >= filters.startDate!,
      );
    }

    if (filters?.endDate) {
      transactions = transactions.filter(
        (t) => new Date(t.paymentDate) <= filters.endDate!,
      );
    }

    // Sort by paymentDate descending
    transactions.sort((a, b) => {
      const dateA =
        a.paymentDate instanceof Date ? a.paymentDate : new Date(a.paymentDate);
      const dateB =
        b.paymentDate instanceof Date ? b.paymentDate : new Date(b.paymentDate);
      return dateB.getTime() - dateA.getTime();
    });

    return transactions;
  } catch (error) {
    console.error("Error getting transactions:", error);
    throw error;
  }
};

// Calculate revenue for a date range
export const calculateRevenue = async (
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  try {
    const transactions = await getAllTransactions({ startDate, endDate });
    return transactions
      .filter((t) => t.status === "completed" || t.status === "verified")
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error("Error calculating revenue:", error);
    throw error;
  }
};

// Update financial summary for a given month
export const updateFinancialSummary = async (date: Date): Promise<void> => {
  try {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const summaryId = `${year}-${String(month).padStart(2, "0")}`;

    const summaryRef = doc(db, FINANCIAL_SUMMARY_COLLECTION, summaryId);
    const summarySnap = await getDoc(summaryRef);

    // Get all transactions for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const transactions = await getAllTransactions({ startDate, endDate });

    const completedTransactions = transactions.filter(
      (t) => t.status === "completed" || t.status === "verified",
    );

    // Calculate revenue breakdowns
    const byPaymentMethod = {
      cash: 0,
      online: 0,
      bank_transfer: 0,
    };

    const byFeeType = {
      admission_fee: 0,
      tuition_fee: 0,
      exam_fee: 0,
      certificate_fee: 0,
      other: 0,
    };

    const byCourse: Record<
      string,
      { courseName: string; amount: number; studentCount: Set<string> | number }
    > = {};

    completedTransactions.forEach((t) => {
      byPaymentMethod[t.paymentMethod] += t.amount;
      byFeeType[t.feeType] += t.amount;

      if (!byCourse[t.courseId]) {
        byCourse[t.courseId] = {
          courseName: t.courseName,
          amount: 0,
          studentCount: new Set(),
        };
      }
      byCourse[t.courseId].amount += t.amount;
      (byCourse[t.courseId].studentCount as Set<string>).add(t.studentId);
    });

    // Convert student sets to counts
    Object.keys(byCourse).forEach((courseId) => {
      byCourse[courseId].studentCount = (
        byCourse[courseId].studentCount as Set<string>
      ).size;
    });

    const totalCollected = completedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    const summaryData = {
      id: summaryId,
      month,
      year,
      fiscalYear: getCurrentFiscalYear(),
      revenue: {
        totalCollected,
        byPaymentMethod,
        byCourse,
        byFeeType,
      },
      updatedAt: Timestamp.now(),
    };

    if (summarySnap.exists()) {
      await updateDoc(summaryRef, summaryData);
    } else {
      const summaryCollectionRef = collection(db, FINANCIAL_SUMMARY_COLLECTION);
      await addDoc(summaryCollectionRef, summaryData);
    }
  } catch (error) {
    console.error("Error updating financial summary:", error);
    throw error;
  }
};

// Get financial summary for a month
export const getFinancialSummary = async (
  month: number,
  year: number,
): Promise<FinancialSummary | null> => {
  try {
    const summaryId = `${year}-${String(month).padStart(2, "0")}`;
    const summaryRef = doc(db, FINANCIAL_SUMMARY_COLLECTION, summaryId);
    const summarySnap = await getDoc(summaryRef);

    if (summarySnap.exists()) {
      return { id: summarySnap.id, ...summarySnap.data() } as FinancialSummary;
    }
    return null;
  } catch (error) {
    console.error("Error getting financial summary:", error);
    throw error;
  }
};

// Create installment plan
export const createInstallmentPlan = async (
  studentId: string,
  studentName: string,
  courseId: string,
  totalFees: number,
  discount: number,
  numberOfInstallments: number,
  startDate: Date,
): Promise<void> => {
  try {
    const installmentsRef = collection(db, INSTALLMENTS_COLLECTION);
    const netAmount = totalFees - discount;
    const installmentAmount = Math.round(netAmount / numberOfInstallments);

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const installment = {
        studentId,
        studentName,
        courseId,
        installmentNumber: i + 1,
        amount:
          i === numberOfInstallments - 1
            ? netAmount - installmentAmount * (numberOfInstallments - 1)
            : installmentAmount,
        dueDate: Timestamp.fromDate(dueDate),
        paidDate: null,
        paidAmount: 0,
        status: "pending" as InstallmentStatus,
        linkedTransactionId: "",
        reminderSent: false,
        lastReminderDate: null,
        notes: "",
        createdAt: Timestamp.now(),
      };

      await addDoc(installmentsRef, installment);
    }
  } catch (error) {
    console.error("Error creating installment plan:", error);
    throw error;
  }
};

// Get installments for a student
export const getStudentInstallments = async (
  studentId: string,
): Promise<FeeInstallment[]> => {
  try {
    const installmentsRef = collection(db, INSTALLMENTS_COLLECTION);
    const q = query(installmentsRef);

    const snapshot = await getDocs(q);
    let installments = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return convertInstallmentTimestamps(data);
    });

    // Client-side filtering and sorting
    installments = installments.filter((inst) => inst.studentId === studentId);
    installments.sort((a, b) => a.installmentNumber - b.installmentNumber);

    return installments;
  } catch (error) {
    console.error("Error getting student installments:", error);
    throw error;
  }
};

// Mark installment as paid
export const markInstallmentPaid = async (
  installmentId: string,
  transactionId: string,
  paidAmount: number,
): Promise<void> => {
  try {
    const installmentRef = doc(db, INSTALLMENTS_COLLECTION, installmentId);
    await updateDoc(installmentRef, {
      paidDate: Timestamp.now(),
      paidAmount,
      status: "paid",
      linkedTransactionId: transactionId,
    });
  } catch (error) {
    console.error("Error marking installment as paid:", error);
    throw error;
  }
};

// Get overdue installments
export const getOverdueInstallments = async (): Promise<FeeInstallment[]> => {
try {
  const installmentsRef = collection(db, INSTALLMENTS_COLLECTION);
  const q = query(installmentsRef);
  const snapshot = await getDocs(q);
    const allInstallments = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return convertInstallmentTimestamps(data);
    });

    // Filter for pending and overdue on client side
    const now = new Date();
    const overdue = allInstallments.filter(
      (inst) => inst.status === "pending" && new Date(inst.dueDate) < now,
    );

    // Sort by dueDate ascending
    overdue.sort((a, b) => {
      const dateA = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate);
      const dateB = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });

    return overdue;
  } catch (error) {
    console.error("Error getting overdue installments:", error);
    throw error;
  }
};

// Get transaction by ID
export const getTransactionById = async (
  id: string,
): Promise<FeeTransaction | null> => {
  try {
    const transactionRef = doc(db, TRANSACTIONS_COLLECTION, id);
    const transactionSnap = await getDoc(transactionRef);

    if (transactionSnap.exists()) {
      return {
        id: transactionSnap.id,
        ...transactionSnap.data(),
      } as FeeTransaction;
    }
    return null;
  } catch (error) {
    console.error("Error getting transaction:", error);
    throw error;
  }
};
