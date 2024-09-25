import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import { useUpload } from "../hooks/useUpload";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const SignUp = () => {
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setProgress } = useContext(AppContext);

  const onUploadProgress = (progressEvent) => {
    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setProgress(progress);
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
      const { email, name, password } = formData;
      if (name.trim() === "" || email.trim() === "" || password.trim() === "" || image === null) {
        toast.error("All fields are required.");
        return;
      }

      // Image upload process
      const { public_id, url } = await useUpload({ image, onUploadProgress });
      if (!public_id || !url) {
        toast.error("Error when uploading image");
        return;
      }

      // Send form data to server
      const res = await axiosInstance.post("/users/signup", {
        name,
        email,
        password,
        profile: url,
         publicId: public_id,
      });

      const data = res.data;
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setFormData({ name: "", password: "", email: "" });
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error.message);
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
          <div>
            <label
              htmlFor="password"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>

          {/* File Upload Field */}
          <div>
            <label
              htmlFor="file"
              className="block text-black-700 font-ropaOne mb-2"
            >
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="file"
              name="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full p-3 bg-black-300 text-black-600 border border-black-500 rounded"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-black-800 font-bold py-2 px-4 rounded"
          >
            Sign Up
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

export default SignUp;
