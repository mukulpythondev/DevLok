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
import ResetPassword from "./components/ResetPassword";
import GoogleRedirect from "./components/GoogleLoader";

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
              path="/google-redirect"
              element={
                  <GoogleRedirect />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={
                    <Layout>
                      <Profile />
                    </Layout>
                  }
                />
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
            {/* Protect login and signup routes from authenticated users */}
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  element={
                    <Layout>
                      <Login />
                    </Layout>
                  }
                  restrictToUnauthenticated={true}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute
                  element={
                    <Layout>
                      <SignUp />
                    </Layout>
                  }
                  restrictToUnauthenticated={true}
                />
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
                  element={<VerifyOtp />}
                  requiresOtp={true}
                />
              }
            />
            {/* Forgot Password Route */}
            <Route
              path="/forgot-password"
              element={
                <Layout>
                  <ResetPassword />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AppContextProvider>
  );
};

export default App;
