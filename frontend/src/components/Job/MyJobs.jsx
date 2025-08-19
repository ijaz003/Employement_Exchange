import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Your Posted Jobs</h2>
          <p className="mt-2 text-slate-600">Manage and edit your job postings</p>
        </div>

        {myJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {myJobs.map((element) => (
              <div className="rounded-xl border border-slate-100 bg-white shadow-sm" key={element._id}>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Title</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "title",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-medium">Country</label>
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.country}
                            onChange={(e) =>
                              handleInputChange(
                                element._id,
                                "country",
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-medium">City</label>
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.city}
                            onChange={(e) =>
                              handleInputChange(
                                element._id,
                                "city",
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Category</label>
                        <select
                          value={element.category}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "category",
                              e.target.value
                            )
                          }
                          disabled={editingMode !== element._id}
                          className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
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

                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Salary</label>
                        {element.fixedSalary ? (
                          <input
                            type="number"
                            disabled={editingMode !== element._id}
                            value={element.fixedSalary}
                            onChange={(e) =>
                              handleInputChange(
                                element._id,
                                "fixedSalary",
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="number"
                              disabled={editingMode !== element._id}
                              value={element.salaryFrom}
                              onChange={(e) =>
                                handleInputChange(
                                  element._id,
                                  "salaryFrom",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                            />
                            <input
                              type="number"
                              disabled={editingMode !== element._id}
                              value={element.salaryTo}
                              onChange={(e) =>
                                handleInputChange(
                                  element._id,
                                  "salaryTo",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Expired</label>
                        <select
                          value={element.expired}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "expired",
                              e.target.value === "true"
                            )
                          }
                          disabled={editingMode !== element._id}
                          className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                        >
                          <option value={true}>TRUE</option>
                          <option value={false}>FALSE</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Description</label>
                        <textarea
                          rows={5}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "description",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-medium">Location</label>
                        <textarea
                          value={element.location}
                          rows={5}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "location",
                              e.target.value
                            )
                          }
                          className="w-full rounded-md border-2 border-slate-200 px-3 py-2 focus:outline-none focus:border-sky-500 disabled:bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {editingMode === element._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(element._id)}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleDisableEdit}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnableEdit(element._id)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(element._id)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold text-slate-700">No jobs posted</h3>
            <p className="mt-2 text-slate-500">You've not posted any job or maybe you deleted all of your jobs</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJobs;
