import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const Login = () => {
  const { setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;

      if (email.trim() === "" || password.trim() === "") {
        toast.error("All fields are required.");
        return;
      }

      const res = await axiosInstance.post("/users/login", { email, password });
      const data = await res.data;
      if (data.success) {
        toast.success(data.message);
        setFormData({ email: "", password: "" });
        setUser(data?.data?.user);
        navigate("/new");
      } else {
        toast.error(data.message || "Invalid Credentials");
      }
    } catch (error) {
      if (error.response) {
        const { status, data: { message } = {} } = error.response;

        if (status === 404) {
          toast.error("User does not exist.");
        } else if (status === 400) {
          toast.error(message || "Invalid login request.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("A network error occurred. Please try again.");
      }
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black-200 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6 mb-2">
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
              type={showPassword ? "text" : "password"}
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full gap-x-2 mt-4 bg-black-400 text-black-800 py-2 px-4 rounded hover:bg-black-500 flex items-center justify-center"
          >
           <FaGoogle />
            Continue with Google
          </button>
        </form>
        <Link
                        to={"/forgot-password"}
                        className="underline mt-2 text-lg text-white hover:text-rose-600"
                      >
                        fogot password
                      </Link>
      </div>
    </div>
  );
};

export default Login;
