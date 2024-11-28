import { useState, useEffect, useContext } from "react";
import { getUserMeals, removeMeal, updateMeal } from "../../utils/api";
import NavigationBar from "../components/NavigationBar";
import Loading from "../components/Loading";
import AddMeal from "../components/AddMeal";
import { UserContext } from "../contexts/UserContext";
import { format } from 'date-fns'
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import MealName from "../components/MealName";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [IsOpen, setIsOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    setIsUpdated(false)
    if (!loggedInUser) {
      navigate('/login');
      return; // Exit if no user is logged in
    }

    if (error && error === "Forbidden: Invalid token") {
      setLoggedInUser(null);
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('token');
      navigate("/login");
    };

    const fetchMeals = async () => {
      // let elapsedSeconds = 0;
      setIsLoading(true);

      // Start a timer to track elapsed time
      // const timer = setInterval(() => {
      //   elapsedSeconds += 1;
      // }, 1000);

      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const userId = loggedInUser.user_id;
        const mealsFromApi = await getUserMeals(userId, token);

        // clearInterval(timer); // Stop the timer once we get a response

        // Calculate remaining delay to reach 1 second, if necessary
        // const remainingDelay = Math.max(0, 1000 - elapsedSeconds * 1000);

        // Apply remaining delay if the request was shorter than 1 second
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, remainingDelay);

        setMeals(mealsFromApi);
        setIsLoading(false);
      } catch (err) {
        // clearInterval(timer); // Stop the timer on error
        setIsLoading(false);
        setIsError(true);
        setError(err.response?.data?.msg || 'An error occurred');
      }
    };

    fetchMeals();
  }, [loggedInUser, navigate, isUpdated, isDeleted]);

  const handleDeleteMeal = async (meal_id) => {
    setIsDeleted(false)
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await removeMeal(meal_id, token)
      setIsDeleted(true)
    } catch (err) {
      setIsError(true);
      setError(err.response.data.msg)
    }
  }

  const handleUpdateMeal = async (meal_id, updateValue, valueType) => {
    setIsUpdated(false);
    const token = JSON.parse(localStorage.getItem("token"));

    // Backup original meals for rollback on failure
    const originalMeals = [...meals];

    // Optimistically update the local state
    const updatedMeals = meals.map((meal) =>
      meal.meal_id === meal_id ? { ...meal, [valueType]: updateValue } : meal
    );
    setMeals(updatedMeals);

    try {
      // Perform the API call
      await updateMeal(meal_id, updateValue, valueType, token);
      setIsUpdated(true); // Indicate successful update
    } catch (err) {
      // On error, revert to the original state
      setMeals(originalMeals);
      setIsError(true);
      console.log(err);
      setError(err.response?.data?.msg || "Failed to update meal");
    }
  };


  return (
    <>
      <NavigationBar page="login" />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="flex flex-col justify-center items-center text-center min-h-screen font-bold">
          <div className="text-red-500 text-lg font-semibold">
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="p-12 bg-gray-100  min-h-screen py-32">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-grow text-center">
              <h2 className="text-2xl font-semibold text-gray-900">My Meals</h2>
            </div>
            <button
              className="ml-auto px-6 py-2 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 transition"
              onClick={() => { setIsOpen(true) }}
            >
              Add New Meal
            </button>

            {IsOpen && <AddMeal setIsOpen={setIsOpen} setIsUpdated={setIsUpdated} />}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="pl-20 py-3 text-left text-base font-medium text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Source</th>
                  {/* <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Ingredients</th> */}
                  <th className="px-10 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Last Eaten</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {meals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-800">
                      No meals to display. Please add some meals to see them here.
                    </td>
                  </tr>
                ) : (
                  meals.map((meal) => (
                    <tr key={meal.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                      <td className="mx-6 py-1 whitespace-nowrap">
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="w-48 h-48 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded"></div>
                        )}
                      </td>
                      <MealName
                        value={meal.name}
                        onSave={(newValue) => {
                          handleUpdateMeal(meal.meal_id, newValue, "name")
                        }}
                      />
                      <td className="px-2 py-4 whitespace-nowrap text-center text-base text-gray-700">{meal.source}</td>
                      {/* <td className="px-2 py-4 text-base text-gray-700">
                        <div className="flex flex-wrap gap-2">
                          {meal.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="bg-gray-200 text-center rounded-full px-4 py-2 text-gray-700"
                            >
                              {ingredient.trim()}
                            </span>
                          ))}
                        </div>
                      </td> */}
                      <td className="px-2 py-4 whitespace-nowrap text-center text-base text-gray-600">
                        {meal.last_eaten
                          ? format(new Date(meal.last_eaten), 'EEEE, dd/MM/yyyy')
                          : 'N/A'}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap text-base text-center font-semibold">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const ratingValue = index + 1;
                          if (meal.rating >= ratingValue) {
                            return <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-500" />;
                          } else if (meal.rating >= ratingValue - 0.5) {
                            return <FontAwesomeIcon key={index} icon={faStarHalfAlt} className="text-yellow-500" />;
                          } else {
                            return <FontAwesomeIcon key={index} icon={faStar} className="text-gray-400" />;
                          }
                        })}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteMeal(meal.meal_id)}
                          className="px-6 mr-3 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </>

  );
};

export default Meals;
