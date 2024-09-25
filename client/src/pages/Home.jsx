import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{ backgroundImage: "url('public/home.webp')" }}
      className="flex h-screen items-center justify-center flex-col"
    >
      <h1 className="text-5xl text-center w-1/2 leading-snug text-white">
        Match with Someone Who <span className="text-rose-500">Loves</span> Dark Mode..
      </h1>
      <p className="text-black-700 text-center mt-4 text-xl w-1/2">
        In Devlok, relationships are like responsive design – adaptable and made to fit perfectly, no matter the screen size.
      </p>
      <Link
        to="/signup"
        className="relative overflow-hidden inline-flex group items-center justify-center px-6 py-3 mt-8 cursor-pointer border-b-4 border-l-2 border-rose-700 active:border-rose-600 active:shadow-none shadow-lg bg-gradient-to-tr from-rose-600 to-rose-500 text-white font-bold text-lg rounded-full"
      >
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-40 group-hover:h-40 opacity-10"></span>
        <span className="relative">Deploy Love</span>
      </Link>
    </div>
  );
};

export default Home;
