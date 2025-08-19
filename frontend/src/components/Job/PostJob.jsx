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
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Post a New Job</h2>
          <form onSubmit={handleJobPost} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter job title"
                  className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country"
                  className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Salary Type</label>
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                required
              >
                <option value="default">Select Salary Type</option>
                <option value="Fixed Salary">Fixed Salary</option>
                <option value="Ranged Salary">Ranged Salary</option>
              </select>
            </div>

            {salaryType === "Fixed Salary" ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Fixed Salary</label>
                <input
                  type="number"
                  placeholder="Enter fixed salary"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            ) : salaryType === "Ranged Salary" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Salary From</label>
                  <input
                    type="number"
                    placeholder="Salary from"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Salary To</label>
                  <input
                    type="number"
                    placeholder="Salary to"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>
            ) : (
              <p className="text-slate-500">Please provide Salary Type *</p>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Job Description</label>
              <textarea
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the responsibilities, requirements, and benefits"
                className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500"
                required
              />
            </div>

            <button type="submit" className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Create Job</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PostJob;
