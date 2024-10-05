import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { FaUserCircle, FaChevronDown } from "react-icons/fa"; // Import react-icons for user and dropdown icon

const Navbar = () => {
  const location = useLocation();
  const { user, setUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      setUser(null);
      setDropdownOpen(false);
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  // Close the dropdown when mouse leaves the dropdown menu
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="w-full backdrop-blur-md fixed top-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-7">
        <Link to={"/"} className="flex items-center space-x-3 rtl:space-x-reverse">
          <h2 className="self-center text-3xl text-rose-600 hover:text-white transition-all duration-200 font-semibold">
            [ <span className="text-white transition-all duration-200 hover:text-rose-500">DevLok</span> ]
          </h2>
        </Link>
        {user ? (
          <div className="relative hidden w-full md:block md:w-auto">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <Link to={"/new"} className="block py-2 px-3 md:hover:text-rose-600 text-xl text-white rounded md:bg-transparent">
                  New
                </Link>
              </li>
              <li className="relative">
                <button onClick={toggleDropdown} className="flex items-center space-x-2 py-2 px-3 md:hover:text-rose-600 text-xl text-white rounded md:bg-transparent">
                  {user?.profile ? (
                    <img src={user.profile} alt="User" className="w-10 h-10 rounded-full" />
                  ) : (
                    <FaUserCircle className="text-2xl" />
                  )}
                  <FaChevronDown className="text-sm" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black-200 rounded-md shadow-lg z-10" onMouseLeave={closeDropdown}>
                    <ul className="py-2">
                      <li>
                        <Link to={"/chats"} className="block px-4 py-2 text-white  hover:text-rose-500">
                          Chats
                        </Link>
                      </li>
                      <li>
                        <Link to={"/friends"} className="block px-4 py-2 text-white hover:text-rose-500">
                          Friends
                        </Link>
                      </li>
                      <li>
                        <Link to={"/profile"} className="block px-4 py-2 text-white hover:text-rose-500">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-white hover:text-rose-500">
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>
        ) : (
          <div className="hidden w-full md:block md:w-auto">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <Link to={"/safety"} className="block py-2 px-3 md:hover:text-rose-600 text-xl text-white rounded md:bg-transparent">
                  Safety
                </Link>
              </li>
              <li>
                {location.pathname !== "/signup" && (
                  <Link to={"/signup"} className="block py-2 px-5 md:rounded-full text-xl rounded md:hover:border-1 md:hover:border-rose-600 md:hover:bg-white md:hover:text-rose-600 transition-all duration-300 text-white bg-rose-600">
                    Sign Up
                  </Link>
                )}
              </li>
              <li>
                {location.pathname !== "/login" && (
                  <Link to={"/login"} className="block py-2 px-6 md:rounded-full text-xl rounded md:hover:border-1 md:hover:border-rose-600 md:hover:bg-white md:hover:text-rose-600 transition-all duration-300 text-white bg-rose-600">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
