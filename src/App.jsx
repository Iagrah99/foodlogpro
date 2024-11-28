import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import Home from "./pages/Home";
import Meals from './pages/Meals.jsx';
import Login from "./pages/Login.jsx"
import Register from './pages/Register.jsx';
import FAQ from './pages/FAQ.jsx';
import UserProfile from './pages/UserProfile.jsx';

export default function App() {
  const { setLoggedInUser, loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setLoggedInUser(JSON.parse(savedUser));
    }
  }, [setLoggedInUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Redirect from /login to /meals if the user is already logged in */}
      <Route
        path="/login"
        element={loggedInUser ? <Navigate to="/my-meals" /> : <Login />}
      />

      <Route path='/register' element={<Register />} />

      <Route path='/my-meals' element={<Meals />} />

      <Route path='/faq' element={<FAQ />} />

      <Route path='/my-profile' element={<UserProfile />} />
    </Routes>
  );
}
