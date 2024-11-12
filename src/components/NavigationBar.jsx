import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const NavigationBar = ({ page }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to access the current path
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
    navigate("/login");
  };

  const [isLoginPage, setIsLoginPage] = useState(page === "login")
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Function to handle scroll events
    const handleScroll = () => {
      // If on the /meals page, change the navbar immediately on scroll
      if (location.pathname === "/my-meals") {
        setIsScrolled(true);
      } else {
        // For other pages, only trigger scroll styles after a certain threshold
        if (window.scrollY > 800) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]); // Re-run this effect when the URL changes

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-gray-100 text-gray-900' : 'bg-transparent text-gray-900'}`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="text-indigo-500 text-3xl font-semibold no-underline">
          FoodLogPro
        </a>

        {/* Navigation links for larger screens and mobile menu */}
        <div className="lg:block space-x-6">
          {loggedInUser ? (
            <div className="flex items-center space-x-4"> {/* Flex container with spacing */}
              <img
                src={loggedInUser.avatar}
                alt="User Avatar"
                className="h-14 w-14 rounded-full"
              />
              <a
                onClick={handleLogout}
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} ${isLoginPage && 'text-gray-800 hover:text-gray-800'} font-semibold no-underline transition duration-300 opacity-100 py-2 px-6 rounded-lg cursor-pointer`}
              >
                Logout
              </a>
            </div>

          ) : (
            <>
              <a
                href="/login"
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} ${isLoginPage && 'text-gray-800 hover:text-gray-800'} font-semibold no-underline transition duration-300 opacity-100 py-2 px-6 rounded-lg`}
              >
                Login
              </a>
              <a
                href="/register"
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} ${isLoginPage && 'text-gray-800 hover:text-gray-800'} font-semibold no-underline transition duration-300 opacity-100 py-2 px-6 rounded-lg`}
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
