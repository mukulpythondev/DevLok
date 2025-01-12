import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Layout from "./components/Layout";
import { AppContextProvider } from "./context/AppContext";
import VerifyOtp from "./components/VerifyOTP";
import New from "./pages/New";
import ProtectedRoute from "./components/ProtectedRoute"; // Now handles both OTP and auth protection
import About from "./pages/About";
import Safety from "./pages/Safety";
import { SocketProvider } from "./context/SocketContext";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <AppContextProvider>
      <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
           <Route
            path="/profile"
            element= {
              <ProtectedRoute
            element={
              <Layout>
                <Profile />
              </Layout>
            } />
            }
          />
           <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
           <Route
            path="/safety"
            element={
              <Layout>
                <Safety />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <SignUp />
              </Layout>
            }
          />
          <Route
            path="/chats"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <Chats />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <New />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/verify-otp"
            element={
              <ProtectedRoute
                element={
                  
                    <VerifyOtp />
                }
                requiresOtp={true}
              />
            }
          />
        </Routes>
      </BrowserRouter>
      </SocketProvider>
    </AppContextProvider>
  );
};

export default App;
