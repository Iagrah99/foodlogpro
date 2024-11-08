const NavigationBar = () => {
  return (
    <nav className="bg-gray-900 text-white border-b border-gray-700 shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <a href="/" className="text-2xl font-semibold text-indigo-400 hover:text-indigo-300">
          Weekly Meals
        </a>
        <div className="flex space-x-6">
          <a
            href="/login"
            className="text-gray-300 hover:text-indigo-400 transition duration-300"
          >
            Login
          </a>
          <a
            href="/register"
            className="text-gray-300 hover:text-indigo-400 transition duration-300"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>

  )
}

export default NavigationBar
