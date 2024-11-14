import axios from 'axios';

const weeklyMealsApi = axios.create({
  baseURL: 'https://weekly-meals-be.fly.dev/api',
});

export const loadApi = async () => {
  const res = await weeklyMealsApi.get('/');
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await weeklyMealsApi.post('/auth/login', {
    user: { username, password },
  });
  return res.data;
};

export const registerUser = async (user) => {
  console.log(user);
  const res = await weeklyMealsApi.post('/users', {
    user,
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
  const res = await weeklyMealsApi.post(
    '/meals',
    meal, // Send meal data in the body
    { headers: { Authorization: `Bearer ${token}` } } // Correct place for headers
  );
  return res.data.meal;
};

export const checkUsernameExists = async (username) => {
  const res = await weeklyMealsApi.get(`/usernames/${username}`);
  return res.data.msg;
};

export const checkEmailExists = async (email) => {
  const res = await weeklyMealsApi.get(`/emails/${email}`);
  return res.data.msg;
};