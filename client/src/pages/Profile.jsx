import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../api/axiosInstance";
import Loader from "../components/Loader";
import { useUpload } from "../hooks/useUpload";

const Profile = () => {
  const { user, setUser } = useContext(AppContext);
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [loading, setLoading] = useState(true); // State for handling loading
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedinUrl: "",
    bio: "",
  });

  const [image, setImage] = useState(null); // For profile picture upload
  const [imagePreview, setImagePreview] = useState(""); // Preview current profile image
  const [isImageUploaded, setIsImageUploaded] = useState(false); // To track if image is already uploaded

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        linkedinUrl: user.linkedinUrl || "",
        bio: user.bio || "",
      });
      setImagePreview(user.profile || "");
    }
    setLoading(false); // Data loaded
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImage = (e) => {
    const { files } = e.target;
    if (files[0]?.size > 1000000) {
      toast.error("File size must be less than 1 MB");
      return;
    }
    const newImage = files[0];
    setImage(newImage);
    setIsImageUploaded(false); // Mark as not uploaded yet

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(newImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, linkedinUrl, bio } = formData;

    // Check if any field has changed
    if (
      name === user.name &&
      email === user.email &&
      linkedinUrl === user.linkedinUrl &&
      bio === user.bio &&
      (!image || isImageUploaded)
    ) {
      toast.error("No changes to update.");
      return;
    }

    try {
      setIsUploading(true);
      let profileUrl = user?.profile || "";
      let publicId = user?.publicId || "";

      // Upload image if selected and not already uploaded
      if (image && !isImageUploaded) {
        const { public_id, url } = await useUpload({ image });
        if (!public_id || !url) {
          toast.error("Error uploading image.");
          setIsUploading(false);
          return;
        }
        profileUrl = url;
        publicId = public_id;
        setIsImageUploaded(true); // Mark as uploaded
      }

      // Update profile data
      const res = await axiosInstance.put("/users/profile", {
        name,
        email,
        linkedinUrl,
        bio,
        profile: profileUrl,
        publicId,
      });

      const data = res.data;
      if (data.success) {
        toast.success(data.message);
        setUser(data.data); // Update user context
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the profile.");
    }
    finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-black-100">
      <div className="bg-black-200 p-4 mt-36 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-rose-500 text-3xl font-concertOne mb-6">Profile Page</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <img
              src={imagePreview || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-rose-500 mb-4"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-black-700 font-ropaOne mb-2">Name</label>
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
          <div>
            <label htmlFor="email" className="block text-black-700 font-ropaOne mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
              disabled
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className="block text-black-700 font-ropaOne mb-2">LinkedIn URL</label>
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
          <div>
            <label htmlFor="bio" className="block text-black-700 font-ropaOne mb-2">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write a short bio"
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-black-700 font-ropaOne mb-2">Upload New Profile Picture</label>
            <input
              type="file"
              id="image"
              onChange={handleImage}
              className="w-full p-3 bg-black-300 text-black-800 placeholder-black-600 border border-black-500 focus:ring-rose-500 focus:border-rose-500 rounded"
            />
          </div>
          <button
            type="submit"   disabled={isUploading}
            className="w-full py-3 bg-rose-500 text-white text-lg font-semibold rounded-lg hover:bg-rose-600"
          >
              {isUploading ? "Uploading..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
