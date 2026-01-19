import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Eye, CheckCircle } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentGrade: string;
  subject: string;
  message: string;
  status: string;
  createdAt: any;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const contactsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Contact[];
      setContacts(contactsData);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts(contacts.filter((c) => c.id !== id));
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "contacts", id), {
        status: newStatus,
      });
      setContacts(
        contacts.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const filteredContacts =
    filterStatus === "all"
      ? contacts
      : contacts.filter((c) => c.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      new: "default",
      contacted: "secondary",
      resolved: "destructive",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-1">
            {filteredContacts.length} total submissions
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No contacts found. Submissions will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>{contact.studentGrade || "N/A"}</TableCell>
                    <TableCell>
                      <Select
                        value={contact.status}
                        onValueChange={(value) =>
                          handleStatusChange(contact.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {contact.createdAt?.toDate?.()?.toLocaleDateString() ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contact.id)}
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

      {/* View Contact Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Submitted on{" "}
              {selectedContact?.createdAt?.toDate?.()?.toLocaleString() || "N/A"}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1">{selectedContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1">{selectedContact.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Student Grade
                  </label>
                  <p className="mt-1">{selectedContact.studentGrade || "N/A"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="mt-1">{selectedContact.subject || "N/A"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;
