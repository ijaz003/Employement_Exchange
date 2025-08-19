import React from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import { useSelector } from "react-redux";

const Home = () => {
  const {user} = useSelector((state) => state.user);
  console.log(user,"After payment")
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <PopularCategories />
      <PopularCompanies />
    </main>
  );
};

export default Home;
