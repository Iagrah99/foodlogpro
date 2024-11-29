import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { checkEmailExists } from "../../utils/api";

const ResetPassword = ({ setIsModalOpen }) => {
  const [email, setEmail] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailSent, setEmailSent] = useState(null);
  const [disableButton, setDisableButton] = useState(false); // Disable button for 10 seconds

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log("Password reset for email:", email);
    try {
      setIsEmailError(false);
      const emailExists = await checkEmailExists(email, "reset_password");
      setIsEmailSent(true);
      setEmailSent(emailExists);
      setDisableButton(true);

      // Revert button to default state after 10 seconds
      setTimeout(() => {
        setIsEmailSent(false);
        setDisableButton(false);
      }, 10000);
    } catch (err) {
      setIsEmailSent(false);
      setIsEmailError(true);
      setEmailError(err.response?.data?.msg || "An error occurred.");
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (isEmailError) {
      setIsEmailError(false); // Clear error state when user starts typing
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-300 w-full max-w-xl p-6 relative">
        <button
          onClick={() => {
            setIsModalOpen(false);
            setEmail("");
            setIsEmailSent(false);
          }}
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-2">
          Forgot Your Password?
        </h2>
        <p className="text-sm text-gray-800 text-center mb-4">
          Enter your email address, and we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleResetPassword}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            required
            autoComplete="off"
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            placeholder="Enter your email"
          />
          <div className="flex justify-center items-center mt-4">
            <button
              type="submit"
              className={`py-2 px-4 rounded-md shadow flex items-center justify-center transition ${isEmailError
                ? "bg-red-500 text-white hover:bg-red-600"
                : isEmailSent
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              disabled={disableButton} // Disable on loading or during the 10-second cooldown
            >
              {isEmailError ? (
                <>
                  No accounts linked to this email. <FontAwesomeIcon icon={faX} className="ml-2" />
                </>
              ) : isEmailSent ? (
                <>
                  Email sent! Check your inbox. <FontAwesomeIcon icon={faCheck} className="ml-2" />
                </>
              ) : (
                <>
                  Start Password Reset <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
