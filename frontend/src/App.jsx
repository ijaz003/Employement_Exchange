import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import PostJob from "./components/Job/PostJob";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import MyJobs from "./components/Job/MyJobs";
import NotFound from "./components/NotFound/NotFound";
import Profile from "./components/Profile/Profile";
import BuyPlan from "./components/BuyPlan";
import Success from "./components/Success";
import ProtectedRoute from "./components/Middleware/ProtectedRoute";
import socket from "./utils/socket";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "./store/NotificationReducer";
import Notifications from "./components/Notifications";
import CustomToaster from "./components/CustomToaster";

// home,Jobs,
function App() {
  const { isAuthorized, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthorized) {
      socket.connect();
      socket.on("connect", () => {
        console.log("Socket connected");
        if (user && user._id) {
          socket.emit("registerUser", user);
        }
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    } else {
      socket.disconnect();
    }
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [isAuthorized, user, dispatch]);
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job/:id"
                element={
                  <ProtectedRoute>
                    <JobDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/application/:jobId"
                element={
                  <ProtectedRoute>
                    <Application />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-jobs"
                element={
                  <ProtectedRoute>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/plane" element={<BuyPlan />} />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <Success />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <CustomToaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
