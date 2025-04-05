import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Index = () => {
  const { isAuthenticated } = useUser();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-medicare-blue">
            MediCare
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-medicare-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-medicare-blue">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-medicare-blue">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-medicare-blue">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to MediCare</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive healthcare platform for patients, doctors, and healthcare providers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button size="lg" className="bg-medicare-blue hover:bg-medicare-dark">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="bg-medicare-blue hover:bg-medicare-dark">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
          
          <section className="py-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Appointments</h3>
                <p className="text-gray-600">Schedule and manage your appointments with ease.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Blood Bank</h3>
                <p className="text-gray-600">Find and request blood from our extensive network.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Pharmacy</h3>
                <p className="text-gray-600">Order your medications online and get them delivered.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6 text-center">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} MediCare. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
