import React from "react";
import { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Monthly Plan",
    duration: "1 Month",
    price: "$19",
    description: "Access all premium job features for one month. Perfect for short-term job seekers or employers.",
    features: [
      "Unlimited job applications",
      "Priority support",
      "Featured profile",
    ],
  },
  {
    title: "Yearly Plan",
    duration: "12 Months",
    price: "$149",
    description: "Enjoy premium features for a full year. Best value for frequent users and businesses.",
    features: [
      "Unlimited job applications",
      "Priority support",
      "Featured profile",
      "Exclusive yearly discounts",
    ],
  },
];

let monthlyPlanId = "price_1RxNBILPbohNYBTRw11asdyE";

let yearlyPlanId =  "price_1RxOWfLPbohNYBTR7efF8ARL"; // Replace with your actual yearly Stripe price ID

const handleMonthlyPlan = async() => {
 try {
      const response = await fetch('http://localhost:4000/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId: monthlyPlanId }),
        credentials: 'include'
      })
      const data = await response.json()
      console.log(data.url)
      if (data.url) {
        window.location.href = data.url // Redirect to Stripe checkout
      } else {
        alert('Error: No checkout URL returned')
      }
    } catch (error) {
      alert('Error creating checkout session')
    }
};

const handleYearlyPlan = async () => {
  try {
    const response = await fetch('http://localhost:4000/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ priceId: yearlyPlanId }),
      credentials: 'include'
    })
    const data = await response.json()
    console.log(data)
    if (data.url) {
      window.location.href = data.url // Redirect to Stripe checkout
    } else {
      alert('Error: No checkout URL returned')
    }
  } catch (error) {
    alert('Error creating checkout session')
  }
};

const BuyPlan = () => {



   const { isAuthorized, user } = useSelector((state) => state.user);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!isAuthorized) {
        navigate("/login");
      }
      // eslint-disable-next-line
    }, [isAuthorized, user, navigate]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select the plan that best fits your needs and unlock premium features.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-primary-600 dark:text-primary-300 mb-2">{plan.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">/ {plan.duration}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
                      <FiCheckCircle className="text-primary-600 dark:text-primary-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={plan.title === "Monthly Plan" ? handleMonthlyPlan : handleYearlyPlan} className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow">
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyPlan;