import React, { createContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance"; // Ensure this imports your axios instance

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // current users
    const [users,setUsers] = useState(null)  // all users
    const [otpRequested, setOtpRequested] = useState(false);
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
        finally{
            setLoading(false)
        }
    };
    
    // Check for stored cookies and fetch user details on initial load
    useEffect(() => {
        fetchUserDetails(); // Call fetchUserDetails directly
    }, []);
    return (
        <AppContext.Provider value={{ loading, setLoading, user, setUser , users , setUsers, otpRequested, setOtpRequested}}>
            <>
                <Toaster />
                {children}
            </>
        </AppContext.Provider>
    );
};
