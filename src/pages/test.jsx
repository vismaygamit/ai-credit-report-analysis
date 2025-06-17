import React, { useState } from "react";
import { Link } from "react-router-dom";

const Test = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Helmet>
        <title>Credit Report Analyzer – Boost Your Score Instantly</title>
        <meta
          name="description"
          content="Upload your credit report and receive instant AI-powered analysis to improve your credit score. 100% private and secure."
        />
      </Helmet> */}

      {/* Header */}
      <header className="bg-[#0A1F44] text-white w-full">
        <nav className="flex items-center justify-between px-4 py-4 max-w-6xl mx-auto">
          <div className="text-xl font-bold">StartupName</div>
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
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-full max-w-7xl bg-white rounded-2xl lg:p-12 p-6 shadow-md">
            {/* Language Selector */}
            <div className="relative">
              <select className="mb-4 px-3 py-2 border rounded-md text-sm absolute right-0 top-0 focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option>English</option>
              </select>
            </div>

            {/* Hero Section */}
            <div className="text-center mt-10 sm:mt-16">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Understand & Improve Your Credit Report – Instantly
              </h1>
              <p className="mb-6 text-lg sm:text-xl text-gray-700">
                Upload your credit report. Get step-by-step guidance to boost your score.
              </p>
              <Link to="/analyzer">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Analysis
                </button>
              </Link>

              {/* Feature List */}
              <ul className="text-left mt-8 mx-auto max-w-2xl space-y-3 text-gray-700 text-base">
                {[
                  "We do not store your credit report. All data is deleted after analysis.",
                  "Automatic analysis, no human viewing",
                  "Used by thousands to improve their credit fast",
                ].map((text, i) => (
                  <li className="flex items-start" key={i}>
                    <svg
                      className="w-6 h-6 mr-2 flex-shrink-0"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 11.5L10.5 16.5L19.5 7.6"
                        stroke="#00723f"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3 Steps */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
                Get Started in 3 Easy Steps
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Step 1: Download Report",
                    desc: "Visit Equifax.ca and download your free credit report with a score as PDF.",
                    icon: "/assets/find.svg",
                  },
                  {
                    title: "Step 2: Upload & Analyze",
                    desc: "Upload your report. We'll securely scan it and provide a preview of your credit score analysis.",
                    icon: "/assets/upload.svg",
                  },
                  {
                    title: "Step 3: Pay & Receive Report",
                    desc: "Purchase to receive your full improvement plan, personalized letters, and AI assistant support.",
                    icon: "/assets/pay.svg",
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 shadow-sm rounded-lg text-center"
                  >
                    <div className="mb-3 flex justify-center">
                      <img
                        src={step.icon}
                        alt={step.title}
                        height="80"
                        width="80"
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-base mb-1">{step.title}</h3>
                    <p className="text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>

              <p className="text-center mt-6 text-base text-gray-700">
                All reports are automatically deleted after analysis. 100% private and secure.
              </p>
              <div className="text-center mt-6">
                <Link to="/analyzer">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    ➜ Start Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
                What People Are Saying
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 shadow-sm rounded-lg">
                  <p className="italic text-gray-700">
                    “I uploaded my Equifax report and got a breakdown of exactly what to fix. Super easy to use.”
                  </p>
                  <p className="text-sm mt-2 text-gray-500">– Amandeep S., Brampton, ON</p>
                </div>
                <div className="p-4 border border-gray-200 shadow-sm rounded-lg">
                  <p className="italic text-gray-700">
                    “The pay-to-delete letter helped me remove an old Rogers collection. Score jumped 48 points!”
                  </p>
                  <p className="text-sm mt-2 text-gray-500">– Melissa T., Vancouver, BC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <p className="mb-4 text-sm">
            &copy; {new Date().getFullYear()} StartupName. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((label, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-400 hover:text-white"
                aria-label={label}
              >
                {/* Icons skipped for brevity - you can re-add them as needed */}
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Test;
