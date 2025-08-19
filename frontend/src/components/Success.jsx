import React from "react";
import { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Redirect to home if not authorized
    // const isAuthorized = localStorage.getItem("isAuthorized");
    // if (!isAuthorized) {
    //   navigate("/login");
    // }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <FiCheckCircle className="text-green-500 dark:text-green-400 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
          Thank you for your purchase. Your premium plan is now active.<br />
          Enjoy all the premium features!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
