import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminContacts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-1">Manage all contact form submissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No contacts yet. Submissions will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContacts;
