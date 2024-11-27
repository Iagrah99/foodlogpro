import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { checkEmailExists } from "../../utils/api";

const ResetPassword = ({ setIsModalOpen }) => {
  const [email, setEmail] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailSent, setEmailSent] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log("Password reset for email:", email);
    try {
      setIsEmailError(false)
      const emailExists = await checkEmailExists(email, "reset_password")
      setIsEmailSent(true);
      setEmailSent(emailExists)
    } catch (err) {
      setIsEmailSent(false);
      setIsEmailError(true)
      console.log(err)
      setEmailError(err.response?.data?.msg || "An error occured.")
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-300 w-full max-w-xl p-6 relative">
        <button
          onClick={() => { setIsModalOpen(false); setEmail(""); setIsEmailSent(false) }}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-2">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-800 text-center mb-4">
          Enter your email address, and we'll send you instructions to reset
          your password.
        </p>
        <form onSubmit={handleResetPassword}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); setIsEmailSent(false); }}
            required
            autoComplete="off"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="Enter your email"
          />
          <div className="flex justify-between items-center">
            <div className="mt-4 text-center font-semibold text-sm">
              {isEmailError ? (
                <span className="text-red-500">{emailError}</span>
              ) : isEmailSent ? (
                <span className="text-green-500">{emailSent}</span>
              ) : (
                <span>&nbsp;</span>
              )}
            </div>
            <button
              type="submit"
              className="mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow"
            >
              Send Instructions
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default ResetPassword
