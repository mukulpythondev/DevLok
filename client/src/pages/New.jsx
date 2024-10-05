import { useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import TinderCard from "react-tinder-card"; // Tinder-like card library
import { FaHeart, FaTimes } from "react-icons/fa"; // Icons for like/dislike

const New = () => {
  const { user } = useContext(AppContext); // Assuming user is fetched in context
  const [usersToShow, setUsersToShow] = useState([]); // Users filtered for swipe
  const [currentIndex, setCurrentIndex] = useState(0); // Track which card is being shown

  // Fetch all users when the current user is available in the context
  const fetchAllUsers = async () => {
    try {
      if (user) {
        const response = await axiosInstance.get("users/getallusers");
        const { data } = response.data;
        
        // Filter out current user and users already in favourites/disliked
        const filteredUsers = data.filter(
          (u) =>
            u?._id !== user?._id &&
            !user?.favourites?.includes(u?._id) &&
            !user?.disliked?.includes(u?._id)
        );
        setUsersToShow(filteredUsers);
      }
    } catch (error) {
      toast.error("Failed to fetch users.");
    }
  };

  const updateUserAction = async (id, actionType) => {
    // Determine the endpoint based on actionType
    const listType = actionType === "favourite" ? "addtofavourite" : "addtodisliked";
    
    try {
      // Make the API call
      await axiosInstance.patch(`users/${listType}/${id}`, { actionType });
      const currentUser = usersToShow[currentIndex]; 
      console.log(currentUser)
      // Show success toast
      const actionMessage = actionType === 'favourite' ? 'favourites' : 'disliked';
      toast.success(`${currentUser?.name} added to ${actionMessage}`);
    } catch (error) {
      // Show error toast
      const actionMessage = actionType === 'favourite' ? 'favourites' : 'disliked';
      console.log(error)
      toast.error(`Failed to add to ${actionMessage}`);
    }
  };
  

  // Handle swipe action
  const swiped = (direction, userItem) => {
    if (direction === "right") {
      updateUserAction(userItem._id, "favourite"); // Swipe right = favourite
    } else if (direction === "left") {
      updateUserAction(userItem._id, "dislike"); // Swipe left = disliked
    }
    // Move to next card
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // When a card goes off screen
  const outOfFrame = (userItem) => {
    console.log(`${userItem.name} left the screen`);
  };

  // Manually move to next card when clicking on the buttons
  const handleAction = (action) => {
    if (usersToShow.length > currentIndex) {
      const currentUser = usersToShow[currentIndex];
      updateUserAction(currentUser._id, action);
      
      // Move to next card
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Use effect to fetch all users when the current user is available in the context
  useEffect(() => {
    if (user) {
      fetchAllUsers(); // Fetch all users once the user is available
    }
  }, [user]); // Dependency is on 'user'

  return (
    <div className="bg-black-100 h-screen w-screen flex flex-col items-center justify-center">
      <h1 className="text-white text-3xl mb-6">Find Your Match</h1>
      <div className="relative cursor-pointer w-80 flex flex-col items-center">
        {usersToShow.length > 0 && usersToShow[currentIndex] ? (
          <>
            <TinderCard
              key={usersToShow[currentIndex]._id}
              className="swipe"
              onSwipe={(dir) => swiped(dir, usersToShow[currentIndex])}
              onCardLeftScreen={() => outOfFrame(usersToShow[currentIndex])}
              preventSwipe={["up", "down"]}
            >
              <div
                className="w-80 h-96 bg-cover bg-center rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 flex items-end"
                style={{
                  backgroundImage: `url(${usersToShow[currentIndex].profile})`,
                }}
              >
                <h3 className="text-lg font-bold text-white p-4 bg-black bg-opacity-50 w-full">
                  {usersToShow[currentIndex].name}
                </h3>
              </div>
            </TinderCard>
            {/* Buttons for Dislike (cross) and Favourite (heart) below the card */}
            <div className="flex justify-around w-full mt-8">
              <button
                className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                onClick={() => handleAction("dislike")} // Trigger dislike action
              >
                <FaTimes className="text-2xl" />
              </button>
              <button
                className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                onClick={() => handleAction("favourite")} // Trigger favourite action
              >
                <FaHeart className="text-2xl" />
              </button>
            </div>
          </>
        ) : (
          <h2 className="text-white text-xl">No more devs available</h2>
        )}
      </div>
    </div>
  );
};

export default New;
