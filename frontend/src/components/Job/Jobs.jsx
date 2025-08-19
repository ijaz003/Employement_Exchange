import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaBuilding, 
  FaClock, 
  FaSearch, 
  FaFilter,
  FaDollarSign,
  FaGlobe
} from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expired, setExpired] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:4000/job/getall", {
          withCredentials: true,
        });
        setJobs(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filtering logic
  const filteredJobs = jobs.jobs
    ? jobs.jobs.filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          job.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? job.category === category : true;
        const matchesCountry = country ? job.country === country : true;
        const matchesSalaryMin = salaryMin ? Number(job.salaryFrom || job.fixedSalary || 0) >= Number(salaryMin) : true;
        const matchesSalaryMax = salaryMax ? Number(job.salaryTo || job.fixedSalary || 0) <= Number(salaryMax) : true;
        const matchesExpired = expired !== "" ? String(job.expired) === expired : true;
        return matchesSearch && matchesCategory && matchesCountry && matchesSalaryMin && matchesSalaryMax && matchesExpired;
      })
    : [];

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300">Discover Opportunities</h2>
            <p className="mt-3 text-lg text-blue-600 dark:text-blue-200">Finding the best matches for you...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="h-80 rounded-2xl bg-white dark:bg-gray-800 shadow-md animate-pulse overflow-hidden"
              >
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mt-6"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mt-4"></div>
                <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded mt-6 mx-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded mt-6 mx-4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-300">Discover Opportunities</h2>
          <p className="mt-3 text-lg text-blue-600 dark:text-blue-200">
            {filteredJobs.length > 0 
              ? `${filteredJobs.length} matching positions found` 
              : 'No jobs match your criteria'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-blue-500 dark:text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search by job title, description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md">
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBriefcase className="text-blue-500 dark:text-blue-400" />
              </div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaGlobe className="text-blue-500 dark:text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-blue-500 dark:text-blue-400" />
              </div>
              <input
                type="number"
                placeholder="Min Salary"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoMdTime className="text-blue-500 dark:text-blue-400" />
              </div>
              <select
                value={expired}
                onChange={e => setExpired(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="false">Active Only</option>
                <option value="true">Expired Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                className="flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                key={job._id}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {job.title}
                      </h3>
                      <div className="mt-1 flex items-center text-blue-600 dark:text-blue-400">
                        <FaBuilding className="mr-2" />
                        <span>{job.company || 'Company'}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      job.expired 
                        ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200" 
                        : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    }`}>
                      {job.expired ? "Expired" : "Active"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center text-gray-600 dark:text-gray-300">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" />
                    <span>{job.city}, {job.country}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {job.category}
                      </span>
                      {job.fixedSalary ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          ${job.fixedSalary}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                          ${job.salaryFrom} - ${job.salaryTo}
                        </span>
                      )}
                    </div>
                  </div>

                  {job.description && (
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                        {job.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                  <Link
                    to={`/job/${job._id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No jobs found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setCountry("");
                    setSalaryMin("");
                    setSalaryMax("");
                    setExpired("");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;