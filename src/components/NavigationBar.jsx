import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LogoutModal from "./LogoutModal";

const NavigationBar = ({ avatarUpdated, setAvatarUpdated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/login", { state: { message: "You have been logged out successfully." } });
  };


  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  useEffect(() => {
    if (avatarUpdated) {
      const updatedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedInUser(updatedUser);
      setAvatarUpdated(false)
    }
  }, [avatarUpdated, setLoggedInUser]);


  useEffect(() => {
    if (location.pathname === "/my-meals" || location.pathname === "/my-profile") {
      setIsScrolled(true);
    }

    const handleScroll = () => {
      if (location.pathname === "/my-meals") {
        setIsScrolled(true);
      } else if (location.pathname === "/") {
        setIsScrolled(window.scrollY > 800);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? "bg-gray-100 text-gray-900 shadow-md" : "bg-transparent text-white shadow-none"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <a
            href="/"
            className={`${isScrolled ? "text-green-500" : "text-green-300"
              } text-4xl font-semibold no-underline text-shadow-lg`}
          >
            FoodLogPro
          </a>

          <div className="lg:block space-x-6">
            {loggedInUser ? (
              <div className="flex items-center space-x-4">
                <img
                  src={loggedInUser.avatar}
                  alt="User Avatar"
                  className="h-14 w-14 rounded-full cursor-pointer object-cover"
                  onClick={() => navigate("/my-profile")}
                />
                <button
                  onClick={toggleModal}
                  className={`text-2xl ${isScrolled ? "text-gray-800" : "text-gray-200"
                    } font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className={`text-2xl ${isScrolled ? "text-gray-800" : "text-gray-200"
                    } font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
                >
                  Login
                </a>
                <a
                  href="/register"
                  className={`text-2xl ${isScrolled ? "text-gray-800" : "text-gray-200"
                    } font-semibold no-underline transition duration-300 py-2 px-6 rounded-lg`}
                >
                  Sign Up
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <LogoutModal toggleModal={toggleModal} handleLogout={handleLogout} />
      )}
    </>
  );
};

export default NavigationBar;
