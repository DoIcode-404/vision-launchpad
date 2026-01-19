import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminFaculty = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600 mt-1">Manage faculty members and their details</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Faculty Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No faculty members yet. Add one to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFaculty;
