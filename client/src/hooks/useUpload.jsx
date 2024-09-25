import axios from "axios";

export const useUpload = async ({ image, onUploadProgress }) => {
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "devlok");
      formData.append("api_key", "751361155385887");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Corrected MIME type
        },
        onUploadProgress: onUploadProgress,
        withCredentials: false,
      };

      // Corrected URL with .com part
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwgi96ynx/image/upload",
        formData,
        config
      );
      
      const data = response.data;
      
      if (!data) {
        throw new Error("Error while uploading the image");
      }

      return {
        public_id: data.public_id,
        url: data.secure_url,
      };
    } catch (error) {
      return error?.message;
    }
  };

  const { public_id, url } = await upload();
  return { public_id, url }; // Use object return, not comma-separated values
};
