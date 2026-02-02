import { Timestamp } from "firebase/firestore";

export interface StudentAddress {
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  tole: string;
}

export interface GuardianInfo {
  name: string;
  relation: string;
  phone: string;
  occupation: string;
}

export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  citizenship: string;
  address: StudentAddress;
  guardianInfo: GuardianInfo;
}

export interface PreviousEducation {
  level: string;
  institution: string;
  board: string;
  passedYear: string;
}

export interface AcademicInfo {
  enrollmentDate: Date;
  courseId: string;
  courseName: string;
  batch: string;
  academicYear: string;
  status: "active" | "inactive" | "completed" | "dropout";
  previousEducation: PreviousEducation;
}

export interface FinancialInfo {
  totalFees: number;
  paidAmount: number;
  pendingAmount: number;
  discount: number;
  discountReason: string;
  admissionFee: number;
}

export interface StudentDocuments {
  photo: string;
  citizenship: string;
  marksheet: string;
  certificates: string[];
}

export interface Student {
  id: string;
  studentId: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  financialInfo: FinancialInfo;
  documents: StudentDocuments;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export type StudentStatus = "active" | "inactive" | "completed" | "dropout";
export type Gender = "male" | "female" | "other";
