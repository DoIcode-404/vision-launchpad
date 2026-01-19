import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { IconPicker } from "@/components/IconPicker";
import { getIcon, getIconDisplayName } from "@/lib/icons";

interface Course {
  id: string;
  title: string;
  description: string;
  grades: string[];
  duration: string;
  instructor: string;
  category: string;
  features?: string[];
  batchSize?: string;
  iconName?: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grades: "",
    duration: "",
    instructor: "",
    category: "Core",
    features: "",
    batchSize: "",
    iconName: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Course[];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const courseData = {
        title: formData.title,
        description: formData.description,
        grades: formData.grades.split(",").map((g) => g.trim()),
        duration: formData.duration,
        instructor: formData.instructor,
        category: formData.category,
        features: formData.features
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
        batchSize: formData.batchSize,
        iconName: formData.iconName,
      };

      if (editingCourse) {
        await updateDoc(doc(db, "courses", editingCourse.id), courseData);
        setCourses(
          courses.map((c) =>
            c.id === editingCourse.id ? { ...c, ...courseData } : c,
          ),
        );
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        const docRef = await addDoc(collection(db, "courses"), courseData);
        setCourses([...courses, { id: docRef.id, ...courseData }]);
        toast({
          title: "Success",
          description: "Course created successfully",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Failed to save course",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      grades: course.grades.join(", "),
      duration: course.duration,
      instructor: course.instructor,
      category: course.category,
      features: (course.features || []).join("\n"),
      batchSize: course.batchSize || "",
      iconName: course.iconName || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteDoc(doc(db, "courses", id));
      setCourses(courses.filter((c) => c.id !== id));
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      grades: "",
      duration: "",
      instructor: "",
      category: "Core",
      features: "",
      batchSize: "",
      iconName: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-600 mt-1">{courses.length} total courses</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No courses yet. Create one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Grades</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Batch Size</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.title}
                    </TableCell>
                    <TableCell>{course.instructor}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {course.grades.slice(0, 3).map((grade, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            Grade {grade}
                          </Badge>
                        ))}
                        {course.grades.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.grades.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.batchSize || "N/A"}</TableCell>
                    <TableCell>
                      <Badge>{course.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Course Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? "Edit Course" : "Add New Course"}
            </DialogTitle>
            <DialogDescription>
              Fill in the course details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Course Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <IconPicker
                  selectedIcon={formData.iconName}
                  onIconSelect={(iconName) =>
                    setFormData({ ...formData, iconName })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Course description..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Grades (comma-separated)
                  </label>
                  <Input
                    value={formData.grades}
                    onChange={(e) =>
                      setFormData({ ...formData, grades: e.target.value })
                    }
                    placeholder="e.g., 6, 7, 8, 9, 10"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 12 months"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Instructor</label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) =>
                      setFormData({ ...formData, instructor: e.target.value })
                    }
                    placeholder="Instructor name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Core, Entrance"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Batch Size</label>
                <Input
                  value={formData.batchSize}
                  onChange={(e) =>
                    setFormData({ ...formData, batchSize: e.target.value })
                  }
                  placeholder="e.g., 10-15 students"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Features (one per line)
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="SEE & NEB Curriculum&#10;Board Exam Preparation&#10;Weekly Tests & Assessments"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCourses;
