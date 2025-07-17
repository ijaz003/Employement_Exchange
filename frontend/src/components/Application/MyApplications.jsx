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

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
            <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <center>
              <h4>No Applications Found</h4>
            </center>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <center>
            <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <center>
              <h4>No Applications Found</h4>
            </center>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
      <div className="btn_area">
        <button onClick={() => deleteApplication(element._id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
    </div>
  );
};
