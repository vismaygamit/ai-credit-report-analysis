import { useTranslation } from "react-i18next";

const Privacypolicy = () => {
  const { t } = useTranslation();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-CA", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };
  // Function to render text with bold formatting
  const renderTextWithBold = (text) => {
    if (!text) return text;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Get translation arrays safely
  const getTranslationArray = (key) => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result : [];
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl text-center font-bold mb-6">
        {t("privacyPage.title")}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t("privacyPage.effectiveDate")}
        {formatDate("2025-06-19")}
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        {/* About Scorewise */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.aboutScorewise.title")}
          </h2>
          <p>
            {renderTextWithBold(
              t("privacyPage.sections.aboutScorewise.content")
            )}
          </p>
        </div>

        {/* How the Service Works */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.howServiceWorks.title")}
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {getTranslationArray(
              "privacyPage.sections.howServiceWorks.steps"
            ).map((step, index) => (
              <li key={index}>{renderTextWithBold(step)}</li>
            ))}
          </ol>
        </div>

        {/* Information We Collect */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.informationWeCollect.title")}
          </h2>
          <p className="mb-4">
            {t("privacyPage.sections.informationWeCollect.intro")}
          </p>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Required:</h3>
            <ul className="list-disc list-inside ml-4">
              {getTranslationArray(
                "privacyPage.sections.informationWeCollect.required"
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">
              Temporary (auto-deleted after processing):
            </h3>
            <ul className="list-disc list-inside ml-4">
              {getTranslationArray(
                "privacyPage.sections.informationWeCollect.temporary"
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">We do not store:</h3>
            <ul className="list-disc list-inside ml-4">
              {getTranslationArray(
                "privacyPage.sections.informationWeCollect.notStored"
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.howWeUseInformation.title")}
          </h2>
          <p className="mb-4">
            {t("privacyPage.sections.howWeUseInformation.intro")}
          </p>
          <ul className="list-disc list-inside mb-4">
            {getTranslationArray(
              "privacyPage.sections.howWeUseInformation.items"
            ).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="font-semibold">
            {renderTextWithBold(
              t("privacyPage.sections.howWeUseInformation.note")
            )}
          </p>
        </div>

        {/* Security Practices */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.securityPractices.title")}
          </h2>
          <ul className="list-disc list-inside">
            {getTranslationArray(
              "privacyPage.sections.securityPractices.items"
            ).map((item, index) => (
              <li key={index}>{renderTextWithBold(item)}</li>
            ))}
          </ul>
        </div>

        {/* Payments & Refunds */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.paymentsRefunds.title")}
          </h2>
          <ul className="list-disc list-inside">
            {getTranslationArray(
              "privacyPage.sections.paymentsRefunds.items"
            ).map((item, index) => (
              <li key={index}>{renderTextWithBold(item)}</li>
            ))}
          </ul>
        </div>

        {/* Your Rights */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.rights.title")}
          </h2>
          <p className="mb-4">
            {renderTextWithBold(t("privacyPage.sections.rights.intro"))}
          </p>
          <ul className="list-disc list-inside">
            {getTranslationArray("privacyPage.sections.rights.items").map(
              (item, index) => (
                <li key={index}>{renderTextWithBold(item)}</li>
              )
            )}
          </ul>
        </div>

        {/* Disclaimers */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.disclaimers.title")}
          </h2>
          <ul className="list-disc list-inside">
            {getTranslationArray("privacyPage.sections.disclaimers.items").map(
              (item, index) => (
                <li key={index}>{renderTextWithBold(item)}</li>
              )
            )}
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.limitationLiability.title")}
          </h2>
          <p className="mb-4">
            {t("privacyPage.sections.limitationLiability.intro")}
          </p>
          <ul className="list-disc list-inside">
            {getTranslationArray(
              "privacyPage.sections.limitationLiability.items"
            ).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Governing Law */}
        <div>
          <h2 className="text-xl font-semibold mt-8 mb-4">
            {t("privacyPage.sections.governingLaw.title")}
          </h2>
          <p>
            {renderTextWithBold(t("privacyPage.sections.governingLaw.content"))}
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Contact:{" "}
            <a
              href="mailto:contact@scorewise.ca"
              className="text-blue-600 hover:underline"
            >
              contact@scorewise.ca
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacypolicy;
