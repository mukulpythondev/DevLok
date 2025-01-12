import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { generateKeyPair } from "../utils/cryptoUtils"; // Import the utility function
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUpload } from "../hooks/useUpload";

const SignUp = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    linkedinUrl: "", // LinkedIn URL field
    bio: "", // Bio field
  });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const { setUser, setOtpRequested } = useContext(AppContext);
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

  const handleImage = (e) => {
    const { files } = e.target;
    if (files[0].size > 1000000) {
      toast.error("File size must be less than 1 MB");
      return;
    }
    setImage(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, name, password, linkedinUrl, bio } = formData;
      if (
        name.trim() === "" ||
        email.trim() === "" ||
        password.trim() === "" ||
        image === null ||
        linkedinUrl.trim() === "" ||
        bio.trim() === ""
      ) {
        toast.error("All fields are required.");
        return;
      }
      
      // Generate the public/private key pair
      const {n,e} = await generateKeyPair();
      // console.log(formData, publicKey.e, publicKey.n)
      // Image upload process
      const { public_id, url } = await useUpload({ image });
      if (!public_id || !url) {
        toast.error("Error when uploading image");
        return;
      }

      // Send form data and the public key to the server
      const res = await axiosInstance.post("/users/signup", {
        name,
        email,
        password,
        profile: url,
        publicId: public_id,
        linkedinUrl,
        bio,
        publicKey:{
          n,e 
        } , // Send public key to the backend
      });
      
      const data = res.data;
      // console.log("Data", data)
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setFormData({ name: "", password: "", email: "", linkedinUrl: "", bio: "" });
        setUser(data?.data);
        setOtpRequested(true);
        navigate("/verify-otp");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || "An error occurred during signup.";
        
        if (status === 400) {
          toast.error(message); // Display server message for existing email
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("An error occurred during signup.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-black-100">
      <div className="bg-black-200 p-4 mt-36 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">
          Join Devlok
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

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
              type={showPassword ? "password" : "text"}
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

          {/* LinkedIn URL Field */}
          <div>
            <label
              htmlFor="linkedininUrl"
              className="block text-black-700 font-ropaOne mb-2"
            >
              LinkedIn URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="Enter your LinkedIn URL"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label
              htmlFor="bio"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              maxLength={50}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

          {/* File Upload (Image) */}
          <div>
            <label
              htmlFor="image"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImage}
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 text-white text-lg font-semibold rounded-lg hover:bg-rose-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
