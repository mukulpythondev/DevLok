import { Server } from "socket.io";
import http from "http";
import app from "../app.js";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import Redis from "ioredis";

// Redis Configuration
const redisServerConfig = {
  host: "localhost",
  port: 6379,
};

// Redis Clients
const pubClient = new Redis(redisServerConfig); // For Pub/Sub
const subClient = pubClient.duplicate();        // Duplicate for Subscribing
const onlineUsersClient = pubClient.duplicate(); // For tracking online users

// HTTP Server and Socket.IO Initialization
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update to match your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach Redis Streams Adapter for Pub/Sub
io.adapter(createAdapter(pubClient, subClient));

// Redis Key for Online Users
const USERS_KEY = "online_users";

// Utility Functions for Online User Management
export const addUser = async (userId, socketId) => {
  try {
    await onlineUsersClient.hset(USERS_KEY, userId, socketId);
  } catch (error) {
    console.error(`Error adding user ${userId}:`, error);
  }
};

export const removeUser = async (userId) => {
  try {
    await onlineUsersClient.hdel(USERS_KEY, userId);
  } catch (error) {
    console.error(`Error removing user ${userId}:`, error);
  }
};

export const getOnlineUsers = async () => {
  try {
    return await onlineUsersClient.hgetall(USERS_KEY);
  } catch (error) {
    console.error("Error fetching online users:", error);
    return {};
  }
};

export const getReceiverSocketId = async (receiverId) => {
  try {
    return await onlineUsersClient.hget(USERS_KEY, receiverId);
  } catch (error) {
    console.error(`Error fetching socket ID for user ${receiverId}:`, error);
    return null;
  }
};

// Socket.IO Logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    // Add user to Redis
    addUser(userId, socket.id)
      .then(() => {
        console.log(`User ${userId} added with socket ${socket.id}`);
        // Broadcast updated online users
        notifyOnlineUsers();
      })
      .catch((err) => console.error("Error adding user:", err));
  }

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    if (userId) {
      removeUser(userId)
        .then(() => {
          console.log(`User ${userId} removed`);
          // Broadcast updated online users
          notifyOnlineUsers();
        })
        .catch((err) => console.error("Error removing user:", err));
    }
  });
  socket.on("sendMessage", async ({ receiverId, message }) => {
    try {
      const receiverSocketId = await getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          senderId: userId,
          message,
          createdAt: new Date(),
        });
        console.log(`Message sent to user ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is offline. Message not delivered.`);
      }
    } catch (error) {
      console.error("Error handling sendMessage event:", error);
    }
  });
});

// Notify all users about the current online users
const notifyOnlineUsers = async () => {
  try {
    const users = await getOnlineUsers();
    const onlineUserIds = Object.keys(users); // Convert hash to array of user IDs
    io.emit("getOnlineUsers", onlineUserIds);
  } catch (error) {
    console.error("Error notifying online users:", error);
  }
};

// Export server and io instance
export { io, server };
