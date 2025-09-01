import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const { jobId } = useParams();
  console.log(jobId, "Job ID from URL params");

  const handleApplication = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !address || !coverLetter || !resume) {
      toast.error("Please fill in all fields and attach your resume");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", jobId);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
      navigate("/my-applications");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigate("/");
    return null;
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-gray-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 flex flex-col justify-center items-center px-0 py-0">
      <div className="w-full">
        <div className="w-full text-center py-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2 tracking-tight animate-fade-in">Job Application</h2>
          <p className="text-gray-600 dark:text-gray-300 animate-fade-in delay-100">Showcase your skills and experience. Stand out from the crowd!</p>
        </div>
        <form onSubmit={handleApplication} className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-8 py-8">
          <div className="flex flex-col gap-8">
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 focus:scale-[1.03] focus:shadow-lg"
                placeholder=" "
                required
                autoComplete="name"
              />
              <label htmlFor="name" className="absolute left-4 top-2 text-base text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-1 transition-all duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base pointer-events-none">Full Name</label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 focus:scale-[1.03] focus:shadow-lg"
                placeholder=" "
                required
                autoComplete="email"
              />
              <label htmlFor="email" className="absolute left-4 top-2 text-base text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-1 transition-all duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base pointer-events-none">Email Address</label>
            </div>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 focus:scale-[1.03] focus:shadow-lg"
                placeholder=" "
                required
                autoComplete="tel"
              />
              <label htmlFor="phone" className="absolute left-4 top-2 text-base text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-1 transition-all duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base pointer-events-none">Phone Number</label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 focus:scale-[1.03] focus:shadow-lg"
                placeholder=" "
                required
                autoComplete="address"
              />
              <label htmlFor="address" className="absolute left-4 top-2 text-base text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-1 transition-all duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base pointer-events-none">Address</label>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="relative">
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="peer w-full px-4 pt-7 pb-3 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[140px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200 focus:scale-[1.03] focus:shadow-lg"
                placeholder=" "
                required
              />
              <label htmlFor="coverLetter" className="absolute left-4 top-2 text-base text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-700 px-1 transition-all duration-200 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-2 peer-focus:text-base pointer-events-none">Cover Letter</label>
            </div>
            <div className="space-y-2">
              <label className="block text-base font-semibold text-blue-700 dark:text-blue-300 mb-1">Upload Resume</label>
              <input
                type="file"
                accept=".pdf, .jpg, .png"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                required
              />
              {resume && (
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mt-2 animate-fade-in">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl shadow-lg hover:scale-[1.07] hover:shadow-blue-400 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 animate-bounce-in"
              aria-label="Send Application"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white animate-bounce-x">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
              </svg>
              Send Application
            </button>
          </div>
        </form>
      </div>
      {/* Animations CSS */}
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

export default Application;
