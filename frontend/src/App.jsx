import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
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
import ResumeUpload from "./components/Profile/ResumeUpload";
import BuyPlan from "./components/BuyPlan";
import Success from "./components/Success";
import ProtectedRoute from "./components/Middleware/ProtectedRoute";

// home,Jobs,
function App() {
  return (
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
                <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />  
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/application/:jobId" element={<ProtectedRoute><Application /></ProtectedRoute>} />
                <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
                <Route path="/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
                <Route path="/plane" element={<BuyPlan />} />
                <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    
  );
}

export default App;
