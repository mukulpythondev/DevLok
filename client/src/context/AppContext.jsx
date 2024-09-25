import React, { createContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import axiosInstance from "../api/axiosInstance"; // Ensure this imports your axios instance
import Cookies from "js-cookie"; // Import js-cookie

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const [user, setUser] = useState(null); // Use null instead of an array for user

    // Function to fetch user details if needed
    const fetchUserDetails = async () => {
        const accessToken = Cookies.get('accessToken'); // Get the access token cookie
        if (!accessToken) {
            console.log("No access token found. User is not logged in.");
            return; // Exit if no token
        }

        try {
            const response = await axiosInstance.get("users/user/details", {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the token in the header
                },
            });
            setUser(response.data.data.user); // Set user details
        } catch (error) {
            console.error("Failed to fetch user details:", error);
            // Optionally handle errors (e.g., clear user state or redirect)
        }
    };

    // Check for stored cookies and fetch user details on initial load
    useEffect(() => {
        fetchUserDetails(); // Call fetchUserDetails directly
    }, []);

    return (
        <AppContext.Provider value={{ progress, setProgress, user, setUser }}>
            <>
                <Toaster />
                <LoadingBar height={3} color="black" />
                {children}
            </>
        </AppContext.Provider>
    );
};
