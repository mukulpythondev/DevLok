# DevLok 🚀  
DevLok is a full-stack, scalable chat application built with **Node.js** and **React.js**, leveraging **Socket.io** for real-time communication and **Redis Pub/Sub** for message broadcasting across multiple instances. Designed for performance, reliability, and scalability, DevLok is ideal for modern applications requiring instant messaging and seamless interactions.

---

## 🌟 Features  
- **Real-time Messaging**: Instant communication with real-time updates using **Socket.io**.  
- **Scalable**: Built with **Redis Pub/Sub** to handle multiple server instances.  
- **Authentication**: Secure user authentication via **JWT** and session management.  
- **User Profiles**: Users can create, manage, and update their profiles.  
- **Chat History**: Persistent chat storage to access and display previous messages.  
- **Responsive Design**: A mobile-friendly UI built using **React** and **Tailwind CSS**.  
- **Notifications**: In-app alerts for new messages to keep users informed.  

---

## ⚙️ Tech Stack  
### **Frontend**  
- **React.js**: For building dynamic and interactive UIs.  
- **Tailwind CSS**: For modern, responsive, and customizable styles.  
- **Socket.io-client**: For real-time communication on the client side.  
- **Zustand**: Lightweight and efficient state management.
- **Cloudinary**: For all images and media upload.
 

### **Backend**  
- **Node.js**: Powering the server-side logic.  
- **Express.js**: For handling routing and middleware.  
- **Socket.io**: Enables real-time WebSocket-based communication.  
- **Redis**: Used for Pub/Sub messaging, enabling distributed scalability.  
- **JWT (JSON Web Token)**: For secure user authentication and authorization.  

### **Database**  
- **MongoDB**: Primary database for user data and chat history.  
- **Mongoose**: For schema modeling and interaction with MongoDB.  

---

## 🚀 Getting Started  

### ✅ Prerequisites  
Ensure the following dependencies are installed:  
- **Node.js** (v14+)  
- **npm** or **yarn**  
- **MongoDB** (local or remote instance)  
- **Redis** (local or remote instance)  

### 🔧 Installation  

#### 1️⃣ Clone the Repository  
Start by cloning the repository to your local machine:  
```bash
git clone https://github.com/mukulpythondev/devlok.git
cd devlok
```
## 2️⃣ Install Dependencies

Install the necessary backend and frontend dependencies:

### Backend

Navigate to the backend directory and install the dependencies:

```bash
cd server
npm install
# OR
yarn install
```
## 3️⃣ Configure Environment Variables

Set up the required environment variables for both the server and client:

##### Backend `.env`

Create a `.env` file in the server directory with the following variables:

```env
PORT=
MONGODB_URL=
DB_NAME=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=
GMAIL=
GMAIL_PASSWORD=
FRONTEND_URL=
BACKEND_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
ENCRYPTION_SECRET=
```
##### Frontend '.env'
```env
VITE_CLOUDINARY_API_KEY=
VITE_CLOUDINARY_PROJECT_ID=
VITE_CLOUDINARY_UPLOAD_PRESET=
VITE_BACKEND_URL=http://localhost:8000
VITE_CLOUDINARY_API_SECRET=
```
## 4️⃣ Start the Application
Start the Redis server (if running locally) using **Docker**:

redis-server

Start the Backend server:

Navigate to the backend directory and run the server:
```bash
cd server
npm start
yarn start
```
Start the Frontend application:

Navigate to the frontend directory and run the React app:
```bash
cd client
npm run dev
```
# Contributing to DevLok

We welcome contributions from the community! Here are some guidelines to help you get started:


## 🛠️ Missing Features

If you notice any missing features or have ideas for new features, feel free to open an issue or discuss it in the community. Your input is valuable!


## 🌡️ Made with ❤️ by **Mukul Rana**




