import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import { AppContextProvider } from "./context/AppContext";
import VerifyOtp from "./components/VerifyOTP";

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
              <Layout>
                <Chats />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <Layout>
                <VerifyOtp/>
              </Layout>
            }
          />
        </Routes>
        
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;
