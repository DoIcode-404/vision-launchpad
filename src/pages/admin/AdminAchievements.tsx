import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Achievement {
  id: string;
  year: string;
  ioe: string;
  iom: string;
  board90: string;
  boardToppers: string;
}

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState({
    year: new Date().getFullYear().toString(),
    ioe: "",
    iom: "",
    board90: "",
    boardToppers: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        const qs = await getDocs(collection(db, "achievements"));
        const data = qs.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Achievement, "id">),
        }));
        setAchievements(
          data.sort((a, b) => parseInt(b.year) - parseInt(a.year)),
        );
      } catch (error) {
        console.error("Error fetching achievements:", error);
        toast({
          title: "Error",
          description: "Failed to load achievements",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.year.trim()) {
      toast({
        title: "Error",
        description: "Year is required",
        variant: "destructive",
      });
      return;
    }
    if (
      !form.ioe.trim() ||
      !form.iom.trim() ||
      !form.board90.trim() ||
      !form.boardToppers.trim()
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        year: form.year.trim(),
        ioe: form.ioe.trim(),
        iom: form.iom.trim(),
        board90: form.board90.trim(),
        boardToppers: form.boardToppers.trim(),
      };

      if (editing) {
        await updateDoc(doc(db, "achievements", editing.id), payload);
        setAchievements(
          achievements.map((a) =>
            a.id === editing.id ? { ...a, ...payload } : a,
          ),
        );
        toast({
          title: "Updated",
          description: "Achievement updated successfully",
        });
      } else {
        const ref = await addDoc(collection(db, "achievements"), payload);
        setAchievements([{ id: ref.id, ...payload }, ...achievements]);
        toast({
          title: "Created",
          description: "Achievement created successfully",
        });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving achievement:", error);
      toast({
        title: "Error",
        description: "Failed to save achievement",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: Achievement) => {
    setEditing(entry);
    setForm({
      year: entry.year,
      ioe: entry.ioe,
      iom: entry.iom,
      board90: entry.board90,
      boardToppers: entry.boardToppers,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement record?")) return;
    try {
      await deleteDoc(doc(db, "achievements", id));
      setAchievements(achievements.filter((a) => a.id !== id));
      toast({ title: "Deleted", description: "Achievement deleted" });
    } catch (error) {
      console.error("Error deleting achievement:", error);
      toast({
        title: "Error",
        description: "Failed to delete achievement",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditing(null);
    setForm({
      year: new Date().getFullYear().toString(),
      ioe: "",
      iom: "",
      board90: "",
      boardToppers: "",
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
            Year-wise Achievements
          </h1>
          <p className="text-gray-600 mt-1">
            {achievements.length} achievement records
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No achievements yet. Add one to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-center">IOE Selections</TableHead>
                  <TableHead className="text-center">IOM Selections</TableHead>
                  <TableHead className="text-center">90%+ in Boards</TableHead>
                  <TableHead className="text-center">School Toppers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((ach) => (
                  <TableRow key={ach.id}>
                    <TableCell className="font-semibold text-primary">
                      {ach.year}
                    </TableCell>
                    <TableCell className="text-center text-secondary font-semibold">
                      {ach.ioe}
                    </TableCell>
                    <TableCell className="text-center text-secondary font-semibold">
                      {ach.iom}
                    </TableCell>
                    <TableCell className="text-center text-secondary font-semibold">
                      {ach.board90}
                    </TableCell>
                    <TableCell className="text-center text-secondary font-semibold">
                      {ach.boardToppers}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(ach)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ach.id)}
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

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Achievement" : "Add New Achievement"}
            </DialogTitle>
            <DialogDescription>
              Enter year-wise performance details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Year</label>
                <Input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g., 2024"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">IOE Selections</label>
                  <Input
                    value={form.ioe}
                    onChange={(e) => setForm({ ...form, ioe: e.target.value })}
                    placeholder="e.g., 12 or 12+"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">IOM Selections</label>
                  <Input
                    value={form.iom}
                    onChange={(e) => setForm({ ...form, iom: e.target.value })}
                    placeholder="e.g., 8 or 8+"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">90%+ in Boards</label>
                  <Input
                    value={form.board90}
                    onChange={(e) =>
                      setForm({ ...form, board90: e.target.value })
                    }
                    placeholder="e.g., 35+ or 35"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">School Toppers</label>
                  <Input
                    value={form.boardToppers}
                    onChange={(e) =>
                      setForm({ ...form, boardToppers: e.target.value })
                    }
                    placeholder="e.g., 5 or 5+"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAchievements;
