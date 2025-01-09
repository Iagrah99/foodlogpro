import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Function to handle scroll events for background change
    const handleScroll = () => {
      // Apply scrolled styles after threshold
      setIsScrolled(window.scrollY > 40);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer
      className={`fixed bottom-0 w-full z-10 transition-all duration-300 ease-in-out ${isScrolled ? "bg-gray-100 text-gray-900" : "bg-transparent text-gray-900"
        }`}
    >
      <div className="container mx-auto flex justify-between items-center py-2 px-6">
        {/* Left side content */}
        <div className="text-gray-600 text-sm flex items-center">
          <a>&copy; 2025 FoodLogPro. All rights reserved.</a>
        </div>

        {/* Right side links */}
        <div className="lg:block space-x-6 flex items-center">
          <a
            href="/faq"
            className={`text-sm ${isScrolled ? "text-gray-800" : "text-gray-200"} font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
          >
            FAQ
          </a>
          <a
            href="/"
            className={`text-sm ${isScrolled ? "text-gray-800" : "text-gray-200"} font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
