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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (location.pathname === "/my-meals" || location.pathname === "/my-profile") {
      setIsScrolled(true);
    }

    const handleScroll = () => {
      if (location.pathname === "/my-meals") {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 800);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ease-in-out ${isScrolled ? 'bg-gray-100 text-gray-900 shadow-md' : 'bg-transparent text-white shadow-none'}`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className={`${isScrolled ? 'text-green-500' : 'text-green-300'}  text-4xl font-semibold no-underline text-shadow-lg`}>
          FoodLogPro
        </a>

        {/* Navigation links for larger screens and mobile menu */}
        <div className="lg:block space-x-6">
          {loggedInUser ? (
            <div className="flex items-center space-x-4">
              <img
                src={loggedInUser.avatar}
                alt="User Avatar"
                className="h-14 w-14 rounded-full cursor-pointer object-cover"
                onClick={() => navigate('/my-profile')}
              />
              <a
                onClick={handleLogout}
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg cursor-pointer`}
              >
                Logout
              </a>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
              >
                Login
              </a>
              <a
                href="/register"
                className={`text-2xl ${isScrolled ? 'text-gray-800' : 'text-gray-200'} font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
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
