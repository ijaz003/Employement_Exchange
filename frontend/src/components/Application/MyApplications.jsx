import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { useSelector } from "react-redux";
import socket from "../../utils/socket";

const MyApplications = () => {
  const { user, isAuthorized } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigate = useNavigate();
  const axios = useAxios();


  useEffect(() => {
    
      socket.on("jobApplied", (data) => {
        console.log("New job application received:", data);
        setApplications((prevApps) => [...prevApps, data]);
        // You can update state/UI here
      });
    
  
      return () => {
        socket.off("jobApplied");
      };
    }, []);


  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }
    const fetchApplications = async () => {
      try {
        let url =
          user && user.role === "Employer"
            ? "/application/employer/getall"
            : "/application/jobseeker/getall";
        const res = await axios.get(url);
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch applications"
        );
      }
    };
    fetchApplications();
    // eslint-disable-next-line
  }, [isAuthorized, user, navigate]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(`/application/delete/${id}`);
      toast.success(res.data.message);
      setApplications((prevApplication) =>
        prevApplication.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const isEmployer = user && user.role === "Employer";

  // ...existing code...
  const [expandedAppId, setExpandedAppId] = useState(null);

  const handleExpand = (appId) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex flex-col px-4 py-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center py-12 animate-fade-in-up">
          <h2 className="text-5xl font-extrabold text-blue-800 dark:text-blue-300 mb-4 tracking-tight">
            {isEmployer ? "Applicants" : "My Applications"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isEmployer ? "Manage and review applicant resumes" : "Track your job applications with ease"}
          </p>
        </div>
        {applications.length <= 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <h3 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
              No applications found
            </h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              {isEmployer ? "No one has applied yet." : "You haven't applied to any jobs yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            {applications.map((element) => (
              <div
                key={element._id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 ${expandedAppId === element._id ? 'scale-[1.02] shadow-xl' : 'hover:scale-[1.01] hover:shadow-blue-200'}`}
              >
                <button
                  className="w-full text-left p-6 focus:outline-none flex items-center justify-between transition-colors"
                  onClick={() => handleExpand(element._id)}
                  aria-expanded={expandedAppId === element._id}
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">{element.name}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full mr-2">
                        {element.email}
                      </span>
                      <span className="mr-2">•</span>
                      <span>{element.phone}</span>
                      <span className="mr-2">•</span>
                      <span>{element.address}</span>
                    </div>
                  </div>
                  {expandedAppId === element._id ? (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-blue-500">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                {expandedAppId === element._id && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">Cover Letter</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{element.coverLetter}</p>
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={element.resume.url}
                          alt="resume"
                          className="w-32 h-32 object-cover rounded-lg cursor-zoom-in border border-gray-200 dark:border-gray-600 shadow-sm"
                          onClick={() => openModal(element.resume.url)}
                        />
                        {!isEmployer && (
                          <button
                            className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-rose-600 text-white font-semibold shadow-md hover:bg-rose-700 hover:scale-[1.05] transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 animate-bounce-in"
                            onClick={() => deleteApplication(element._id)}
                          >
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="mr-2 animate-bounce-x"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.7s cubic-bezier(.39,.575,.565,1) both;
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.8); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-x {
          animation: bounceX 1.2s infinite alternate;
        }
        @keyframes bounceX {
          0% { transform: translateX(0); }
          100% { transform: translateX(8px); }
        }
      `}</style>
    </section>
  );
};

export default MyApplications;