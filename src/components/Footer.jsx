import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        {/* Updated Image Section */}
        <div className="mb-4 flex flex-wrap justify-center items-center gap-4">
          <img
            src="/satisfaction.png"
            alt="Badge 1"
            className="h-12 w-auto object-contain"
          />
          <img
            src="/secure.png"
            alt="Badge 2"
            className="h-12 w-auto object-contain"
          />
          <img
            src="/lock.png"
            alt="Badge 3"
            className="rounded-2xl h-12 w-auto object-contain"
          />
          <img
            src="/payment method.jpg"
            alt="Badge 4"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="flex justify-center space-x-4">
          {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((label, i) => (
            <a
              key={i}
              href="#"
              className="text-gray-400 hover:text-white"
              aria-label={label}
            >
              <span>{label}</span>
            </a>
          ))}
        </div>
        <p className="mb-4 text-sm">
          © {new Date().getFullYear()} Scorewise {t("footer.copyright")}.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
