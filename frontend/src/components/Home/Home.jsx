import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setIsAuthorized } from "../../store/UserReducers";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.user);

useEffect(() => {
    socket.on("jobApplied", (data) => {
      // You can update state/UI here
    });

    return () => {
      socket.off("jobApplied");
    };
  }, []);








  useEffect(() => {
    // Handle Google OAuth user from query param
    const params = new URLSearchParams(window.location.search);
    const googleUser = params.get("googleUser");
    if (googleUser) {
      try {
        const userObj = JSON.parse(decodeURIComponent(googleUser));
        dispatch(setUser(userObj));
        dispatch(setIsAuthorized(true));
        navigate("/");
      } catch (err) {
        // Optionally handle error
      }
    }
  }, []);
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <PopularCategories />
    </main>
  );
};

export default Home;
