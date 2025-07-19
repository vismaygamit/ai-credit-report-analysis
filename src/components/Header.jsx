import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { i18n, t } = useTranslation();
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  const changeLanguage = (lng) => {
    // localStorage.setItem("selectedLanguage", lng);
    i18n.changeLanguage(lng); // this updates globally
    toggleMenu(); // close the menu after changing language
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
    { code: "uk", label: "Українська" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    // { code: "ar", label: "العربية" },
    { code: "hi", label: "हिंदी" },
  ];

  return (
    <header className="bg-[#0A1F44] text-white w-full">
      <nav className="flex items-center justify-between px-4 py-4 max-w-6xl mx-auto">
        <div className="text-xl font-bold">
          <Link to="/">Scorewise</Link>
        </div>
        <button onClick={toggleMenu} className="md:hidden focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
          className={`md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto px-4 md:px-0 transition-all duration-300 ${
            isOpen ? "block bg-[#0A1F44]" : "hidden"
          }`}
        >
          <li
            className="py-2 md:py-0"
            onClick={isOpen ? toggleMenu : undefined}
          >
            <Link
              to="/"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              {t("header.nav.home")}
            </Link>
          </li>
          {/* {isSignedIn && ( */}
          <li
            className="py-2 md:py-0"
            onClick={isOpen ? toggleMenu : undefined}
          >
            <Link
              to="/analyzer"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              {t("header.nav.analyze")}
            </Link>
          </li>
          {/* )} */}
          <li
            className="py-2 md:py-0"
            onClick={isOpen ? toggleMenu : undefined}
          >
            <Link
              to="/privacypolicy"
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              {t("privacyPage.title")}
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <SignedOut>
              <SignInButton
                forceRedirectUrl="/analyzer"
                mode="modal"
                className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
              >
                {t("header.nav.signIn")}
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <button className="block px-3 py-1 rounded hover:bg-white hover:text-black transition">
                <UserButton />
              </button>
            </SignedIn>
          </li>
          <li className="py-2 md:py-0" id="translate">
            <select
              className="border-0 focus:outline-none block px-3 py-1 rounded hover:bg-white hover:text-black transition"
              onChange={(e) => changeLanguage(e.target.value)}
              // value={selectedLanguage}
            >
              {languages.map((lang) => (
                <option
                  key={lang.code}
                  value={lang.code}
                  className="text-black"
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.label}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
