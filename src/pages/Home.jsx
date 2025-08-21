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
            {steps.map((step, index) => (
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
            ))}
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
      </div>
    </div>
  );
};

export default Home;
