import { Link } from "react-router-dom";
import React from "react";
import { FiSearch, FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";
import { useSelector } from "react-redux";
import useAxios from "../../hooks/useAxios";
import { useTheme } from "../../contexts/ThemeContext";

function useCounter(target, duration = 1200) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const end = typeof target === "number" ? target : 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const increment = end / (duration / 16);
    let current = start;
    const step = () => {
      current += increment;
      if (current < end) {
        setCount(Math.floor(current));
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    step();
  }, [target, duration]);
  return count;
}

const HeroSection = () => {
  const axios = useAxios();
  // Search bar state and handler
  const [search, setSearch] = React.useState("");
  const { isAuthorized, user } = useSelector((state) => state.user);
  const [stats, setStats] = React.useState({
    totalJobs: 0,
    totalEmployers: 0,
    totalJobSeekers: 0,
  });
  const { isDark } = useTheme();

  React.useEffect(() => {
    axios
      .get("/stats/get")
      .then((res) => {
        if (res.data.success) {
          setStats({
            totalJobs: res.data.totalJobs,
            totalEmployers: res.data.totalEmployers,
            totalJobSeekers: res.data.totalJobSeekers,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(search)}`;
    }
  };

  const jobsCount = useCounter(stats.totalJobs);
  const seekersCount = useCounter(stats.totalJobSeekers);
  const employersCount = useCounter(stats.totalEmployers);

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div
          className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.2%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] ${
            isDark ? "bg-gray-900" : ""
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight animate-fade-in">
            <span
              className={`block ${
                isDark ? "text-primary-300" : "text-blue-200"
              } animate-gradient`}
            >
              Find Your Dream Job or
            </span>
            <span
              className={`block ${
                isDark ? "text-primary-200" : "text-blue-100"
              } animate-gradient`}
            >
              Hire the Perfect Candidate
            </span>
          </h1>
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-100">
            <span className={isDark ? "text-primary-400" : "text-blue-100"}>
              Connect with top employers and talented professionals. Whether
              you&apos;re looking for your next career move or building your
              dream team, we&apos;ve got you covered.
            </span>
          </p>

          {/* Search Bar */}
          {isAuthorized && (
            <div>
              <div className="max-w-2xl mx-auto mb-14 animate-fade-in delay-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search for jobs, companies, or skills..."
                    className={`w-full pl-12 pr-4 py-4 text-lg rounded-lg shadow-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDark
                        ? "bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-primary-500"
                        : "bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
                    }`}
                  />
                  <button
                    className={`absolute inset-y-0 right-0 px-6 font-semibold rounded-r-lg transition-colors ${
                      isDark
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in delay-300">
                <Link
                  to="/jobs"
                  className={`px-10 py-5 font-bold rounded-xl transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 text-lg ${
                    isDark
                      ? "bg-gray-900 text-primary-400 hover:bg-gray-800"
                      : "bg-white text-blue-700 hover:bg-gray-50"
                  }`}
                >
                  Browse Jobs
                </Link>
                {user?.role == "Employer" ? (
                  <Link
                    to="/post-job"
                    className={`px-10 py-5 bg-transparent border-2 font-bold rounded-xl transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 text-lg ${
                      isDark
                        ? "border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-gray-900"
                        : "border-white text-white hover:bg-white hover:text-blue-700"
                    }`}
                  >
                    Post a Job
                  </Link>
                ) : (
                  <Link
                    to="/my-applications"
                    className={`px-10 py-5 bg-transparent border-2 font-bold rounded-xl transition-colors shadow-xl hover:shadow-2xl transform hover:-translate-y-1 duration-200 text-lg ${
                      isDark
                        ? "border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-gray-900"
                        : "border-white text-white hover:bg-white hover:text-blue-700"
                    }`}
                  >
                    My Applications
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto animate-fade-in delay-400">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow">
                <FiBriefcase
                  className={`h-10 w-10 ${
                    isDark ? "text-primary-400" : "text-white"
                  }`}
                />
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-2">
                {jobsCount}
              </h3>
              <p className={isDark ? "text-primary-300" : "text-blue-100"}>
                Active Jobs
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow delay-100">
                <FiUsers
                  className={`h-10 w-10 ${
                    isDark ? "text-primary-400" : "text-white"
                  }`}
                />
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-2">
                {seekersCount}
              </h3>
              <p className={isDark ? "text-primary-300" : "text-blue-100"}>
                Job Seekers
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg animate-bounce-slow delay-200">
                <FiTrendingUp
                  className={`h-10 w-10 ${
                    isDark ? "text-primary-400" : "text-white"
                  }`}
                />
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-2">
                {employersCount}
              </h3>
              <p className={isDark ? "text-primary-300" : "text-blue-100"}>
                Employers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-16 text-gray-50 dark:text-gray-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          />
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5s22.43-56.38,9.08-98.9c-4.34-14.14-9.77-28.31-14.79-42.81L0,0Z"
            opacity=".5"
            fill="currentColor"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
