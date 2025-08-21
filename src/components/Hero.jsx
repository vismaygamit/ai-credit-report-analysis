import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();
  const [score, setScore] = useState(650);
  useEffect(() => {
    let start = 650;
    const end = 800;
    const duration = 2000; // 2 seconds
    const stepTime = 20; // update every 20ms
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setScore(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container rounded-2xl py-4 sm:py-6 max-w-[95%] sm:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <div className="text-left grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8 animate-in fade-in duration-1000 lg:text-left sm:text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {t("homePage.heading")}
            <br className="hidden sm:block" />
            {t("homePage.heading2")}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700">
            {t("homePage.subheading")}
          </p>
          <Link
            to="/analyzer"
            aria-label={t("homePage.cta")}
            className="ctabutton"
          >
            <button className="bg-green-600 text-white sm:text-center px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              {t("homePage.cta")}
            </button>
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg duration-1000">
            <div className="relative">
              <img
                className="object-cover object-center w-full rounded-xl"
                src="/laptop.png"
                alt={t("homePage.laptopAlt")}
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="laptop-card grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/90 rounded-xl sm:p-6 mb-9 mr-2 lg:p-4 lg:mb-10 lg:mr-2 md:mb-10 md:mr-2 sm:mb-10 sm:mr-2 w-[70%] max-w-[80%] sm:max-w-[100%]">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="semicircle-container w-[65%] sm:w-[70%] lg:w-[85%] aspect-[2/0.8] sm:aspect-[2/1.2] lg:aspect-[2/1.2] h-[4rem] sm:h-[7rem] lg:h-[8rem] relative">
                      <svg
                        className="creditsvg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 160 80"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <path
                          d="M 20 80 A 60 60 0 0 1 60 20"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="24"
                          strokeLinecap="butt"
                        />
                        <path
                          d="M 60 20 A 60 60 0 0 1 100 20"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="24"
                          strokeLinecap="butt"
                        />
                        <path
                          d="M 100 20 A 60 60 0 0 1 140 80"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="24"
                          strokeLinecap="butt"
                        />
                        <text
                          x="50%"
                          y="75%"
                          textAnchor="middle"
                          className="text-base sm:text-2xl lg:text-2xl font-bold text-gray-800"
                        >
                          {score}
                        </text>
                      </svg>
                    </div>
                  </div>
                  <div className="fetaure-parent flex flex-col items-start space-y-1 sm:space-y-2 sm:text-center">
                    <h2 className="text-xs lg:text-base font-bold text-gray-800">
                      {t("homePage.creditScore")}
                    </h2>
                    <ul className="space-y-1">
                      <li className="features flex items-center space-x-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span className="text-[0.65rem] sm:text-sm text-gray-600 text-left">
                          {t("homePage.disputeInaccuracies")}
                        </span>
                      </li>
                      <li className="features flex items-center space-x-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span className="text-[0.65rem] sm:text-sm text-gray-600">
                          {t("homePage.increaseLimits")}
                        </span>
                      </li>
                      <li className="features flex items-center space-x-1">
                        <svg
                          className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span className="text-[0.65rem] sm:text-sm text-gray-600">
                          {t("homePage.payDownDebt")}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
