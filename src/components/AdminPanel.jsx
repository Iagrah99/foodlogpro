import React, { useEffect, useState } from 'react';
import { getUsers, getMeals } from '../../utils/api';

const AdminPanel = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalMeals, setTotalMeals] = useState(null);
  const [newestUser, setNewestUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        console.log(users);
        setTotalUsers(users.length);

        const meals = await getMeals();
        setTotalMeals(meals.length);

        if (users.length > 0) {
          // Find the user with the highest user_id
          const latestUser = users.reduce((max, user) => user.user_id > max.user_id ? user : max, users[0]);
          setNewestUser(latestUser.username); // Set newest user based on highest user_id
        } else {
          setNewestUser('N/A'); // If no users exist, set to 'N/A'
        }

      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 rounded-lg shadow-lg w-96 ml-8 mt-10 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-gray-700 text-2xl text-center font-bold mb-4 dark:text-white">Admin Panel</h2>
      <div className="bg-gray-100 rounded-lg p-4 space-y-3 dark:bg-gray-800 dark:text-white">
        <p className="flex items-center">
          <span className="font-medium">Total Users:</span>
          <span className="ml-2">{totalUsers ?? 'Loading...'}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium">Total Meals Logged:</span>
          <span className="ml-2">{totalMeals ?? 'Loading...'}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium whitespace-nowrap">Most Recent Account:</span>
          <span className="ml-2">{newestUser || 'N/A'}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;