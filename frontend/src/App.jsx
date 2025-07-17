import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setIsAuthorized } from "./store/UserReducers.js";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthorized } = useSelector((state) => state.user);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:4000/auth/getuser",
  //         {
  //           withCredentials: true,
  //         }
  //       );
  //       dispatch(setUser(response.data.user));
  //       dispatch(setIsAuthorized(true));

  //     } catch (error) {
  //       dispatch(setIsAuthorized(false));
  //     }
  //   };
  //   fetchUser();
  //   // eslint-disable-next-line
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthorized?<Home /> :<Navigate to="/login" />} />
          <Route path="/job/getall" element={isAuthorized ? <Jobs /> : <Navigate to="/login" />} />
          <Route path="/job/:id" element={isAuthorized ? <JobDetails /> : <Navigate to="/login" />} />
          <Route path="/application/:id" element={isAuthorized ? <Application /> : <Navigate to="/login" />} />
          <Route path="/applications/me" element={isAuthorized ? <MyApplications /> : <Navigate to="/login" />} />
          <Route path="/job/post" element={isAuthorized ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/job/me" element={isAuthorized ? <MyJobs /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
