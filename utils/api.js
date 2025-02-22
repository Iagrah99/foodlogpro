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

export const getUser = async (token, user_id) => {
  const res = await weeklyMealsApi.get(`/users/${user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(res.data);
  return res.data.user;
};

export const getUsers = async () => {
  const res = await weeklyMealsApi.get('/users');
  return res.data.users;
};

export const getMeals = async () => {
  const res = await weeklyMealsApi.get('/meals');
  return res.data.meals;
};

export const registerUser = async (user) => {
  const res = await weeklyMealsApi.post('/users', {
    user,
  });
  return res.data;
};

export const getUserMeals = async (user_id, sort_by, order_by, token) => {
  const res = await weeklyMealsApi.get(`/users/${user_id}/meals`, {
    params: { sort_by, order_by },
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

export const checkEmailExists = async (email, check) => {
  const res = await weeklyMealsApi.post(`/emails/${email}`, {
    check,
  });
  return res.data.msg;
};

export const removeMeal = async (meal_id, token) => {
  const res = await weeklyMealsApi.delete(`/meals/${meal_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMeal = async (meal_id, updateValue, updateType, token) => {
  const meal = { [updateType]: updateValue };

  const res = await weeklyMealsApi.patch(
    `/meals/${meal_id}`,
    { meal },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.meal;
};

export const updateUser = async (user_id, user, token) => {
  const res = await weeklyMealsApi.patch(
    `/users/${user_id}`,
    { user },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data.user;
};
