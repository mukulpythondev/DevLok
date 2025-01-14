import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";
import { FaUserCircle, FaChevronDown, FaBars } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import logo from "/devlokbinary.jpg"
const Navbar = () => {
  const location = useLocation();
  const { user, setUser } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    if (dropdownOpen) setDropdownOpen(false);
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full backdrop-blur-md fixed top-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-4">
        {/* Logo */}
        <Link to={"/"} className="flex items-center space-x-3">
          {/* <h2 className="self-center text-3xl text-rose-600 hover:text-white transition-all duration-200 font-semibold">
            [<span className="text-white hover:text-rose-500">DevLok</span>]
          </h2> */}
          <img src={logo} className="h-20 w-20 md:w-18" alt="" />
        </Link>

        {/* Mobile Menu Button */}
        <button className="text-white text-3xl md:hidden" onClick={toggleMenu}>
          {menuOpen ? <IoMdCloseCircleOutline /> : <FaBars />}
        </button>

        {/* Navbar Items */}
        <div
          className={`absolute top-16 left-0 w-full bg-gray-900 md:bg-transparent md:static md:flex md:items-center transition-all duration-300 ${
            menuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="font-medium flex flex-col p-4 space-y-4 md:space-y-0 md:flex-row md:space-x-8 md:ml-auto">
            {user ? (
              <>
                <li>
                  <Link
                    to={"/new"}
                    className="block py-2 px-3 text-xl text-white hover:text-rose-600"
                  >
                    New
                  </Link>
                </li>
                <li className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 py-2 px-3 text-xl text-white hover:text-rose-600"
                  >
                    {user?.profile ? (
                      <img
                        src={user.profile}
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl" />
                    )}
                    <FaChevronDown className="text-sm" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute left-10 md:right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg z-10">
                      <ul className="py-2">
                        <li>
                          <Link
                            to={"/chats"}
                            className="block px-4 py-2 text-white hover:text-rose-500"
                            onClick={() => setDropdownOpen(false)} // Close dropdown
                          >
                            Chats
                          </Link>
                        </li>
                        <li>
                          <Link
                            to={"/profile"}
                            className="block px-4 py-2 text-white hover:text-rose-500"
                            onClick={() => setDropdownOpen(false)} // Close dropdown
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-white hover:text-rose-500"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to={"/safety"}
                    className="py-2 px-3 md:text-xl md:px-4 md:py-2 text-lg text-white hover:text-rose-600"
                  >
                    Safety
                  </Link>
                </li>
                {location.pathname !== "/signup" && (
                  <li>
                    <Link
                      to={"/signup"}
                      className="py-1 px-5 md:text-xl md:px-4 md:py-2 text-lg text-white bg-rose-600 rounded-full hover:bg-white hover:text-rose-600 transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </li>
                )}
                {location.pathname !== "/login" && (
                  <li>
                    <Link
                      to={"/login"}
                      className="py-1 px-6 md:text-xl md:px-4 md:py-2 text-lg text-white bg-rose-600 rounded-full hover:bg-white hover:text-rose-600 transition-all duration-300"
                    >
                      Login
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
