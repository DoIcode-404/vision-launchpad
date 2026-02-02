import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Student, StudentStatus } from "@/types/student.types";

const STUDENTS_COLLECTION = "students";

// Generate unique student ID
export const generateStudentId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const studentsRef = collection(db, STUDENTS_COLLECTION);
  const snapshot = await getDocs(studentsRef);
  const count = snapshot.size + 1;
  return `NV${year}${String(count).padStart(4, "0")}`;
};

// Create a new student
export const createStudent = async (
  studentData: Omit<Student, "id" | "createdAt" | "updatedAt" | "studentId">,
  currentUserId: string,
): Promise<string> => {
  try {
    const studentId = await generateStudentId();
    const studentsRef = collection(db, STUDENTS_COLLECTION);

    const newStudent = {
      ...studentData,
      studentId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: currentUserId,
    };

    const docRef = await addDoc(studentsRef, newStudent);
    return docRef.id;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

// Update student
export const updateStudent = async (
  id: string,
  updates: Partial<Student>,
): Promise<void> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    await updateDoc(studentRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

// Helper function to convert Firestore Timestamps to Dates
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertTimestamps = (data: any): Student => {
  return {
    ...data,
    personalInfo: {
      ...data.personalInfo,
      dateOfBirth:
        data.personalInfo.dateOfBirth?.toDate?.() ||
        data.personalInfo.dateOfBirth,
    },
    academicInfo: {
      ...data.academicInfo,
      enrollmentDate:
        data.academicInfo.enrollmentDate?.toDate?.() ||
        data.academicInfo.enrollmentDate,
    },
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  } as Student;
};

// Get student by ID
export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const data = { id: studentSnap.id, ...studentSnap.data() };
      return convertTimestamps(data);
    }
    return null;
  } catch (error) {
    console.error("Error getting student:", error);
    throw error;
  }
};

// Get all students with optional filters
interface StudentFilters {
  courseId?: string;
  status?: StudentStatus;
  batch?: string;
  searchTerm?: string;
}

export const getAllStudents = async (
  filters?: StudentFilters,
): Promise<Student[]> => {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const queryConstraints: QueryConstraint[] = [];

    // Only add orderBy if no filters to avoid composite index requirement
    // If filters exist, we'll sort client-side
    const hasFilters = filters?.courseId || filters?.status || filters?.batch;

    if (!hasFilters) {
      queryConstraints.push(orderBy("createdAt", "desc"));
    }

    const q =
      queryConstraints.length > 0
        ? query(studentsRef, ...queryConstraints)
        : query(studentsRef);
    const querySnapshot = await getDocs(q);

    let students = querySnapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      return convertTimestamps(data);
    });

    // Client-side filtering
    if (filters?.courseId) {
      students = students.filter(
        (student) => student.academicInfo.courseId === filters.courseId,
      );
    }

    if (filters?.status) {
      students = students.filter(
        (student) => student.academicInfo.status === filters.status,
      );
    }

    if (filters?.batch) {
      students = students.filter(
        (student) => student.academicInfo.batch === filters.batch,
      );
    }

    // Client-side search if search term provided
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      students = students.filter(
        (student) =>
          student.personalInfo.firstName.toLowerCase().includes(searchLower) ||
          student.personalInfo.lastName.toLowerCase().includes(searchLower) ||
          student.studentId.toLowerCase().includes(searchLower) ||
          student.personalInfo.email.toLowerCase().includes(searchLower),
      );
    }

    // Sort by createdAt descending (client-side)
    students.sort((a, b) => {
      const dateA =
        a.createdAt instanceof Date ? a.createdAt : a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB =
        b.createdAt instanceof Date ? b.createdAt : b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return students;
  } catch (error) {
    console.error("Error getting students:", error);
    throw error;
  }
};

// Delete student
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const studentRef = doc(db, STUDENTS_COLLECTION, id);
    await deleteDoc(studentRef);
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

// Upload student document
export const uploadStudentDocument = async (
  file: File,
  studentId: string,
  documentType: string,
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${studentId}_${documentType}_${timestamp}`;
    const storageRef = ref(storage, `students/${studentId}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Get students by course
export const getStudentsByCourse = async (
  courseId: string,
): Promise<Student[]> => {
  return getAllStudents({ courseId });
};

// Get active students count
export const getActiveStudentsCount = async (): Promise<number> => {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const q = query(studentsRef, where("academicInfo.status", "==", "active"));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error getting active students count:", error);
    throw error;
  }
};

// Get students with pending payments
export const getStudentsWithPendingPayments = async (): Promise<Student[]> => {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const q = query(
      studentsRef,
      where("financialInfo.pendingAmount", ">", 0),
      orderBy("financialInfo.pendingAmount", "desc"),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
  } catch (error) {
    console.error("Error getting students with pending payments:", error);
    throw error;
  }
};

// Update student financial info
export const updateStudentFinancialInfo = async (
  studentId: string,
  paidAmount: number,
): Promise<void> => {
  try {
    const student = await getStudentById(studentId);
    if (!student) throw new Error("Student not found");

    const newPaidAmount = student.financialInfo.paidAmount + paidAmount;
    const pendingAmount =
      student.financialInfo.totalFees -
      student.financialInfo.discount -
      newPaidAmount;

    await updateStudent(studentId, {
      financialInfo: {
        ...student.financialInfo,
        paidAmount: newPaidAmount,
        pendingAmount: Math.max(0, pendingAmount),
      },
    });
  } catch (error) {
    console.error("Error updating student financial info:", error);
    throw error;
  }
};
