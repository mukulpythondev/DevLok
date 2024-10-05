import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const {setUser,setProgress}= useContext(AppContext)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setProgress(0);
    e.preventDefault();
    try {
      const { email, password } = formData;
      if (email.trim() === "" || password.trim() === "") {
        toast.error("All fields are required.");
        return;
      }
  
      const res = await axiosInstance.post("/users/login", {
        email,
        password,
      });
  
      const data = await res.data;
      if (data.success) {
        toast.success(data.message);
        setFormData({ email: "", password: "" });
        setUser(data?.data?.user);
        console.log(data?.accessToken)
        setProgress(100);
        navigate("/new"); // Redirect after successful login
      } else {
        toast.error("Invalid Credentials" || data.message);
      }
    } catch (error) {
      // Check if the error is an Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        const status = error.response.status;
        const message = error.response.data.message || "An error occurred during login.";
  
        if (status === 404) {
          toast.error("User does not exist."); // Customize for 404
        } else if (status === 400) {
          toast.error(message); // Display the message from the server
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        // Handle network or other errors
        toast.error("An error occurred during login.");
      }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black-200 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Password
            </label>
            <input
              type={showPassword? "password":"text"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
                 <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute text-xl inset-y-0 right-3 top-7 flex items-center text-zinc-400 focus:outline-none"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show different icons based on state */}

      </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-black-800 font-bold py-2 px-4 rounded"
          >
            Login
          </button>

          {/* Continue with Google Button */}
          <button
            type="button"
            className="w-full mt-4 bg-black-400 text-black-800 py-2 px-4 rounded hover:bg-black-500 flex items-center justify-center"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google Logo"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
