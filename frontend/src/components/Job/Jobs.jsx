import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaBriefcase, FaBuilding, FaClock } from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Available Jobs</h2>
            <p className="mt-2 text-slate-600">Discover opportunities that match your skills</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-52 rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Available Jobs</h2>
          <p className="mt-2 text-slate-600">
            {jobs.jobs ? `${jobs.jobs.length} opportunities` : 'No jobs available'} that match your skills and interests
          </p>
        </div>

        {jobs.jobs && jobs.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.jobs.map((job) => (
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition" key={job._id}>
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                  <div className="mt-1 text-sky-600 font-medium flex items-center gap-2">
                    <FaBuilding /> {job.company || 'Company Name'}
                  </div>
                  <div className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                    <FaMapMarkerAlt /> {job.country || 'Location'}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded bg-sky-100 text-sky-700 font-medium">
                      <FaBriefcase /> {job.category || 'Category'}
                    </span>
                    {job.salary && (
                      <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 font-medium">
                        <FaClock /> {job.salary}
                      </span>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-slate-600 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-center">
                    <Link to={`/job/${job._id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold text-slate-700">No jobs available</h3>
            <p className="mt-2 text-slate-500">Check back later for new opportunities or try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Jobs;
