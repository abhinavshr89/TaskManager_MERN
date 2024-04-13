import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Profile from "../components/Profile";
import Header from "../components/Header"; // Import Navbar component
import Login from "../components/Login";
import Register from "../components/Register";

import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [taskTitle, setTaskTitle] = useState("Tasks");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:1001/api/v1/user/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(data.user);
      } catch (error) {
        console.error("Failed to authenticate user:", error);
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser();
  }, [isAuthenticated]);
  
 
  return (
    <Router>
      <Header
        setTasks={setTasks}
        setIsAuthenticated={setIsAuthenticated}
        isAuthenticated={isAuthenticated}
        setTaskTitle={setTaskTitle}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              isAuthenticated={isAuthenticated}
              tasks={tasks}
              setTasks={setTasks}
              taskTitle={taskTitle}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        />
        <Route
          path="/profile"
          element={<Profile user={user} isAuthenticated={isAuthenticated} />}
        />
      </Routes>
    
    </Router>
  );
};

export default App;
