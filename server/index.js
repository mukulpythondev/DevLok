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
    const users = {};
    // Socket.IO connection handler
    io.on("connection", (socket) => {
      console.log(socket.id, "Connected");
      // send a welcome message to the connected client
      socket.emit("welcome", `Welcome to the chat server ${socket.id}`);
    
      // handle the inititate-chat event
      socket.on("initiate-chat", ({ senderEmail, recipientEmail }) => {
        // store the recipient's socket id
        users[senderEmail] = socket.id;
        console.log(Object.keys(users).length);
        // notify the recipient about the new user
        if (users[recipientEmail]) {
          // notify both the sender and the recipient that the chat is initiated
          io.to(users[recipientEmail]).emit("chat-initiated", senderEmail);
          io.to(users[senderEmail]).emit("chat-initiated", recipientEmail);
        } else {
          // handle offline user
          console.log(`User ${recipientEmail} is offline`);
          // notify the sender that the recipient is offline
          io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
        }
      });
    
      // handle sending messages
      socket.on("send-message", ({ senderEmail, recipientEmail, message }) => {
        // send the message to the recipient/receiver
        console.log({ senderEmail, recipientEmail, message });
        if (users[recipientEmail]) {
          // send the message only to the recipient
          io.to(users[recipientEmail]).emit("receive-message", {
            senderEmail,
            message,
          });
        } else {
          // handle offline user
          console.log(`User ${recipientEmail} is offline`);
          // notify the sender that the recipient is offline
          io.to(users[senderEmail]).emit("recipient-offline", recipientEmail);
        }
      });
    
      // handle the disconnect event
      socket.on("disconnect", () => {
        console.log(socket.id, "Disconnected");
        // remove the socket id form the user object
        const email = Object.keys(users).find((key) => users[key] === socket.id);
        if (email) {
          delete users[email];
        }
      });
    });

    // Start the server
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });
