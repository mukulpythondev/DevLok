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

const App = () => {
  return (
    <AppContextProvider>
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
                  <Layout>
                    <VerifyOtp />
                  </Layout>
                }
                requiresOtp={true}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
