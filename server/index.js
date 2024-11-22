import dotenv from "dotenv";
import { connectDB } from "./src/database/index.js";
import { server } from "./src/socket/socket.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB()
  .then(() => {
    console.log("Connected to the database successfully");

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
