import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { Student } from "@/types/student.types";
import {
  createStudent,
  uploadStudentDocument,
} from "@/services/studentService";

interface Course {
  id: string;
  title: string;
  [key: string]: unknown;
}
import { createInstallmentPlan } from "@/services/financeService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  PROVINCES,
  getDistrictsByProvince,
  RELATIONS,
  EDUCATION_LEVELS,
  EDUCATION_BOARDS,
} from "@/lib/nepal-data";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddStudentDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: AddStudentDialogProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const { currentUser } = useAdmin();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    citizenship: "",
    province: "",
    district: "",
    municipality: "",
    wardNo: "",
    tole: "",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianOccupation: "",

    // Academic Info
    courseId: "",
    courseName: "",
    batch: "",
    academicYear: "",
    prevEducationLevel: "",
    prevInstitution: "",
    prevBoard: "",
    prevPassedYear: "",

    // Financial Info
    totalFees: "",
    discount: "",
    discountReason: "",
    admissionFee: "",
    installments: "1",
  });

  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchCourses();
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    if (formData.province) {
      setDistricts(getDistrictsByProvince(formData.province));
      setFormData((prev) => ({ ...prev, district: "", municipality: "" }));
    }
  }, [formData.province]);

  const fetchCourses = async () => {
    try {
      const coursesSnapshot = await getDocs(collection(db, "courses"));
      const coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      citizenship: "",
      province: "",
      district: "",
      municipality: "",
      wardNo: "",
      tole: "",
      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
      guardianOccupation: "",
      courseId: "",
      courseName: "",
      batch: "",
      academicYear: "",
      prevEducationLevel: "",
      prevInstitution: "",
      prevBoard: "",
      prevPassedYear: "",
      totalFees: "",
      discount: "",
      discountReason: "",
      admissionFee: "",
      installments: "1",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourseSelect = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    setFormData((prev) => ({
      ...prev,
      courseId,
      courseName: course?.title || "",
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.phone &&
          formData.dateOfBirth &&
          formData.province &&
          formData.district
        );
      case 2:
        return !!(formData.courseId && formData.batch && formData.academicYear);
      case 3:
        return !!(formData.totalFees && Number(formData.totalFees) > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const totalFees = Number(formData.totalFees);
      const discount = Number(formData.discount) || 0;
      const netAmount = totalFees - discount;

      const studentData: Omit<
        Student,
        "id" | "createdAt" | "updatedAt" | "studentId"
      > = {
        personalInfo: {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: new Date(formData.dateOfBirth),
          gender: formData.gender as "male" | "female" | "other",
          citizenship: formData.citizenship,
          address: {
            province: formData.province,
            district: formData.district,
            municipality: formData.municipality,
            wardNo: Number(formData.wardNo),
            tole: formData.tole,
          },
          guardianInfo: {
            name: formData.guardianName,
            relation: formData.guardianRelation,
            phone: formData.guardianPhone,
            occupation: formData.guardianOccupation,
          },
        },
        academicInfo: {
          enrollmentDate: new Date(),
          courseId: formData.courseId,
          courseName: formData.courseName,
          batch: formData.batch,
          academicYear: formData.academicYear,
          status: "active",
          previousEducation: {
            level: formData.prevEducationLevel,
            institution: formData.prevInstitution,
            board: formData.prevBoard,
            passedYear: formData.prevPassedYear,
          },
        },
        financialInfo: {
          totalFees,
          paidAmount: 0,
          pendingAmount: netAmount,
          discount,
          discountReason: formData.discountReason,
          admissionFee: Number(formData.admissionFee) || 0,
        },
        documents: {
          photo: "",
          citizenship: "",
          marksheet: "",
          certificates: [],
        },
        createdBy: currentUser.uid,
      };

      const studentId = await createStudent(studentData, currentUser.uid);

      // Create installment plan if requested
      const numberOfInstallments = Number(formData.installments);
      if (numberOfInstallments > 1) {
        await createInstallmentPlan(
          studentId,
          `${formData.firstName} ${formData.lastName}`,
          formData.courseId,
          totalFees,
          discount,
          numberOfInstallments,
          new Date(),
        );
      }

      toast({
        title: "Success",
        description: "Student added successfully!",
      });

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
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
          <DialogTitle>Add New Student - Step {step} of 3</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter student's personal information"}
            {step === 2 && "Enter academic information"}
            {step === 3 && "Enter fee structure and financial details"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+977-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleInputChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="citizenship">Citizenship No.</Label>
                  <Input
                    id="citizenship"
                    value={formData.citizenship}
                    onChange={(e) =>
                      handleInputChange("citizenship", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) =>
                        handleInputChange("province", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        handleInputChange("district", value)
                      }
                      disabled={!formData.province}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="municipality">Municipality</Label>
                    <Input
                      id="municipality"
                      value={formData.municipality}
                      onChange={(e) =>
                        handleInputChange("municipality", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="wardNo">Ward No.</Label>
                    <Input
                      id="wardNo"
                      type="number"
                      value={formData.wardNo}
                      onChange={(e) =>
                        handleInputChange("wardNo", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tole">Tole/Locality</Label>
                    <Input
                      id="tole"
                      value={formData.tole}
                      onChange={(e) =>
                        handleInputChange("tole", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianName">Guardian Name</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) =>
                        handleInputChange("guardianName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianRelation">Relation</Label>
                    <Select
                      value={formData.guardianRelation}
                      onValueChange={(value) =>
                        handleInputChange("guardianRelation", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONS.map((relation) => (
                          <SelectItem key={relation} value={relation}>
                            {relation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="guardianPhone">Guardian Phone</Label>
                    <Input
                      id="guardianPhone"
                      value={formData.guardianPhone}
                      onChange={(e) =>
                        handleInputChange("guardianPhone", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="guardianOccupation">Occupation</Label>
                    <Input
                      id="guardianOccupation"
                      value={formData.guardianOccupation}
                      onChange={(e) =>
                        handleInputChange("guardianOccupation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courseId">Course *</Label>
                  <Select
                    value={formData.courseId}
                    onValueChange={handleCourseSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="batch">Batch *</Label>
                  <Input
                    id="batch"
                    value={formData.batch}
                    onChange={(e) => handleInputChange("batch", e.target.value)}
                    placeholder="e.g., 2026-A"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  value={formData.academicYear}
                  onChange={(e) =>
                    handleInputChange("academicYear", e.target.value)
                  }
                  placeholder="e.g., 2081/82 BS or 2025/26 AD"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Previous Education</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prevEducationLevel">Level</Label>
                    <Select
                      value={formData.prevEducationLevel}
                      onValueChange={(value) =>
                        handleInputChange("prevEducationLevel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prevBoard">Board/University</Label>
                    <Select
                      value={formData.prevBoard}
                      onValueChange={(value) =>
                        handleInputChange("prevBoard", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_BOARDS.map((board) => (
                          <SelectItem key={board} value={board}>
                            {board}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="prevInstitution">Institution Name</Label>
                    <Input
                      id="prevInstitution"
                      value={formData.prevInstitution}
                      onChange={(e) =>
                        handleInputChange("prevInstitution", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="prevPassedYear">Passed Year</Label>
                    <Input
                      id="prevPassedYear"
                      value={formData.prevPassedYear}
                      onChange={(e) =>
                        handleInputChange("prevPassedYear", e.target.value)
                      }
                      placeholder="e.g., 2080 BS"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalFees">Total Fees (NPR) *</Label>
                  <Input
                    id="totalFees"
                    type="number"
                    value={formData.totalFees}
                    onChange={(e) =>
                      handleInputChange("totalFees", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="admissionFee">Admission Fee (NPR)</Label>
                  <Input
                    id="admissionFee"
                    type="number"
                    value={formData.admissionFee}
                    onChange={(e) =>
                      handleInputChange("admissionFee", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount">Discount (NPR)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="discountReason">Discount Reason</Label>
                  <Input
                    id="discountReason"
                    value={formData.discountReason}
                    onChange={(e) =>
                      handleInputChange("discountReason", e.target.value)
                    }
                    placeholder="e.g., Scholarship, Merit"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="installments">Number of Installments</Label>
                <Select
                  value={formData.installments}
                  onValueChange={(value) =>
                    handleInputChange("installments", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Full Payment)</SelectItem>
                    <SelectItem value="2">2 Installments</SelectItem>
                    <SelectItem value="3">3 Installments</SelectItem>
                    <SelectItem value="4">4 Installments</SelectItem>
                    <SelectItem value="6">6 Installments</SelectItem>
                    <SelectItem value="12">12 Installments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Fees:</span>
                    <span>
                      Rs. {Number(formData.totalFees || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>
                      - Rs. {Number(formData.discount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Net Amount:</span>
                    <span>
                      Rs.{" "}
                      {(
                        Number(formData.totalFees || 0) -
                        Number(formData.discount || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  {Number(formData.installments) > 1 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Per Installment:</span>
                      <span>
                        Rs.{" "}
                        {Math.round(
                          (Number(formData.totalFees || 0) -
                            Number(formData.discount || 0)) /
                            Number(formData.installments),
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <div>
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Student
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
