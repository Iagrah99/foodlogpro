import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const NavigationBar = ({ page }) => {

  const navigate = useNavigate();
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
      if (window.scrollY > 800) { // Adjust scroll threshold
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-white text-gray-900 shadow-md' : 'bg-transparent text-gray-900'}`}
    >

      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="text-indigo-500 text-3xl font-semibold no-underline">
          FoodLogPro
        </a>

        {/* Navigation links for larger screens and mobile menu */}
        <div className={`lg:block space-x-6`}>
          {loggedInUser ? (
            <a
              onClick={handleLogout}
              className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} ${isLoginPage && 'text-gray-800 hover:text-gray-800'} font-semibold no-underline transition duration-300 opacity-100 py-2 px-6 rounded-lg cursor-pointer`}
            >
              Logout
            </a>
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
