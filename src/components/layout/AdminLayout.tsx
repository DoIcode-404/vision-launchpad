import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import {
  LayoutDashboard,
  Mail,
  BookOpen,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, currentUser } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Contacts",
      icon: Mail,
      href: "/admin/contacts",
    },
    {
      label: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
    },
    {
      label: "Faculty",
      icon: Users,
      href: "/admin/faculty",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">VL</span>
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg text-primary">Vision</span>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {sidebarOpen && (
            <p className="text-xs text-gray-500 px-2 font-medium">
              {currentUser?.email}
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome,{" "}
              <span className="font-semibold">
                {currentUser?.email?.split("@")[0]}
              </span>
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
