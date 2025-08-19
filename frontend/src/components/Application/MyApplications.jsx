import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import { useSelector } from "react-redux";

const MyApplications = () => {
  const { user, isAuthorized } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }
    const fetchApplications = async () => {
      try {
        let url =
          user && user.role === "Employer"
            ? "http://localhost:4000/application/employer/getall"
            : "http://localhost:4000/application/jobseeker/getall";
        const res = await axios.get(url, { withCredentials: true });
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
      const res = await axios.delete(
        `http://localhost:4000/application/delete/${id}`,
        { withCredentials: true }
      );
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

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">{isEmployer ? "Applicants" : "My Applications"}</h2>
          <p className="mt-2 text-slate-600">{isEmployer ? "Review applicants and their resumes" : "Track your applications and statuses"}</p>
        </div>

        {applications.length <= 0 ? (
          <div className="text-center py-24">
            <h3 className="text-xl font-semibold text-slate-700">No applications found</h3>
            <p className="mt-2 text-slate-500">{isEmployer ? "No one has applied yet." : "You haven't applied to any jobs yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((element) => (
              <div className="rounded-xl border border-slate-100 bg-white shadow-sm" key={element._id}>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p><strong>Name:</strong> {element.name}</p>
                      <p><strong>Email:</strong> {element.email}</p>
                      <p><strong>Phone:</strong> {element.phone}</p>
                      <p><strong>Address:</strong> {element.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p><strong>Cover Letter:</strong></p>
                      <p className="text-slate-600">{element.coverLetter}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-3">
                      <img
                        src={element.resume.url}
                        alt="resume"
                        style={{ maxWidth: '200px', borderRadius: '8px', cursor: 'zoom-in' }}
                        onClick={() => openModal(element.resume.url)}
                      />
                      {!isEmployer && (
                        <button className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700" onClick={() => deleteApplication(element._id)}>
                          Delete Application
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;
