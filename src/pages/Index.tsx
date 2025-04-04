
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { Stethoscope, User, FileText, BookOpen, Heart, Pill, ArrowRight, CheckCircle2 } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

const Index = () => {
  const { setRole, setIsAuthenticated, setUsername } = useUser();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  const roles = [
    { id: "doctor", name: "Doctor", icon: Stethoscope, color: "bg-blue-100 text-blue-600" },
    { id: "patient", name: "Patient", icon: User, color: "bg-green-100 text-green-600" },
    { id: "researcher", name: "Researcher", icon: FileText, color: "bg-purple-100 text-purple-600" },
    { id: "student", name: "Student", icon: BookOpen, color: "bg-yellow-100 text-yellow-600" },
    { id: "bloodbank", name: "Blood Bank", icon: Heart, color: "bg-red-100 text-red-600" },
    { id: "pharmaceutical", name: "Pharmaceutical", icon: Pill, color: "bg-indigo-100 text-indigo-600" }
  ];
  
  const testimonials = [
    {
      quote: "Medicare has revolutionized how I share my research findings with other professionals.",
      author: "Dr. Sarah Johnson",
      role: "Cardiologist",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "As a student, I can access the latest medical research all in one platform. It's been invaluable for my studies.",
      author: "Michael Chen",
      role: "Medical Student",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      quote: "We've been able to connect with hospitals nationwide through Medicare's platform.",
      author: "Lisa Rodriguez",
      role: "Blood Bank Manager",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "Collaborating with researchers around the world has never been easier.",
      author: "Dr. James Wilson",
      role: "Pharmaceutical Researcher",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  ];
  
  const features = [
    {
      title: "Collaborative Research",
      description: "Connect with peers and collaborate on groundbreaking medical research projects.",
      icon: <FileText className="w-10 h-10 text-medicare-blue" />
    },
    {
      title: "Knowledge Sharing",
      description: "Share your findings and access a vast library of medical knowledge and resources.",
      icon: <BookOpen className="w-10 h-10 text-medicare-teal" />
    },
    {
      title: "Global Network",
      description: "Join a worldwide community of healthcare professionals and researchers.",
      icon: <Heart className="w-10 h-10 text-medicare-accent" />
    }
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
      {/* Hero Section with Gradient Background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="absolute w-full h-full bg-grid-pattern opacity-10"></div>
        <div 
          className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-blue-100/30 blur-3xl"
          style={{ animation: "pulse 15s ease-in-out infinite alternate" }}
        ></div>
        <div 
          className="absolute -bottom-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-teal-100/30 blur-3xl"
          style={{ animation: "pulse 10s ease-in-out infinite alternate-reverse" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-5xl md:text-6xl font-bold text-medicare-dark leading-tight">
                The Future of <span className="text-medicare-blue">Healthcare</span> Collaboration
              </h1>
              <p className="text-xl text-gray-700 max-w-lg">
                Connecting healthcare professionals, researchers, and patients to share knowledge and advance medicine together.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-medicare-blue hover:bg-medicare-dark group transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button asChild size="lg" variant="outline" className="border-medicare-blue text-medicare-blue hover:bg-medicare-light">
                  <Link to="/feed">Explore Feed</Link>
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 relative animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="relative rounded-lg overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Medical collaboration" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </span>
                  <span>Trusted by 10,000+ healthcare professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-medicare-dark mb-4">Join as a...</h2>
            <p className="text-xl text-gray-600">
              Medicare connects all healthcare stakeholders in one collaborative platform. Select your role to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                  selectedRole === role.id 
                    ? "ring-2 ring-medicare-blue border-medicare-blue" 
                    : "border-transparent hover:border-gray-200"
                } animate-fade-in overflow-hidden group`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                onClick={() => setSelectedRole(role.id)}
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div 
                    className={`w-20 h-20 rounded-full ${role.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <role.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{role.name}</h3>
                  <p className="text-gray-600">
                    {getRoleDescription(role.id)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <Button 
              size="lg" 
              className="bg-medicare-blue hover:bg-medicare-dark text-lg px-10 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleContinue}
            >
              Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.name : "Selected Role"}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-medicare-dark mb-4">Why Choose Medicare?</h2>
            <p className="text-xl text-gray-600">
              Our platform provides powerful tools to connect, collaborate, and advance medical knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-medicare-dark mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">
              Hear from healthcare professionals who are already using Medicare.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto px-10">
            <Carousel
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-4">
                      <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="mb-4">
                            <svg width="35" height="30" viewBox="0 0 56 48" xmlns="http://www.w3.org/2000/svg" className="text-medicare-blue fill-current opacity-20">
                              <path d="M24 48V36C24 31.3333 22.75 27 20.25 23C17.75 19 14.1667 15.6667 9.5 13L13 0C20.1667 2.66667 26.5833 7 32.25 13C38.0833 18.8333 41 26.3333 41 35.5V48H24ZM55.5 48V36C55.5 31.3333 54.25 27 51.75 23C49.25 19 45.6667 15.6667 41 13L44.5 0C51.6667 2.66667 58.0833 7 63.75 13C69.5833 18.8333 72.5 26.3333 72.5 35.5V48H55.5Z"></path>
                            </svg>
                          </div>
                          <p className="text-gray-700 italic mb-6 flex-grow">{testimonial.quote}</p>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <img 
                                src={testimonial.avatar} 
                                alt={testimonial.author} 
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{testimonial.author}</p>
                              <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="static mx-2" />
                <CarouselNext className="static mx-2" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medicare-blue text-white relative overflow-hidden">
        <div 
          className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-3xl"
          style={{ animation: "pulse 8s ease-in-out infinite alternate" }}
        ></div>
        <div 
          className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "pulse 12s ease-in-out infinite alternate-reverse" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Healthcare Collaboration?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of healthcare professionals on Medicare today and start making a difference.
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-medicare-blue hover:bg-blue-50 border-white text-lg px-10 py-6 h-auto"
            >
              Get Started Today
            </Button>
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
