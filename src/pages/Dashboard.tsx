
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, User, FileText, BookOpen, Heart, Pill, TrendingUp, Users, 
  Clock, Bell, Calendar, ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { role, isAuthenticated, username } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const getUserIcon = () => {
    switch (role) {
      case "doctor":
        return <Stethoscope className="w-12 h-12 text-medicare-blue" />;
      case "patient":
        return <User className="w-12 h-12 text-green-600" />;
      case "researcher":
        return <FileText className="w-12 h-12 text-purple-600" />;
      case "student":
        return <BookOpen className="w-12 h-12 text-yellow-600" />;
      case "bloodbank":
        return <Heart className="w-12 h-12 text-red-600" />;
      case "pharmaceutical":
        return <Pill className="w-12 h-12 text-indigo-600" />;
      default:
        return <User className="w-12 h-12 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-full shadow-sm">
                {getUserIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {username}</h1>
                <p className="text-gray-600 capitalize">{role} Dashboard</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/feed")} 
              className="bg-medicare-blue hover:bg-medicare-dark"
            >
              Go to Feed
            </Button>
          </div>

          {role === "patient" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
              <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-medicare-blue">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-medicare-blue" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Schedule appointments with doctors</p>
                  <Link to="/appointments">
                    <Button className="w-full bg-medicare-blue hover:bg-medicare-dark">Book Appointment</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Blood Bank
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Purchase blood products for medical needs</p>
                  <Link to="/bloodbank">
                    <Button className="w-full bg-red-500 hover:bg-red-600">Visit Blood Bank</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-medicare-teal">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-medicare-teal" />
                    Pharmacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Purchase medications and prescriptions</p>
                  <Link to="/pharmacy">
                    <Button className="w-full bg-medicare-teal hover:bg-teal-600">Visit Pharmacy</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Your recent platform activities</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-blue rounded-full"></div>
                    <p className="text-sm">You viewed a research post</p>
                    <span className="ml-auto text-xs text-muted-foreground">2m ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-blue rounded-full"></div>
                    <p className="text-sm">You logged into the platform</p>
                    <span className="ml-auto text-xs text-muted-foreground">5m ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Trending Topics</CardTitle>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Popular topics in your field</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-teal rounded-full"></div>
                    <p className="text-sm">Advances in Cancer Treatment</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-teal rounded-full"></div>
                    <p className="text-sm">COVID-19 Long-term Effects</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-teal rounded-full"></div>
                    <p className="text-sm">AI in Medical Diagnostics</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                <Bell className="w-5 h-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Your latest notifications</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-accent rounded-full"></div>
                    <p className="text-sm">New research published in your field</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-medicare-accent rounded-full"></div>
                    <p className="text-sm">Welcome to Medicare!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {renderRoleSpecificContent()}
        </div>
      </div>
    </Layout>
  );

  function renderRoleSpecificContent() {
    switch (role) {
      case "doctor":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Research</CardTitle>
                <CardDescription>Contribute to the medical community by sharing your findings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                  Create Research Post
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Appointments</CardTitle>
                <CardDescription>View and manage your upcoming patient appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> View Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "patient":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Access Medical Information</CardTitle>
              <CardDescription>Stay informed with the latest medical research</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                Explore Research Feed
              </Button>
            </CardContent>
          </Card>
        );
      case "researcher":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Research</CardTitle>
                <CardDescription>Share your findings with the medical community</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                  Create Research Post
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Opportunities</CardTitle>
                <CardDescription>Find partners for your research projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Find Collaborators
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "student":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Educational Resources</CardTitle>
              <CardDescription>Access the latest medical research for your studies</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                Browse Research Feed
              </Button>
            </CardContent>
          </Card>
        );
      case "bloodbank":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Share Updates</CardTitle>
                <CardDescription>Publish information about blood availability and research</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                  Create Update
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Inventory</CardTitle>
                <CardDescription>Track and update your blood product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> View Inventory
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "pharmaceutical":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Research</CardTitle>
                <CardDescription>Share clinical trial results and research findings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/feed")} className="w-full bg-medicare-blue hover:bg-medicare-dark">
                  Create Research Post
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>Update your product catalog and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Pill className="mr-2 h-4 w-4" /> View Products
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  }
};

export default Dashboard;
