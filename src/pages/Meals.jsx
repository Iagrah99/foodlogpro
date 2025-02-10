import { useState, useEffect, useContext } from "react";
import { getUserMeals, removeMeal, updateMeal } from "../../utils/api";
import NavigationBar from "../components/NavigationBar";
import Loading from "../components/Loading";
import AddMeal from "../components/AddMeal";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faTrashAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import MealName from "../components/MealName";
import DeleteMealModal from "../components/DeleteMealModal";
import MealSource from "../components/MealSource";
import MealImage from "../components/MealImage";
import MealLastEaten from "../components/MealLastEaten";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [IsOpen, setIsOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [selectedMealId, setSelectedMealId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [originalMeals, setOriginalMeals] = useState(null);

  const [isDeleted, setIsDeleted] = useState(false);

  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const sortByQuery = searchParams.get("sort_by");
  const orderByQuery = searchParams.get("order_by");

  useEffect(() => {
    // Skip fetching meals if there's no loggedInUser
    if (!loggedInUser) {
      navigate("/login");
      return; // Exit if no user is logged in
    }

    // Handle invalid token error and log out the user
    if (error && error === "Forbidden: Invalid token") {
      setLoggedInUser(null);
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("token");
      navigate("/login", {
        state: { msg: "Your session has expired, please log in again." },
      });
    }

    const fetchMeals = async () => {
      setIsLoading(true);
      setFilterText("");
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        // console.log(token)
        const userId = loggedInUser.user_id;
        const mealsFromApi = await getUserMeals(userId, sortByQuery, orderByQuery, token);
        localStorage.setItem(
          "userMealsNum",
          JSON.stringify(mealsFromApi.length)
        );
        setMeals(mealsFromApi);
        setOriginalMeals(mealsFromApi);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        setError(err.response?.data?.msg || "An error occurred");
      }
    };

    fetchMeals();
  }, [loggedInUser, navigate, error, isDeleted, isUpdated, sortByQuery, orderByQuery]);

  useEffect(() => {
    if (meals.length > 0) {
      // Filter out "freezer" and "frozen pizza"
      const filteredMeals = meals.filter(
        (meal) =>
          meal.name !== "Freezer" &&
          meal.name !== "Frozen Pizza" &&
          meal.name !== "Mighty Meat Feast Pizza"
      );

      if (filteredMeals.length > 0) {
        const mealCounts = filteredMeals.reduce((acc, meal) => {
          acc[meal.name] = (acc[meal.name] || 0) + 1;
          return acc;
        }, {});

        const mostFrequent = Object.keys(mealCounts).reduce((a, b) =>
          mealCounts[a] > mealCounts[b] ? a : b
        );

        localStorage.setItem("mostFrequentMeal", mostFrequent);
      } else {
        localStorage.removeItem("mostFrequentMeal");
      }
    }
  }, [meals]);

  const toggleModal = (meal_id = null) => {
    setSelectedMealId(meal_id);
    setIsModalOpen(!isModalOpen);
  };

  const handleDeleteMeal = async (meal_id) => {
    setIsDeleted(false);
    const token = JSON.parse(localStorage.getItem("token"));
    try {
      await removeMeal(meal_id, token);
      setIsDeleted(true);
    } catch (err) {
      setIsError(true);
      setError(err.response.data.msg);
    }
  };

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
      await updateMeal(meal_id, updateValue, valueType, token);
      // console.log(token);
      setIsUpdated(true); // Indicate successful update
    } catch (err) {
      // On error, revert to the original state
      setMeals(originalMeals);
      setIsError(true);
      setError(err.response?.data?.msg || "Failed to update meal");
    }
  };

  const handleFilterMeals = (e) => {
    const value = e.target.value;
    setFilterText(value);

    if (value === "") {
      setMeals(originalMeals); // Reset to the original list if the filter text is empty
    } else {
      const filteredMeals = originalMeals.filter((meal) =>
        meal.name.toLowerCase().includes(value.toLowerCase())
      );
      setMeals(filteredMeals); // Update the meals with the filtered list
    }
  };

  const handleSortBy = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort_by", e.target.value);
    setSearchParams(newParams);
  };

  const handleOrderBy = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", e.target.value);
    setSearchParams(newParams);
  }

  return (
    <>
      <NavigationBar page="login" />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="flex flex-col justify-center items-center text-center min-h-screen font-bold">
          <div className="text-red-500 text-lg font-semibold">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="p-12 bg-gray-100 dark:bg-neutral-900 min-h-screen py-32">
          <div className="flex-grow text-center">
            {/* <h2 className="text-4xl font-semibold text-gray-900 dark:text-white">My Meals</h2> */}
          </div>
          <div className="flex justify-between items-center w-full mb-6">
            {/* Input and Selects Container - Takes Up Half Width */}
            <div className="flex justify-between items-center w-1/2">
              <input
                type="text"
                placeholder="Search Meals"
                className="w-2/5 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                onChange={(e) => handleFilterMeals(e)}
                value={filterText}
              />

              {/* Grouping the select elements together, positioned at the end */}
              <div className="flex gap-x-4 w-3/5 justify-end">
                <select
                  value={sortByQuery || ""}
                  onChange={(e) => handleSortBy(e)}
                  className="border p-2 rounded w-max bg-slate-50 dark:bg-gray-800 dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Sort By</option>
                  <option value="name">Name</option>
                  <option value="last_eaten">Last Eaten</option>
                  <option value="rating">Rating</option>
                </select>

                <select
                  value={orderByQuery || ""}
                  onChange={(e) => { handleOrderBy(e) }}
                  className="border p-2 rounded w-max bg-slate-50 dark:bg-gray-800 dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Order By</option>
                  <option value="desc">Latest</option>
                  <option value="asc">Oldest</option>
                </select>
              </div>
            </div>

            {/* Button remains on the right side */}
            <button
              className="px-6 py-3 bg-indigo-500 text-white rounded shadow hover:bg-indigo-600 transition transform hover:scale-110"
              onClick={() => setIsOpen(true)}
              title="Add New Meal"
            >
              <FontAwesomeIcon icon={faPlus} className="text-2xl" />
            </button>

            {IsOpen && (
              <AddMeal setIsOpen={setIsOpen} setIsUpdated={setIsUpdated} />
            )}
          </div>



          <div className="overflow-x-auto">
            <table className="min-w-full dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
              <thead className="bg-gray-200 dark:bg-gray-900">
                <tr>
                  <th className="pl-20 py-3 text-left text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th
                    className="px-10 py-3 text-center text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    style={{ minWidth: "200px" }}
                  >
                    Last Eaten
                  </th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    &nbsp;
                  </th>
                </tr>
              </thead>
              <tbody>
                {meals.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-gray-800 dark:text-gray-300"
                    >
                      No meals to display. Please add some meals to see them
                      here.
                    </td>
                  </tr>
                ) : (
                  meals.map((meal) => (
                    <tr
                      key={meal.meal_id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <td className="mx-6 py-1 whitespace-nowrap">
                        {meal.image ? (
                          <MealImage
                            value={meal.image}
                            onSave={(newImageUrl) => {
                              handleUpdateMeal(
                                meal.meal_id,
                                newImageUrl,
                                "image"
                              );
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-300 rounded dark:bg-gray-600"></div>
                        )}
                      </td>
                      <MealName
                        value={meal.name}
                        onSave={(newValue) => {
                          handleUpdateMeal(meal.meal_id, newValue, "name");
                        }}
                      />
                      <MealSource
                        value={meal.source}
                        onSave={(newValue) => {
                          handleUpdateMeal(meal.meal_id, newValue, "source");
                        }}
                      />
                      <td
                        className="px-2 py-4 whitespace-nowrap text-center text-base text-gray-600 dark:text-gray-300"
                        style={{ minWidth: "200px" }}
                      >
                        <MealLastEaten
                          value={meal.last_eaten}
                          onSave={(newDate) =>
                            handleUpdateMeal(
                              meal.meal_id,
                              newDate,
                              "last_eaten"
                            )
                          }
                        />
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap text-base text-center font-semibold">
                        {Array.from({ length: 5 }).map((_, index) => {
                          const ratingValue = index + 1;
                          if (meal.rating >= ratingValue) {
                            return (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className="text-yellow-500"
                              />
                            );
                          } else if (meal.rating >= ratingValue - 0.5) {
                            return (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStarHalfAlt}
                                className="text-yellow-500"
                              />
                            );
                          } else {
                            return (
                              <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className="text-gray-400"
                              />
                            );
                          }
                        })}
                      </td>

                      <td className="px-2 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleModal(meal.meal_id)}
                          className="text-red-500 hover:text-red-600 transition"
                          aria-label="Delete Meal"
                          title="Delete Meal"
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-3xl"
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {isModalOpen && (
            <DeleteMealModal
              toggleModal={toggleModal}
              handleDeleteMeal={handleDeleteMeal}
              mealId={selectedMealId}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Meals;
