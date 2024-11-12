import NavigationBar from "../components/NavigationBar"
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye'
import { Spinner } from "react-bootstrap"
import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/api";
import { UserContext } from "../contexts/UserContext";

const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text')
    } else {
      setIcon(eyeOff)
      setType('password')
    }
  }

  const handleLogin = async (e) => {
    setIsError(false)
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("username", username)
    } else {
      localStorage.removeItem("username")
    }
    try {
      setIsLoggingIn(true)
      const userDetails = await loginUser(username, password)
      setIsLoggingIn(false)
      setLoggedInUser(userDetails.user)
      localStorage.setItem('loggedInUser', JSON.stringify(userDetails.user));
      localStorage.setItem('token', JSON.stringify(userDetails.token));
      setError(null)
      navigate('/my-meals')
    } catch (err) {
      setIsError(true)
      setError(err.response.data.msg)
      setIsLoggingIn(false)
    }
  }

  const updateLoginInfo = (e) => {
    if (e.target.id === 'username') {
      setUsername(e.target.value)
    } else if (e.target.id === 'password') {
      setPassword(e.target.value)
    }
    setIsError(false)
  }

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked)
    console.log(e.target.checked)
  }

  return (
    <>
      <NavigationBar page="login" />
      <div className="flex justify-center items-center md:h-[calc(100vh)] h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg ring-1 ring-gray-300 p-8">
          <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
            Welcome Back!
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8">
            Log in to continue tracking your meals.
          </p>

          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full p-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Enter your Username"
                autoComplete="off"
                required
                value={username}
                onChange={(e) => updateLoginInfo(e)}
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type={type}
                id="password"
                className="mt-1 block w-full p-2 pr-10 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="Enter your password"
                autoComplete="off"
                required
                value={password}
                onChange={(e) => updateLoginInfo(e)}
              />

              <span
                className="absolute inset-y-11 right-0 flex items-center pr-3 cursor-pointer text-gray-600"
                onClick={handleToggle}
              >
                <Icon icon={icon} size={25} />
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 bg-gray-200 rounded"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoggingIn}
            >
              Sign in
            </button>
          </form>

          {isError && (
            <div className="mt-4 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {isLoggingIn && (
            <div className="flex items-center justify-center mt-3 text-indigo-500">
              <Spinner
                animation="border"
                role="status"
                style={{ width: '1.25rem', height: '1.25rem' }}
              />
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </div>
      </div>

    </>
  )
}

export default Login
