
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-medicare-blue text-9xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you were looking for. It might have been removed, 
          renamed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-medicare-blue hover:bg-medicare-dark">
            <Link to="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-medicare-blue text-medicare-blue">
            <Link to="/feed">Explore Feed</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
