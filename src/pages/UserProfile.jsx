import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { faUser, faLock, faCamera } from "@fortawesome/free-solid-svg-icons";
import NavigationBar from "../components/NavigationBar";
import { updateUser } from "../../utils/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarUpdated, setAvatarUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state to prevent rendering until check is done

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user); // Set the user if found
    }
    setIsLoading(false); // Set loading to false once check is done
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Prevent rendering sensitive parts until the user check is complete
  }

  if (!currentUser) {
    return null; // Prevent rendering if user is not logged in
  }

  const [user, setUser] = useState({
    user_id: currentUser.user_id,
    username: currentUser.username,
    password: "",
    avatar: currentUser.avatar,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
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
        console.log("Uploaded image URL:", data.data.url);
        setAvatarUrl(data.data.url);
      } else {
        console.error("Image upload failed:", data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const payload = {};

      if (updatedUser.username !== user.username) {
        payload.username = updatedUser.username;
      }
      if (updatedUser.password) {
        payload.password = updatedUser.password;
      }
      if (avatarUrl && avatarUrl !== user.avatar) {
        payload.avatar = avatarUrl;
      }

      if (Object.keys(payload).length === 0) {
        setIsEditing(false);
        return;
      }

      const updatedUserFromApi = await updateUser(user.user_id, payload, token);
      setUser({ ...user, ...updatedUserFromApi });
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...user, ...updatedUserFromApi })
      );
      setAvatarUpdated(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <>
      <NavigationBar avatarUpdated={avatarUpdated} setAvatarUpdated={setAvatarUpdated} />
      <div className="flex justify-center items-center min-h-screen pt-28 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-10">
          <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={updatedUser.avatar}
              alt="User Avatar"
              className="h-48 w-48 rounded-full shadow-lg object-cover"
            />

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
            <label className="block text-gray-700 font-medium mb-2">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.username}</p>
            )}
          </div>

          {/* Password Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              Password
            </label>
            {isEditing ? (
              <input
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="Enter new password"
              />
            ) : (
              <p className="px-4 py-2 bg-gray-100 rounded-lg">••••••••</p>
            )}
          </div>

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
                  disabled={isSaving} // Disable when loading
                >
                  {isSaving ?
                    <div className="flex justify-between w-40 items-center">
                      <Spinner animation="border" role="status"
                        style={{ width: '1rem', height: '1rem' }}
                      />
                      {"Uploading Image... "}
                    </div>
                    : "Save Changes"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-400 transition"
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
      </div>

    </>
  );
};

export default UserProfile;
