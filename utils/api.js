import axios from 'axios';

const weeklyMealsApi = axios.create({
  baseURL: 'https://weekly-meals-be.fly.dev/api',
});

export const loginUser = async (username, password) => {
  const res = await weeklyMealsApi.post('/users/login', {
    user: { username, password },
  });
  return res.data.user;
};

export const getUserMeals = async (user_id) => {
  const res = await weeklyMealsApi.get(`/users/${user_id}/meals`);
  return res.data.meals;
};
