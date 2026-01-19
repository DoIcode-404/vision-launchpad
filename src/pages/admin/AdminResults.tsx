import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface ResultEntry {
  id: string;
  name: string;
  exam: string;
  rank: string;
  score: string;
  initials: string;
  color: string; // tailwind bg-* class
}

const COLOR_OPTIONS = [
  "bg-amber-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
];

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
  return initials;
};

const AdminResults = () => {
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ResultEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "exam" | "date">("date");
  const [form, setForm] = useState({
    name: "",
    exam: "",
    rank: "",
    score: "",
    initials: "",
    color: COLOR_OPTIONS[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    const run = async () => {
      try {
        const qs = await getDocs(collection(db, "results"));
        const data = qs.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ResultEntry, "id">),
        }));
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
        toast({
          title: "Error",
          description: "Failed to load results",
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
    if (!form.name.trim()) {
      toast({ title: "Error", description: "Student name is required", variant: "destructive" });
      return;
    }
    if (!form.exam.trim()) {
      toast({ title: "Error", description: "Exam name is required", variant: "destructive" });
      return;
    }
    if (!form.rank.trim()) {
      toast({ title: "Error", description: "Rank is required", variant: "destructive" });
      return;
    }
    if (!form.score.trim()) {
      toast({ title: "Error", description: "Score is required", variant: "destructive" });
      return;
    }
    
    try {
      const payload = {
        name: form.name.trim(),
        exam: form.exam.trim(),
        rank: form.rank.trim(),
        score: form.score.trim(),
        initials: form.initials || getInitials(form.name),
        color: form.color,
      };

      if (editing) {
        await updateDoc(doc(db, "results", editing.id), payload);
        setResults(
          results.map((r) => (r.id === editing.id ? { ...r, ...payload } : r)),
        );
        toast({ title: "Updated", description: "Result updated successfully" });
      } else {
        const ref = await addDoc(collection(db, "results"), payload);
        setResults([...results, { id: ref.id, ...payload }]);
        toast({ title: "Created", description: "Result created successfully" });
      }

      handleClose();
    } catch (error) {
      console.error("Error saving result:", error);
      toast({
        title: "Error",
        description: "Failed to save result",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (entry: ResultEntry) => {
    setEditing(entry);
    setForm({
      name: entry.name,
      exam: entry.exam,
      rank: entry.rank,
      score: entry.score,
      initials: entry.initials,
      color: entry.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this result?")) return;
    try {
      await deleteDoc(doc(db, "results", id));
      setResults(results.filter((r) => r.id !== id));
      toast({ title: "Deleted", description: "Result deleted" });
    } catch (error) {
      console.error("Error deleting result:", error);
      toast({
        title: "Error",
        description: "Failed to delete result",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setEditing(null);
    setForm({
      name: "",
      exam: "",
      rank: "",
      score: "",
      initials: "",
      color: COLOR_OPTIONS[0],
    });
  };

  const filteredResults = results
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.exam.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "exam") return a.exam.localeCompare(b.exam);
      return 0; // date added (insertion order)
    });

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
            Results Management
          </h1>
          <p className="text-gray-600 mt-1">{results.length} total entries</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search by name or exam..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                className="border rounded-md h-10 px-3 md:w-40"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "exam" | "date")}
              >
                <option value="date">Sort by: Date Added</option>
                <option value="name">Sort by: Name</option>
                <option value="exam">Sort by: Exam</option>
              </select>
            </div>
          </div>

          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {results.length === 0
                  ? "No results yet. Add one to get started."
                  : "No results match your search."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Initials</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.exam}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {r.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.score}</TableCell>
                    <TableCell>{r.initials}</TableCell>
                    <TableCell>
                      <div
                        className={`w-6 h-6 rounded-full inline-block align-middle ${r.color}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(r)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(r.id)}
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
              {editing ? "Edit Result" : "Add New Result"}
            </DialogTitle>
            <DialogDescription>Enter topper details below</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Student Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      initials: f.initials || getInitials(name),
                    }));
                  }}
                  placeholder="e.g., Bikash Thapa"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Exam</label>
                  <Input
                    value={form.exam}
                    onChange={(e) => setForm({ ...form, exam: e.target.value })}
                    placeholder="e.g., IOE Entrance 2024"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rank</label>
                  <Input
                    value={form.rank}
                    onChange={(e) => setForm({ ...form, rank: e.target.value })}
                    placeholder="e.g., Rank 45 / Top 1% / School Topper"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Score</label>
                  <Input
                    value={form.score}
                    onChange={(e) =>
                      setForm({ ...form, score: e.target.value })
                    }
                    placeholder="e.g., 98.5% / GPA 4.0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Initials</label>
                  <Input
                    value={form.initials}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        initials: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Auto-generated from name"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Badge Color</label>
                <select
                  className="w-full border rounded-md h-10 px-3"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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

export default AdminResults;
