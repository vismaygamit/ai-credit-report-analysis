import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-6 px-4">
      <div className="container mx-auto text-center">
        <p className="mb-4 text-sm">
          &copy; {new Date().getFullYear()} Scorewise {t("footer.copyright")}.
        </p>
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
      </div>
    </footer>
  );
};

export default Footer;
