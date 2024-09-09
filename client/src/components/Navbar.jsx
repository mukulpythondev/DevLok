

const Navbar = () => {
  return (
    <nav className="w-full  backdrop-blur-md   fixed top-0  ">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-7  ">
      <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
        <h2 className="self-center text-3xl text-rose-600 hover:text-white transition-all duration-200  font-semibold "> [ <span className="text-white transition-all duration-200 hover:text-rose-500" >DevLok</span> ] </h2>
      </a>
  
  
      <div className="hidden w-full md:block md:w-auto" >
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border  rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
          <li>
            <a href="#" className="block py-2 px-3 md:hover:text-rose-600 text-xl text-white  rounded md:bg-transparent ">
              Safety
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-5 md:rounded-full  text-xl rounded md:hover:border-1  md:hover:border-rose-600 md:hover:bg-white md:hover:text-rose-600 transition-all duration-300  text-white bg-rose-600">
              Sign Up
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 px-6 md:rounded-full text-xl rounded md:hover:border-1  md:hover:border-rose-600 md:hover:bg-white md:hover:text-rose-600 transition-all duration-300  text-white bg-rose-600">
              Login
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  

  )
}

export default Navbar