import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import { getPreferLanguage } from "../store/reportSlice";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const baseUrl = window.location.origin;
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { i18n, t } = useTranslation();
  const { preferLanguage, loading, error } = useSelector(
    (state) => state.report
  );
  const [userPreferLanguage, setuserPreferLanguage] = useState("en");
  // const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  let selectedLanguage = "en";
  const changeLanguage = async (lng) => {
    console.log("Changing language to:", lng);
    await updateLanguagePreference(lng);
    selectedLanguage = lng; // only update for homepage
    i18n.changeLanguage(lng); // this updates globally
    toggleMenu(); // close the menu after changing language
  };

  const updateLanguagePreference = async (lng) => {
    console.log("Updating language preference to:", lng);
    if (isSignedIn && user?.id) {
      try {
        const token = await getToken();
        const response = await axios.patch(
          `${import.meta.env.VITE_API_URL}/updateuserlanguage/${lng}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Language updated successfully", response.data);
      } catch (err) {
        console.error("Language update failed", err);
      }
    }
  };

  useEffect(() => {
    const fetchAndDispatch = async () => {
      try {
        console.log("Fetched token:", user?.id);

        dispatch(
          getPreferLanguage({
            // language: i18n.language || "en",
            userId: user?.id,
          })
        );
      } catch (err) {
        console.error("Failed to fetch token:", err);
      }
    };
    if (isSignedIn && user?.id && location.pathname != "/analyzer") {
      // if (isSignedIn && user?.id) {
      fetchAndDispatch();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (loading) return; // wait for loading to finish{
    if (error) {
      console.error("Error fetching preferred language:", error);
      return;
    }
    if (preferLanguage && preferLanguage !== i18n.language) {
      i18n.changeLanguage(preferLanguage);
      setuserPreferLanguage(preferLanguage);
      // selectedLanguage = preferLanguage;
      console.log("Prefer language from store:", preferLanguage);
    }
  }, [loading]);

  useEffect(() => {
    console.log("i18n.language changed to:", i18n.language);
    setuserPreferLanguage(i18n.language);
  }, [i18n.language]);

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
    <header className="w-full bg-[#eaf0fe]">
      <nav className="navbar flex container items-center justify-between max-w-8xl mx-auto sm:px-6">
        <div className="text-xl font-bold">
          <Link to="/">
            <img
              src="/logo.png"
              alt="logo"
              className="lg:h-25 md:h-17 sm:h-17 h-17 w-auto object-contain"
            />
          </Link>
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
          className={`navbarul md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto px-4 md:px-0 transition-all duration-300 ${
            isOpen ? "block bg-[#eaf0fe]" : "hidden"
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
          {/* <li
            className="py-2 md:py-0"
            onClick={isOpen ? toggleMenu : undefined}
          >
            <a
              href={`${baseUrl}#how`}
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              {t("homePage.stepsTitle")}
            </a>
          </li> */}
          {/* <li
            className="py-2 md:py-0"
            onClick={isOpen ? toggleMenu : undefined}
          >
            <a
              href={`${baseUrl}#review`}
              className="block px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              {t("header.nav.testimonial")}
            </a>
          </li> */}
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
          <li className="py-2 md:py-0">
            <select
              className="border-0 focus:outline-none block px-3 py-1 rounded hover:bg-white hover:text-black transition"
              onChange={(e) => changeLanguage(e.target.value)}
              value={userPreferLanguage}
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
      {location.pathname === "/" && <Hero />}
    </header>
  );
};
export default Header;
