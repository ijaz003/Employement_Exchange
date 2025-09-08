import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaMoneyBillWave, FaUserTie } from "react-icons/fa";

const JobDetails = () => {
  const axios = useAxios();
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    axios
      .get(`/job/${id}`)
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        toast.error("Invalid job id");
        navigateTo("/notfound");
      });
    // eslint-disable-next-line
  }, [id]);

  return (
    <section className="min-h-screen w-full py-12 px-2 bg-gray-50 dark:bg-gradient-to-br dark:from-blue-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 border-b border-blue-200 dark:border-blue-800 pb-6">
          <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight mb-2">{job.title || 'Job Details'}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">Review the role and apply if it fits you</p>
        </header>

        <div className="mb-8 flex flex-wrap gap-4">
          <span className="flex items-center gap-2 text-base px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
            <FaBriefcase /> {job.category || 'Category'}
          </span>
          <span className="flex items-center gap-2 text-base px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
            <FaMapMarkerAlt /> {job.city || job.country || 'Location'}
          </span>
          {job.jobPostedOn && (
            <span className="flex items-center gap-2 text-base px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
              <FaCalendarAlt /> {new Date(job.jobPostedOn).toLocaleDateString()}
            </span>
          )}
          {job.fixedSalary && (
            <span className="flex items-center gap-2 text-base px-4 py-2 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-semibold">
              <FaMoneyBillWave /> {job.fixedSalary}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200">Category:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-400">{job.category}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200">Country:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-400">{job.country}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200">City:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-400">{job.city}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200">Location:</span>
              <span className="ml-2 text-gray-700 dark:text-gray-400">{job.location}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-200">Salary:</span>
              <span className="ml-2 text-green-700 dark:text-green-300">
                {job.fixedSalary ? job.fixedSalary : `${job.salaryFrom || ''} - ${job.salaryTo || ''}`}
              </span>
            </div>
            {job.jobPostedOn && (
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-200">Posted on:</span>
                <span className="ml-2 text-gray-700 dark:text-gray-400">{new Date(job.jobPostedOn).toLocaleDateString()}</span>
              </div>
            )}
            {job.employer && (
              <div>
                <span className="font-bold text-gray-900 dark:text-gray-200">Employer:</span>
                <span className="ml-2 inline-flex items-center gap-1 text-blue-700 dark:text-blue-300"><FaUserTie /> {job.employer}</span>
              </div>
            )}
          </div>
        </div>

        {job.description && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-3">Description</h2>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-line break-words">{job.description}</p>
          </div>
        )}

        <footer className="pt-8 border-t border-blue-200 dark:border-blue-800 flex items-center justify-between">
          {user && user.role === "Employer" ? (
            <div className="text-red-600 dark:text-red-400 font-semibold text-lg">Employers cannot apply to jobs</div>
          ) : (
            <Link
              to={`/application/${job._id}`}
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors font-bold text-lg shadow-lg"
            >
              Apply Now
            </Link>
          )}
        </footer>
      </div>
    </section>
  );
};

export default JobDetails;
