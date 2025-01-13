import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);  // Track OTP request
  const [loading, setLoading] = useState(false);  // Track loading state
   const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const { email } = formData;
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/forgot-password", { email });
      const data = res.data;

      if (data.success) {
        toast.success(data.message || "OTP sent successfully.");
        setOtpSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const { email, otp, newPassword } = formData;
    if (!email || !otp || !newPassword) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/users/reset-password", {
        email,
        otp,
        newPassword,
      });
      const data = res.data;

      if (data.success) {
        toast.success(data.message || "Password reset successfully.");
        setFormData({ email: "", otp: "", newPassword: "" });
        navigate("/login")
      } else {
        toast.error(data.message || "Password reset failed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "A network error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black-200 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">
          Reset Password
        </h1>
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
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

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* OTP Field */}
            <div>
              <label
                htmlFor="otp"
                className="block text-black-700 font-ropaOne mb-2"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter OTP"
                className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
              />
            </div>

            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-black-700 font-ropaOne mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
