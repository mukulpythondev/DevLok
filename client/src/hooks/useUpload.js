import axios from "axios";

export const useUpload = async ({ image }) => {

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_PROJECT_ID}/image/upload`;

      const response = await axios.post(cloudinaryUrl, formData, config);

      const data = response.data;
      // console.log(data)
      if (!data) {
        throw new Error("Error while uploading the image");
      }

      return {
        public_id: data.public_id,
        url: data.secure_url,
      };
    } catch (error) {
      console.error("Error during upload:", error.message);
      return null;
    }
  };
  
  return await upload();
};
