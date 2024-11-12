import axios from 'axios';

const weeklyMealsApi = axios.create({
  baseURL: 'https://weekly-meals-be.fly.dev/api',
});

export const loginUser = async (username, password) => {
  const res = await weeklyMealsApi.post('/auth/login', {
    user: { username, password },
  });
  return res.data;
};

export const getUserMeals = async (user_id, token) => {
  const res = await weeklyMealsApi.get(`/users/${user_id}/meals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.meals;
};

export const addMeal = async (meal, token) => {
  console.log(meal);
  console.log(token);
  const res = await weeklyMealsApi.post(
    '/meals',
    meal, // Send meal data in the body
    { headers: { Authorization: `Bearer ${token}` } } // Correct place for headers
  );
  return res.data.meal;
};
