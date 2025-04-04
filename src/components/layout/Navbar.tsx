
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { User, LogOut, Calendar, Heart, Pill } from "lucide-react";

const Navbar = () => {
  const { role, isAuthenticated, username, setIsAuthenticated, setRole } = useUser();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-medicare-blue font-bold text-2xl">Medicare</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-gray-600 hover:text-medicare-blue transition-colors">
                  Dashboard
                </Link>
                <Link to="/feed" className="text-gray-600 hover:text-medicare-blue transition-colors">
                  Feed
                </Link>
                {role === "patient" && (
                  <>
                    <Link to="/appointments" className="text-gray-600 hover:text-medicare-blue transition-colors flex items-center gap-1">
                      <Calendar size={16} /> Appointments
                    </Link>
                    <Link to="/bloodbank" className="text-gray-600 hover:text-medicare-blue transition-colors flex items-center gap-1">
                      <Heart size={16} /> Blood Bank
                    </Link>
                    <Link to="/pharmacy" className="text-gray-600 hover:text-medicare-blue transition-colors flex items-center gap-1">
                      <Pill size={16} /> Pharmacy
                    </Link>
                  </>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-medicare-blue transition-colors">
                  Profile
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 text-gray-600">
                  <User size={18} />
                  <span className="hidden md:inline">{username || "User"}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut size={18} />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
