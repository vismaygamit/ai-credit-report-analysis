import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowDownCircle,
  AlertCircle,
  CircleCheck,
  CircleArrowUp,
} from "lucide-react";

const Home = () => {
  const { t } = useTranslation();
  const features = t("homePage.features", { returnObjects: true });
  const steps = [];
  for (let i = 1; i <= 3; i++) {
    steps.push({
      title: t(`homePage.step${i}.title`, { returnObjects: true }),
      desc: t(`homePage.step${i}.desc`, { returnObjects: true }),
      icon:
        i === 1 ? (
          <ArrowDownCircle className="w-15 h-15 text-white fill-blue-500 mx-auto" />
        ) : i === 2 ? (
          <CircleArrowUp className="w-15 h-15 text-white fill-green-500 mx-auto" />
        ) : (
          <AlertCircle className="w-15 h-15 text-white fill-yellow-500 mx-auto" />
        ),
    });
  }

  const handleChat = () => {
    window.handleChat();
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 lg:py-12">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((text, i) => (
            <div className="flex items-center space-x-3" key={i}>
              <CircleCheck className="text-white w-6 h-6 sm:w-8 sm:h-8 fill-green-600 flex-shrink-0" />
              <p className="text-base sm:text-lg font-semibold text-gray-900">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white py-6 sm:py-8 lg:py-12">
        {/* 3 Steps */}
        <div id="how" className="mt-4 sm:mt-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 mb-6 sm:mb-8">
            {t("homePage.stepsTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {steps.map((step, index) =>
              index === 0 ? (
                <a
                  key={index}
                  href="https://my.equifax.ca/consumer-registration/?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="p-4 sm:p-6 border border-gray-200 shadow-sm rounded-lg text-center transition-transform hover:scale-105">
                    <div className="mb-3 flex justify-center">{step.icon}</div>
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-700">
                      {step.desc}
                    </p>
                  </div>
                </a>
              ) : (
                <div
                  key={index}
                  className="p-4 sm:p-6 border border-gray-200 shadow-sm rounded-lg text-center transition-transform hover:scale-105"
                >
                  <div className="mb-3 flex justify-center">{step.icon}</div>
                  <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-700">
                    {step.desc}
                  </p>
                </div>
              )
            )}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/analyzer">
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-700 transition">
                {t("homePage.secondCTA")}
              </button>
            </Link>
          </div>
        </div>

        <section id="review" className="py-8 sm:py-12 lg:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
            {t("homePage.testimonialsTitle")}
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
            <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
              <p className="italic text-gray-700 text-sm sm:text-base">
                "The recommendations gave me a clear plan to increase my score.
                It improved by{" "}
                <span className="font-bold text-green-600">72</span>."
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <img
                  src="/lock.png"
                  alt="Client"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  Alex R., Toronto, ON
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-md">
              <p className="italic text-gray-700 text-sm sm:text-base">
                "The personalized plan helped me remove errors from my report
                and boosted my score{" "}
                <span className="font-bold text-green-600">68</span> points."
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <img
                  src="/lock.png"
                  alt="Client"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  Melissa T., Vancouver, BC
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full bg-white rounded-xl shadow p-4 space-y-4 sm:space-y-0">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.61 0-3.115-.38-4.418-1.053L3 20l1.053-4.418C3.38 14.115 3 12.61 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {t("homePage.chatWithAssistant")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("homePage.fullPrompt")}
              </p>
            </div>
          </div>

          <div className="sm:self-center">
            <button
              style={{
                background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              }}
              className="w-full sm:w-auto px-6 py-2 text-white bg-red-500 rounded-full shadow hover:bg-red-600"
              onClick={handleChat}
            >
              {t("homePage.ask")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
