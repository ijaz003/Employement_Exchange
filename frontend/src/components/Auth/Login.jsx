import React, { useEffect, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthorized, setUser } from "../../store/UserReducers.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthorized, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthorized) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [isAuthorized, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/auth/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      dispatch(setUser(data.user));
      dispatch(setIsAuthorized(true));
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      dispatch(setIsAuthorized(false));
    }
  };

  const handleGoogleSignIn = (role) => {
    window.open(`http://localhost:4000/api/v1/user/auth/google?role=${role}`, '_self');
  };

  return (
    <>
      <section className="authPage">
        <div className="container">
          <div className="header">
            <img src="/careerconnect-black.png" alt="logo" />
            <h3>Login to your account</h3>
          </div>
          <form>
            <div className="inputTag">
              <label>Login As</label>
              <div>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="inputTag">
              <label>Email Address</label>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div>
                <input
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" onClick={handleLogin}>
              Login
            </button>
            <button
              type="button"
              onClick={() => handleGoogleSignIn(role)}
              style={{
                marginTop: "10px",
                background: "#fff",
                color: "#333",
                border: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                alt="Google"
                style={{ width: "20px", height: "20px" }}
              />
              Sign In with Google
            </button>
            <Link to={"/register"}>Register Now</Link>
          </form>
        </div>
        <div className="banner">
          <img src="/login.png" alt="login" />
        </div>
      </section>
    </>
  );
};

export default Login;
