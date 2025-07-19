import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const features = t("homePage.features", { returnObjects: true });
  const steps = [];
  for (let i = 1; i <= 3; i++) {
    steps.push({
      title: t(`homePage.step${i}.title`, { returnObjects: true }),
      desc: t(`homePage.step${i}.desc`, { returnObjects: true }),
      icon: `/assets/${i === 1 ? "find" : i === 2 ? "upload" : "pay"}.svg`,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-2xl">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black-900 mb-6">
            {t("homePage.heading")}
          </h1>
          <p className="mb-6 text-lg sm:text-xl text-black-700">
            {t("homePage.subheading")}
          </p>
          <p className="mb-6 text-lg sm:text-xl text-black-700">
            {t("homePage.platformDescription")}
          </p>
          <Link to="/analyzer">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              {t("homePage.cta")}
            </button>
          </Link>

          {/* Feature List */}
          <ul className="text-left mt-8 mx-auto max-w-2xl space-y-3 text-black-700 text-base">
            {features.map((text, i) => (
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
          <h2 className="text-3xl font-semibold text-center text-black-900 mb-8">
            {t("homePage.stepsTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step, index) =>
              index === 0 ? (
                <a
                  key={index}
                  href="https://my.equifax.ca/consumer-registration/?lang=en"
                  target="_blank"
                >
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
                </a>
              ) : (
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
              )
            )}
          </div>

          <p className="text-center mt-6 text-base text-black-700">
            {t("homePage.secureNote")}
          </p>
          <div className="text-center mt-6">
            <Link to="/analyzer">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                ➜ {t("homePage.secondCTA")}
              </button>
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-center text-black-900 mb-6">
            {t("homePage.testimonialsTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 shadow-sm rounded-lg">
              <p className="italic text-black-700">
                {t("homePage.testimonial1")}
              </p>
              <p className="text-sm mt-2 text-black-500">
                {t("homePage.user1")}
              </p>
            </div>
            <div className="p-4 border border-gray-200 shadow-sm rounded-lg">
              <p className="italic text-black-700">
                {t("homePage.testimonial2")}
              </p>
              <p className="text-sm mt-2 text-black-500">
                {t("homePage.user2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
