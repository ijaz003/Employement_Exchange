import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt } from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/job/${id}`, {
        withCredentials: true,
      })
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
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Job Details</h2>
          <p className="mt-2 text-slate-600">Review the role and apply if it fits you</p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded bg-sky-100 text-sky-700 font-medium">
                <FaBriefcase /> {job.category || 'Category'}
              </span>
              <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded bg-sky-100 text-sky-700 font-medium">
                <FaMapMarkerAlt /> {job.city || job.country || 'Location'}
              </span>
              {job.jobPostedOn && (
                <span className="inline-flex items-center gap-2 text-sm px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                  <FaCalendarAlt /> {job.jobPostedOn}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p><strong>Category:</strong> {job.category}</p>
                <p><strong>Country:</strong> {job.country}</p>
                <p><strong>City:</strong> {job.city}</p>
                <p><strong>Location:</strong> {job.location}</p>
              </div>
              <div className="space-y-1">
                <p>
                  <strong>Salary:</strong> {job.fixedSalary ? (
                    <span> {job.fixedSalary}</span>
                  ) : (
                    <span> {job.salaryFrom} - {job.salaryTo}</span>
                  )}
                </p>
                {job.jobPostedOn && (
                  <p><strong>Posted on:</strong> {job.jobPostedOn}</p>
                )}
              </div>
            </div>

            {job.description && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-slate-700 leading-relaxed">{job.description}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50">
            {user && user.role === "Employer" ? (
              <div className="text-slate-500">Employers cannot apply to jobs</div>
            ) : (
              <Link to={`/application/${job._id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Apply Now</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
