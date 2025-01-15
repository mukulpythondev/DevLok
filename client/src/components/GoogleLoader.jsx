import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { AppContext } from '../context/AppContext';
const GoogleRedirect = () => {
  const { user } = useContext(AppContext); 
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = () => {
      // Delay for 1 second to ensure user data is available
      setTimeout(() => {
        if (user) {
          navigate('/new'); // Redirect to the desired route if user exists
        } else {
          navigate('/login'); // Redirect to login if user is not authenticated
        }
      }, 1500);
    };

    handleRedirect();
  }, [user, navigate]);

  return <Loader />; // Use the existing Loader for UI
};

export default GoogleRedirect;
