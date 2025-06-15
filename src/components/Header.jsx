import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-[#0A1F44] text-white w-full">
      <nav className="flex items-center justify-between px-4 py-4 max-w-6xl mx-auto">
        <div className="text-xl font-bold">StartupName</div>
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <ul
          className={`md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-600 md:bg-transparent px-4 md:px-0 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li className="py-2 md:py-0">
            <Link
              to="/"
            
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              Home
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/analyzer"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              Analyze
            </Link>
          </li>
          {/* <li className="py-2 md:py-0">
            <a
              href="#"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              Pricing
            </a>
          </li> */}
          {/* <li className="py-2 md:py-0">
            <Link
              to="/about"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              Contact Us
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};
export default Header;
