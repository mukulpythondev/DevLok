import React, { createContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import axiosInstance from "../api/axiosInstance"; // Ensure this imports your axios instance
import Cookies from "js-cookie"; // Import js-cookie

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [progress, setProgress] = useState(0);
    const [user, setUser] = useState(null); // current users
    const [users,setUsers] = useState(null)  // all users

    // Function to fetch user details if needed
    const fetchUserDetails = async () => {
        try {
            const response = await axiosInstance.get("users/user/details");
            setUser(response.data.data); // Set user details
        } catch (error) {
            console.log("Failed to fetch user details:", error);
            setUser(null)
            // Optionally handle errors (e.g., clear user state or redirect)
        }
    };
    
    // Check for stored cookies and fetch user details on initial load
    useEffect(() => {
        fetchUserDetails(); // Call fetchUserDetails directly
    }, []);
    return (
        <AppContext.Provider value={{ progress, setProgress, user, setUser , users , setUsers}}>
            <>
                <Toaster />
                <LoadingBar height={3} color="black" />
                {children}
            </>
        </AppContext.Provider>
    );
};
