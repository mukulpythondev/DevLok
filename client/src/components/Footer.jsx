import { Link } from "react-router-dom";
import logo from "/devlokbinary.jpg"
const Footer = () => {
  return (
    <footer className="w-full border-t-2 border-black-500 bg-black-200 p-6">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Link to={'/'} className="flex items-center space-x-3 rtl:space-x-reverse mb-4 sm:mb-0">
            {/* <h2 className="text-3xl text-rose-600 font-semibold transition-all duration-200 hover:text-white">
              [ <span className="text-white hover:text-rose-500">DevLok</span> ]
            </h2> */}
                      <img src={logo} className="h-20 w-20 md:w-18" alt="" />
            
          </Link>

          <ul className="flex space-x-6 text-white text-xl font-medium">
            <li>
              <Link to={"/about"} className="hover:text-rose-600 transition-all duration-200">About</Link>
            </li>
            <li>
              <Link to={"/safety"} className="hover:text-rose-600 transition-all duration-200">Safety</Link>
            </li>
          </ul>
        </div>

        <hr className="my-6 border-black-500" />
        
        <div className="text-center">
          <span className="block text-sm text-black-600">© { new Date().getFullYear()} DevLok. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
