import { useState, useEffect, useContext } from "react";
import { getUserMeals } from "../../utils/api";
import NavigationBar from "../components/NavigationBar";
import Loading from "../components/Loading";
import { UserContext } from "../contexts/UserContext";
import { format } from 'date-fns'

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.user_id) return;

    const fetchMeals = async () => {
      const loadingTimeout = setTimeout(() => setIsLoading(true), 1000);
      try {
        const userId = loggedInUser.user_id;
        const mealsFromApi = await getUserMeals(userId);
        clearTimeout(loadingTimeout);
        setIsLoading(false);
        setMeals(mealsFromApi);
      } catch (err) {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
        console.error("Error fetching meals:", err);
      }
    };

    fetchMeals();
  }, [loggedInUser]);

  return (
    <>
      <NavigationBar page="login" />
      <div className="p-6 bg-gray-100 min-h-screen py-32">
        {isLoading ? (
          <Loading content="meals" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Source</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Ingredients</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Last Eaten</th>
                  <th className="px-5 py-3 text-center text-base font-medium text-gray-600 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal) => (
                  <tr key={meal.id} className="border-b border-gray-200 hover:bg-gray-100 transition">
                    {console.log(meal.ingredients)}
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-2 py-4 whitespace-nowrap text-center text-base font-medium text-gray-900">{meal.name}</td>
                    <td className="px-2 py-4 whitespace-nowrap text-center text-base text-gray-700">{meal.source}</td>
                    <td className="px-2 py-4 text-base text-gray-700">
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
                    </td>

                    <td className="px-2 py-4 whitespace-nowrap text-center text-base text-gray-600">
                      {meal.last_eaten
                        ? format(new Date(meal.last_eaten), 'EEEE, dd/MM/yyyy')
                        : 'N/A'}
                    </td>

                    <td className="px-2 py-4 whitespace-nowrap text-base text-center font-semibold text-orange-500">{meal.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Meals;
