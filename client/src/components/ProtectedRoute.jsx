import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Loader from './Loader'; // Assuming you have a loader component

const ProtectedRoute = ({ element, requiresOtp = false }) => {
  const { user, otpRequested, loading } = useContext(AppContext);

  // Show loader while fetching user data
  if (loading) {
    return <Loader />;
  }

  // If the route requires OTP verification
  if (requiresOtp) {
    // If OTP has not been requested, redirect to signup
    if (!otpRequested) {
      return <Navigate to="/signup" replace />;
    }
  } 

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If everything is fine, render the element (page)
  return element;
};

export default ProtectedRoute;
