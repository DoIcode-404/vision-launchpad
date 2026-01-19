import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, User, Upload, X } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  experience: string;
  imageUrl?: string;
  quote?: string;
}

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subjects: "",
    experience: "",
    quote: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const facultyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Faculty[];
      setFaculty(facultyData);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast({
        title: "Error",
        description: "Failed to load faculty",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingFaculty?.imageUrl || "";

      // Upload image if new file selected
      if (imageFile) {
        const timestamp = Date.now();
        const fileName = `faculty/${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);

        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);

        // Delete old image if updating
        if (editingFaculty?.imageUrl) {
          try {
            const oldImageRef = ref(storage, editingFaculty.imageUrl);
            await deleteObject(oldImageRef);
          } catch (error) {
            console.log("Error deleting old image:", error);
          }
        }
      }

      const facultyData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        qualification: formData.qualification,
        subjects: formData.subjects.split(",").map((s) => s.trim()),
        experience: formData.experience,
        quote: formData.quote,
        imageUrl: imageUrl || undefined,
      };

      if (editingFaculty) {
        await updateDoc(doc(db, "faculty", editingFaculty.id), facultyData);
        setFaculty(
          faculty.map((f) =>
            f.id === editingFaculty.id ? { ...f, ...facultyData } : f,
          ),
        );
        toast({
          title: "Success",
          description: "Faculty updated successfully",
        });
      } else {
        const docRef = await addDoc(collection(db, "faculty"), facultyData);
        setFaculty([...faculty, { id: docRef.id, ...facultyData }]);
        toast({
          title: "Success",
          description: "Faculty added successfully",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast({
        title: "Error",
        description: "Failed to save faculty",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member: Faculty) => {
    setEditingFaculty(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      qualification: member.qualification,
      subjects: member.subjects.join(", "),
      experience: member.experience,
      quote: member.quote || "",
    });
    setImagePreview(member.imageUrl || "");
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?"))
      return;

    try {
      await deleteDoc(doc(db, "faculty", id));
      setFaculty(faculty.filter((f) => f.id !== id));
      toast({
        title: "Success",
        description: "Faculty deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast({
        title: "Error",
        description: "Failed to delete faculty",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFaculty(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      qualification: "",
      subjects: "",
      experience: "",
      quote: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
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
            Faculty Management
          </h1>
          <p className="text-gray-600 mt-1">{faculty.length} faculty members</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Faculty Members</CardTitle>
        </CardHeader>
        <CardContent>
          {faculty.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No faculty members yet. Add one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subjects</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.subjects.join(", ")}</TableCell>
                    <TableCell>{member.experience}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
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

      {/* Add/Edit Faculty Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFaculty
                ? "Edit Faculty Member"
                : "Add New Faculty Member"}
            </DialogTitle>
            <DialogDescription>
              Fill in the faculty member details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Profile Image</label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Ram Kumar Shrestha"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+977 98XXXXXXXX"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Qualification</label>
                <Input
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                  placeholder="e.g., M.Sc. Mathematics"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Subjects (comma-separated)
                </label>
                <Input
                  value={formData.subjects}
                  onChange={(e) =>
                    setFormData({ ...formData, subjects: e.target.value })
                  }
                  placeholder="e.g., Mathematics, Physics"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Experience</label>
                <Input
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  placeholder="e.g., 5 years"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quote (Optional)</label>
                <Textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  placeholder="e.g., Teaching is my passion..."
                  rows={2}
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
              <Button type="submit" disabled={uploading}>
                {uploading
                  ? "Uploading..."
                  : editingFaculty
                    ? "Update Faculty"
                    : "Add Faculty"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFaculty;
