import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 boxes for OTP
  const { user } = useContext(AppContext); // Access global state for email
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    // Allow only digits and limit to single character
    if (/^[0-9]*$/.test(value) && value.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOtp(newOTP); // Update OTP state

      // Automatically focus on the next input if current is filled
      if (index < 5 && value) {
        document.getElementById(`otp-${index + 1}`).focus();
      } 
      // Optionally, focus back to previous input if value is empty
      if (index > 0 && !value) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join(""); // Combine OTP digits into a string

    if (otpString.length < 6) { // Ensure all boxes are filled
      toast.error("Please enter a complete OTP.");
      return;
    }

    try {
      const res = await axiosInstance.post("/users/verify-otp", {
        email: user.email, // Use the email stored in global state
        otp: otpString, // Correct key to match your API
      });

      if (res.data.success) {
        toast.success("OTP verified successfully");
        navigate("/login"); // Navigate to the next page after verification
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error); // Log error for debugging
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100">
      <div className="bg-black-200 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">Verify OTP</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-2 mt-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded text-center"
                maxLength="1"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-black-800 font-bold py-2 px-4 rounded"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
