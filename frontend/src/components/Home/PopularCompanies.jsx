import React from "react";
import { FaMicrosoft, FaApple, FaGoogle, FaAmazon, FaFacebookF } from "react-icons/fa";
import { SiTesla } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Redmond, Washington",
      openPositions: 10,
      icon: <FaMicrosoft />,
      color: "#00a4ef"
    },
    {
      id: 2,
      title: "Tesla",
      location: "Austin, Texas",
      openPositions: 5,
      icon: <SiTesla />,
      color: "#e31937"
    },
    {
      id: 3,
      title: "Apple",
      location: "Cupertino, California",
      openPositions: 20,
      icon: <FaApple />,
      color: "#000000"
    },
    {
      id: 4,
      title: "Google",
      location: "Mountain View, California",
      openPositions: 15,
      icon: <FaGoogle />,
      color: "#4285f4"
    },
    {
      id: 5,
      title: "Amazon",
      location: "Seattle, Washington",
      openPositions: 25,
      icon: <FaAmazon />,
      color: "#ff9900"
    },
    {
      id: 6,
      title: "Meta",
      location: "Menlo Park, California",
      openPositions: 12,
      icon: <FaFacebookF />,
      color: "#0668e1"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Top Companies</h2>
          <p className="mt-2 text-slate-600">Work with industry leaders and innovative companies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg transition" key={company.id}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-3xl" style={{ color: company.color }}>
                  {company.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900">{company.title}</h3>
                  <p className="text-sm text-slate-600">{company.location}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <span className="text-sm font-medium text-slate-600">{company.openPositions} open positions</span>
                <button className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm">
                  View Jobs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
