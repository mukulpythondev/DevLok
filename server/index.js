import http from "http";
import app from "./src/app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./src/database/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000; // Use process.env.PORT or default to 5000

// Connect to the database
connectDB()
  .then(() => {
    const server = http.createServer(app); // Create only one server for both Express and Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    // Socket.IO connection handler
    io.on("connection", (socket) => {
      console.log("Connected: " + socket.id);
      socket.emit("Welcome", `Welcome to the chat server, ${socket.id}`);
    });

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

