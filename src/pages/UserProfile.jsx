import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { faUser, faLock, faCamera, faCrown, faChartBar, faStar, faUtensils, faDrumstickBite } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../components/NavigationBar";
import { updateUser, getUser } from "../../utils/api.js"; // Import the getUser function
import ToggleTheme from "../components/ToggleTheme";
import { format } from "date-fns";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUpdated, setAvatarUpdated] = useState(false);
  const [userMealsNum] = useState(JSON.parse(localStorage.getItem("userMealsNum")));
  const [mostFrequentMeal] = useState(localStorage.getItem("mostFrequentMeal"));

  const navigate = useNavigate();

  const [user, setUser] = useState({
    user_id: "",
    username: "",
    password: "",
    avatar: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false); // New state for saving/loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const {user_id} = loggedInUser;
        const userData = await getUser(token, user_id);
        setCurrentUser(userData);
        setUser({
          user_id: userData.user_id,
          username: userData.username,
          password: "",
          avatar: userData.avatar,
        });
        setUpdatedUser({
          user_id: userData.user_id,
          username: userData.username,
          password: "",
          avatar: userData.avatar,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedUser({ ...updatedUser, avatar: reader.result });
      };
      reader.readAsDataURL(file);

      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setIsSaving(true); // Start showing the spinner
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        console.log("Uploaded image URL:", data.data.url); // Logs the uploaded image URL
        setAvatarUrl(data.data.url); // Save the uploaded image URL in state
      } else {
        console.error("Image upload failed:", data.message); // Handle API errors
      }
    } catch (error) {
      console.error("Error uploading image:", error); // Handle network errors
    } finally {
      // Re-enable the button after 3 seconds
      setTimeout(() => setIsSaving(false), 3000);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      // Create a payload with only modified fields
      const payload = {};
      if (updatedUser.username !== user.username) {
        payload.username = updatedUser.username;
      }
      if (updatedUser.password) {
        // Include password only if it's provided
        payload.password = updatedUser.password;
      }
      if (avatarUrl && avatarUrl !== user.avatar) {
        // Use the uploaded avatar URL if available
        payload.avatar = avatarUrl;
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        return;
      }

      const updatedUserFromApi = await updateUser(user.user_id, payload, token); // Pass only the changes
      setUser({ ...user, ...updatedUserFromApi });
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...user, ...updatedUserFromApi })
      );
      setAvatarUpdated(true); // Toggle the state to trigger a re-render
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  if (!currentUser) {
    return <Spinner animation="border" role="status" />;
  }

  return (
    <>
      <NavigationBar avatarUpdated={avatarUpdated} setAvatarUpdated={setAvatarUpdated} />
      <div className="flex justify-center items-start min-h-screen pt-28 bg-gray-100 dark:bg-neutral-900">
        {/* Main Profile Section */}
        <div className="p-6 rounded-lg shadow-lg w-full max-w-lg mt-10 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-center flex-grow dark:text-white">
              User Profile
            </h1>
            <ToggleTheme />
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6 relative">
            <img
              src={updatedUser.avatar}
              alt="User Avatar"
              className={`h-48 w-48 rounded-full shadow-lg object-cover transition-opacity dark:shadow-lg dark:shadow-indigo-800 ${isSaving ? "opacity-50" : "opacity-100"}`}
            />
            {isSaving && (
              <div className="absolute h-48 w-48 rounded-full flex flex-col justify-center items-center bg-black bg-opacity-70 text-white">
                <Spinner animation="border" role="status" style={{ width: "2rem", height: "2rem" }} />
                <span className="mt-2">Uploading...</span>
              </div>
            )}
            {isEditing && (
              <div className="mt-2">
                <label
                  htmlFor="avatarInput"
                  className="cursor-pointer text-indigo-500 hover:text-indigo-600 flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Change Avatar</span>
                </label>
                <input
                  type="file"
                  id="avatarInput"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            )}
          </div>

          {/* Username Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 dark:text-gray-300">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring focus:ring-indigo-400 transition"
              />
            ) : (
              <p className="px-4 py-2 border bg-gray-100 dark:bg-gray-700 rounded-lg dark:text-white">{user.username}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 dark:text-gray-300">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Password
            </label>
            {isEditing ? (
              <input
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring focus:ring-indigo-400 transition"
                placeholder="Enter new password"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-100 border dark:bg-gray-700 rounded-lg dark:text-white">••••••••</p>
            )}
          </div>

          {/* Member Since Section */}
          {!isEditing && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 dark:text-white">
                <FontAwesomeIcon icon={faCrown} className="mr-2" />
                Member Since
              </label>
              <p className="px-4 py-2 bg-gray-100 border rounded-lg dark:bg-gray-700 dark:text-white">
                {format(new Date(currentUser.date_joined), "d MMMM yyyy")}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdateUser}
                  className={`px-4 py-2 rounded-lg shadow text-white transition ${isSaving
                    ? "bg-indigo-500 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                    }`}
                  disabled={isSaving}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setUpdatedUser(user);
                    setIsSaving(false);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition w-full"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* User Stats Sidebar */}
        <div className="p-6 rounded-lg shadow-lg w-fit ml-8 mt-10 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-gray-700 text-2xl text-center font-bold mb-4 dark:text-white">
            User Statistics
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 space-y-3 dark:bg-gray-800 dark:text-white">
            {/* Meals Logged */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUtensils} className="text-indigo-500 mr-2" />
              <span className="font-medium">Meals Logged:</span>
              <span className="ml-2">{userMealsNum}</span>
            </div>
            {/* Most Frequently Eaten Meal */}
            <div className="flex items-center">
              <FontAwesomeIcon icon={faDrumstickBite} className="text-red-500 mr-2" />
              <span className="font-medium">Most Eaten Meal:</span>
              <span className="ml-2">{mostFrequentMeal}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/my-meals")}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition mt-4 w-full"
          >
            View Meals
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;