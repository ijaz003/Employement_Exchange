import React from "react";
import { FaUserPlus, FaSearch, FaHandshake } from "react-icons/fa";

const HowItWorks = () => {
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
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">How CareerConnect Works</h2>
          <p className="mt-2 text-slate-600">Get started in just three simple steps and unlock endless opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div className="relative text-center rounded-xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-lg transition" key={index}>
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">{index + 1}</div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-sky-100 text-sky-600 text-3xl flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
