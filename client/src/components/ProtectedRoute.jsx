import { Navigate } from 'react-router-dom';
import Loader from './Loader'; // Assuming you have a loader component
import { useAuth } from '../context/AppContext';

const ProtectedRoute = ({ element, requiresOtp = false, restrictToUnauthenticated = false }) => {
  const { user, otpRequested, loading } = useAuth();

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

  // If restricting to unauthenticated users (e.g., login/signup), allow them access
  if (restrictToUnauthenticated && user) {
    return <Navigate to="/" replace />; // Redirect logged-in users to home
  }

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!user && !restrictToUnauthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If everything is fine, render the element (page)
  return element;
};

export default ProtectedRoute;
