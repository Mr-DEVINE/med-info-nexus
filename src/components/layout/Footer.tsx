
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-medicare-blue mb-2">Medicare</h3>
            <p className="text-gray-600 max-w-xs">
              Connecting healthcare professionals, researchers, and students to share knowledge and advance medicine.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Platform</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/" className="text-gray-600 hover:text-medicare-blue transition-colors">Home</Link></li>
                <li><Link to="/feed" className="text-gray-600 hover:text-medicare-blue transition-colors">Feed</Link></li>
                <li><Link to="/dashboard" className="text-gray-600 hover:text-medicare-blue transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-gray-800">Legal</h4>
              <ul className="flex flex-col gap-2">
                <li><Link to="/terms" className="text-gray-600 hover:text-medicare-blue transition-colors">Terms</Link></li>
                <li><Link to="/privacy" className="text-gray-600 hover:text-medicare-blue transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Medicare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
