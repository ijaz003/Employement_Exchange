import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isAuthorized, user, navigate]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/job/postjob",
        fixedSalary.length >= 2
          ? {
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      navigate("/jobs");
      setTitle("");
      setDescription("");
      setCategory("");
      setCountry("");
      setCity("");
      setLocation("");
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
      setSalaryType("default");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <section className="min-h-screen w-full py-12 px-2 bg-gray-50 dark:bg-gradient-to-br dark:from-blue-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-blue-200 dark:border-blue-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight mb-2 text-center">Post a New Job</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center">Fill out the details below to create a job listing</p>
        </header>

        <form onSubmit={handleJobPost} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter job title"
                className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">Select Category</option>
                <option value="Graphics & Design">Graphics & Design</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Frontend Web Development">Frontend Web Development</option>
                <option value="MERN Stack Development">MERN STACK Development</option>
                <option value="Account & Finance">Account & Finance</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Video Animation">Video Animation</option>
                <option value="MEAN Stack Development">MEAN STACK Development</option>
                <option value="MEVN Stack Development">MEVN STACK Development</option>
                <option value="Data Entry Operator">Data Entry Operator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter country"
                className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Salary Type</label>
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
          </div>

          {salaryType === "Fixed Salary" ? (
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Fixed Salary</label>
              <input
                type="number"
                placeholder="Enter fixed salary"
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          ) : salaryType === "Ranged Salary" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Salary From</label>
                <input
                  type="number"
                  placeholder="Salary from"
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Salary To</label>
                <input
                  type="number"
                  placeholder="Salary to"
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>
          ) : (
            <p className="text-blue-600 dark:text-blue-300 font-semibold">Please provide Salary Type *</p>
          )}

          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200">Job Description</label>
            <textarea
              rows="8"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the responsibilities, requirements, and benefits"
              className="w-full rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
          >
            Create Job
          </button>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
