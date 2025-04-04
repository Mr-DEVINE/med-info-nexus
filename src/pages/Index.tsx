
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { Stethoscope, User, FileText, BookOpen, Heart, Pill } from "lucide-react";

const Index = () => {
  const { setRole, setIsAuthenticated, setUsername } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles = [
    { id: "doctor", name: "Doctor", icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
    { id: "patient", name: "Patient", icon: User, color: "bg-green-100 text-green-600" },
    { id: "researcher", name: "Researcher", icon: FileText, color: "bg-purple-100 text-purple-600" },
    { id: "student", name: "Student", icon: BookOpen, color: "bg-yellow-100 text-yellow-600" },
    { id: "bloodbank", name: "Blood Bank", icon: Heart, color: "bg-red-100 text-red-600" },
    { id: "pharmaceutical", name: "Pharmaceutical", icon: Pill, color: "bg-indigo-100 text-indigo-600" }
  ];
  
  const handleContinue = () => {
    if (!selectedRole) {
      toast({
        title: "Role selection required",
        description: "Please select a role to continue",
        variant: "destructive",
      });
      return;
    }
    
    // Demo mode - normally this would be handled by auth
    setRole(selectedRole as any);
    setIsAuthenticated(true);
    setUsername(`Demo ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`);
    
    toast({
      title: "Welcome to Medicare!",
      description: `You're now logged in as a ${selectedRole}.`,
    });
    
    navigate("/dashboard");
  };

  return (
    <Layout>
      <section className="relative bg-gradient-to-b from-medicare-light to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-medicare-dark">
            Welcome to <span className="text-medicare-blue">Medicare</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
            Connecting healthcare professionals, researchers, and patients to share knowledge and advance medicine
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-medicare-blue hover:bg-medicare-dark">
              <Link to="/feed">Explore Feed</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-medicare-blue text-medicare-blue hover:bg-medicare-light">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Join as a...</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((role) => (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRole === role.id ? "ring-2 ring-medicare-blue" : ""
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {getRoleDescription(role.id)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              size="lg" 
              className="bg-medicare-blue hover:bg-medicare-dark"
              onClick={handleContinue}
            >
              Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.name : "Selected Role"}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">How Medicare Works</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our platform connects all healthcare stakeholders in one collaborative ecosystem
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-medicare-light rounded-full flex items-center justify-center text-medicare-blue font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
              <p className="text-gray-600">
                Doctors, researchers, blood banks and pharmaceutical companies can share their latest findings and research.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-medicare-light rounded-full flex items-center justify-center text-medicare-blue font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Access Information</h3>
              <p className="text-gray-600">
                Students and patients can access valuable medical information and stay updated with the latest advancements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-medicare-light rounded-full flex items-center justify-center text-medicare-blue font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
              <p className="text-gray-600">
                Connect with other professionals in your field to collaborate on research and projects.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

const getRoleDescription = (roleId: string): string => {
  switch (roleId) {
    case "doctor":
      return "Share your medical findings, connect with colleagues, and stay updated with latest research.";
    case "patient":
      return "Access reliable medical information and connect with healthcare providers.";
    case "researcher":
      return "Share your research, find collaborators, and access data from healthcare providers.";
    case "student":
      return "Access educational resources, research papers, and connect with professionals.";
    case "bloodbank":
      return "Share availability updates, research on blood preservation, and connect with hospitals.";
    case "pharmaceutical":
      return "Share research findings, clinical trial results, and connect with healthcare providers.";
    default:
      return "";
  }
};

export default Index;
