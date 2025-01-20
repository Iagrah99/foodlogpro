import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { spinner3 } from 'react-icons-kit/icomoon/spinner3';
import { checkUsernameExists, checkEmailExists, registerUser } from "../../utils/api";
import NavigationBar from "../components/NavigationBar";

const Register = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [dateJoined, setDateJoined] = useState(() => new Date().toISOString().split('T')[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const [isError, setIsError] = useState(false);
  const [error, setError,] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // States for email and username check
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(null); // null = unchecked, true = taken, false = available
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(null);

  // Separate error states for email and username
  const [emailError, setEmailError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [currentUser] = useState(JSON.parse(localStorage.getItem("loggedInUser")))

  useEffect(() => {
    if (currentUser?.username) {
      navigate('/my-meals')
    }
  }, [])

  useEffect(() => {
    // Validate form fields
    setIsFormValid(email && username && password && !passwordError);
  }, [email, username, password, passwordError]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    if (!password.trim()) return;
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 12 characters, with one uppercase letter, one number, and one symbol.");
    } else {
      setPasswordError(null);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const handleImageUpload = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setAvatarUrl(data.data.url);
      } else {
        console.error('Image upload failed:', data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleRegister = async (e) => {
    setIsError(false);
    e.preventDefault();
    const user = {
      email, username, password, avatar: avatarUrl, date_joined: dateJoined
    }
    // console.log(user.avatar)
    // console.log(avatarUrl)
    try {
      setIsLoading(true)
      const response = await registerUser(user);
      setIsLoading(false);
      setLoggedInUser(response.user)
      localStorage.setItem('loggedInUser', JSON.stringify(response.user))
      localStorage.setItem('token', JSON.stringify(response.token));
      setError(null)
      navigate('/my-meals')
    } catch (err) {
      console.log(err.response.data.msg)
      setIsLoading(false);
      setIsError(true);
      setError(err.response.data.msg);
    }
  };

  const handleEmailFocus = () => {
    setIsEmailTaken(null);
    setEmailError(null);
  };

  const handleUsernameFocus = () => {
    setIsUsernameTaken(null);
    setUsernameError(null);
  };

  const validateEmailPattern = () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const checkEmailTaken = async () => {
    if (!email.trim()) return;
    if (!validateEmailPattern()) return;

    setIsCheckingEmail(true);
    setIsEmailTaken(null);
    setEmailError(null);

    try {
      await checkEmailExists(email, "registration");
      setIsEmailTaken(false); // Email is available
    } catch (err) {
      setIsEmailTaken(true); // Email is taken
      setEmailError(err.response.data.msg);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const checkUsernameTaken = async () => {
    if (!username.trim()) return;

    setIsCheckingUsername(true);
    setIsUsernameTaken(null);
    setUsernameError(null);

    try {
      await checkUsernameExists(username);
      setIsUsernameTaken(false); // Username available
    } catch (err) {
      setIsUsernameTaken(true); // Username is taken
      setUsernameError(err.response.data.msg);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  return (
    <>
      <NavigationBar page="register" />
      <div
        className="relative flex justify-center items-center md:h-[calc(100vh)] h-screen bg-no-repeat"
        style={{
          backgroundImage: 'url(https://i.ibb.co/gVTH59S/bg-login.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for opacity */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg ring-1 ring-gray-300 p-8">
          <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
            Create Your Account
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Sign up to start tracking your meals.
          </p>

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleEmailFocus}
                onBlur={checkEmailTaken}
              />
              {isCheckingEmail && (
                <span className="absolute inset-y-11 right-0 flex items-center pr-3">
                  <Icon icon={spinner3} size={20} className="animate-spin text-indigo-500" />
                </span>
              )}
            </div>
            {isEmailTaken === false && email && (
              <p className="mt-2 text-sm text-green-500">Email is available!</p>
            )}
            {emailError && (
              <p className="mt-2 text-sm text-red-500">{emailError}</p>
            )}

            {/* Username Field */}
            <div className="relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Choose a username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleUsernameFocus}
                onBlur={checkUsernameTaken}
              />
              {isCheckingUsername && (
                <span className="absolute inset-y-11 right-0 flex items-center pr-3">
                  <Icon icon={spinner3} size={20} className="animate-spin text-indigo-500" />
                </span>
              )}
            </div>
            {isUsernameTaken === false && username && (
              <p className="mt-2 text-sm text-green-500">Username is available!</p>
            )}
            {usernameError && (
              <p className="mt-2 text-sm text-red-500">{usernameError}</p>
            )}

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                id="password"
                className="mt-1 block w-full p-2 pr-10 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Create a password"
                required
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                onFocus={() => setPasswordError(null)}
              />
              <span
                className="absolute inset-y-11 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
                onClick={handleTogglePassword}
              >
                <Icon icon={showPassword ? eye : eyeOff} size={25} />
              </span>
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-500">{passwordError}</p>
            )}

            {/* Avatar Upload Field */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Avatar (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="image"
                  className="block w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg shadow-sm bg-gray-50 placeholder-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setAvatarFile(file);
                    setIsError(false);
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${!isFormValid && "opacity-50 cursor-not-allowed"
                }`}
              disabled={!isFormValid}
            >
              Sign Up
            </button>
          </form>

          {isError && (
            <div className="mt-4 text-center text-red-500 text-sm">{error}</div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );


};

export default Register;
