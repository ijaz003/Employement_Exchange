import React from "react";
import { FaUserPlus, FaSearch, FaHandshake } from "react-icons/fa";
import { useTheme } from '../../contexts/ThemeContext';

const HowItWorks = () => {
  const { isDark } = useTheme();

  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Create Account",
      description: "Sign up as a job seeker or employer to get started with your career journey."
    },
    {
      icon: <FaSearch />,
      title: "Find Opportunities",
      description: "Browse jobs that match your skills or post positions to find the perfect candidates."
    },
    {
      icon: <FaHandshake />,
      title: "Connect & Succeed",
      description: "Apply for jobs or hire talented professionals to grow your business."
    }
  ];

  return (
    <section
      className={`py-16 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-slate-50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-primary-400' : 'text-slate-900'}`}>How CareerConnect Works</h2>
          <p className={`mt-2 ${isDark ? 'text-primary-200' : 'text-slate-600'}`}>Get started in just three simple steps and unlock endless opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              className={`relative text-center rounded-2xl border p-8 shadow-lg transition-all duration-200 hover:shadow-2xl ${
                isDark
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-slate-100 bg-white'
              }`}
              key={index}
            >
              <div
                className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isDark ? 'bg-primary-600 text-white' : 'bg-sky-600 text-white'
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center text-3xl ${
                  isDark ? 'bg-primary-900 text-primary-400' : 'bg-sky-100 text-sky-600'
                }`}
              >
                {step.icon}
              </div>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-primary-300' : 'text-slate-900'}`}>{step.title}</h3>
              <p className={`mt-2 ${isDark ? 'text-primary-200' : 'text-slate-600'}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
