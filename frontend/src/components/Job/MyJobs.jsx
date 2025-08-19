import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
      return;
    }
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.jobs || data.myJobs || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      }
    };
    fetchJobs();
    // eslint-disable-next-line
  }, [isAuthorized, user, navigateTo]);

  const handleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
    setEditingMode(null);
  };

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      await axios.put(
        `http://localhost:4000/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success("Job updated successfully");
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(
        `http://localhost:4000/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success("Job deleted successfully");
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      if (expandedJobId === jobId) setExpandedJobId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <section className="min-h-screen w-full py-12 px-4 bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-400 mb-4">
            Your Posted Jobs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Manage, edit, and track your job postings in one place
          </p>
        </header>

        {myJobs.length > 0 ? (
          <div className="space-y-6">
            {myJobs.map((element) => (
              <div 
                key={element._id} 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
              >
                <button
                  className={`w-full text-left p-6 focus:outline-none flex items-center justify-between transition-colors ${expandedJobId === element._id ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  onClick={() => handleExpand(element._id)}
                  aria-expanded={expandedJobId === element._id}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{element.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full mr-2">
                        {element.category}
                      </span>
                      <span className="mr-2">•</span>
                      <span>{element.city}, {element.country}</span>
                      <span className="mr-2">•</span>
                      <span className={element.expired ? "text-red-500" : "text-green-500"}>
                        {element.expired ? "Expired" : "Active"}
                      </span>
                    </div>
                  </div>
                  {expandedJobId === element._id ? (
                    <FaChevronUp className="text-blue-500" />
                  ) : (
                    <FaChevronDown className="text-blue-500" />
                  )}
                </button>
                
                {expandedJobId === element._id && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Title
                          </label>
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.title}
                            onChange={(e) => handleInputChange(element._id, "title", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            value={element.category}
                            onChange={(e) => handleInputChange(element._id, "category", e.target.value)}
                            disabled={editingMode !== element._id}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                          >
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.country}
                            onChange={(e) => handleInputChange(element._id, "country", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.city}
                            onChange={(e) => handleInputChange(element._id, "city", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Salary
                        </label>
                        {element.fixedSalary ? (
                          <input
                            type="number"
                            disabled={editingMode !== element._id}
                            value={element.fixedSalary}
                            onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                            placeholder="Fixed salary amount"
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryFrom}
                                onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                                placeholder="From"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryTo}
                                onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                                placeholder="To"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Job Status
                          </label>
                          <select
                            value={element.expired}
                            onChange={(e) => handleInputChange(element._id, "expired", e.target.value === "true")}
                            disabled={editingMode !== element._id}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                          >
                            <option value={false}>Active</option>
                            <option value={true}>Expired</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Job Description
                        </label>
                        <textarea
                          rows={4}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) => handleInputChange(element._id, "description", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Location Details
                        </label>
                        <textarea
                          rows={3}
                          value={element.location}
                          disabled={editingMode !== element._id}
                          onChange={(e) => handleInputChange(element._id, "location", e.target.value)}
                          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 dark:disabled:bg-gray-600/50"
                        />
                      </div>
                    </form>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      {editingMode === element._id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdateJob(element._id)}
                            className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
                          >
                            <FaCheck className="mr-2" />
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={handleDisableEdit}
                            className="flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors shadow-sm"
                          >
                            <RxCross2 className="mr-2" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnableEdit(element._id)}
                          className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors shadow-sm"
                        >
                          <FaEdit className="mr-2" />
                          Edit Job
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteJob(element._id)}
                        className="flex items-center justify-center px-5 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors shadow-sm"
                      >
                        <FaTrash className="mr-2" />
                        Delete Job
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
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
                No jobs posted yet
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                You haven't posted any jobs yet. Create your first job posting to get started.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigateTo("/job/post")}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post a New Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJobs;