import NavigationBar from "../components/NavigationBar"

const Login = () => {
  return (
    <>
      <NavigationBar />
      <div className="flex justify-center items-center md:h-[calc(100vh-65px)] h-screen bg-gradient-to-b from-gray-600 to-gray-700">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-2xl ring-1 ring-gray-700 p-8">
          <h2 className="text-3xl font-semibold text-center text-indigo-400 mb-6">
            Welcome Back!
          </h2>
          <p className="text-center text-sm text-gray-400 mb-8">
            Log in to continue tracking your meals.
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400"
                placeholder="Enter your Username"
                autoComplete="off"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400"
                placeholder="Enter your password"
                autoComplete="off"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-500 bg-gray-700 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-500 hover:text-indigo-400">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-indigo-500 hover:text-indigo-400">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
