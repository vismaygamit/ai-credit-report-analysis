import { useTranslation } from "react-i18next";

const Privacypolicy = () => {
  const { t } = useTranslation();
  const whatWeCollect = t("privacyPage.sections.whatWeCollect.items", {
    returnObjects: true,
  });
  const howWeUse = t("privacyPage.sections.howWeUse.items", {
    returnObjects: true,
  });


  const security = t("privacyPage.sections.security.items", {
    returnObjects: true,
  });

  const compliance = t("privacyPage.sections.compliance.items", {
    returnObjects: true,
  });

  const rights = t("privacyPage.sections.rights.items", {
    returnObjects: true,
  });
  return (
    <div className="px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl text-center font-bold mb-6">
        {t("privacyPage.title")}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {t("privacyPage.effectiveDate")}
      </p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>{t("privacyPage.intro")}</p>

        <h2 className="text-xl font-semibold mt-8">
          {t("privacyPage.sections.whoWeAre.title")}
        </h2>
        <p>{t("privacyPage.sections.whoWeAre.content")}</p>

        <h2 className="text-xl font-semibold mt-8">
          {t("privacyPage.sections.whatWeCollect.title")}
        </h2>
        <ul className="list-disc list-inside">
          {whatWeCollect.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </ul>
        <p>{t("privacyPage.sections.whatWeCollect.note")}</p>

        <h2 className="text-xl font-semibold mt-8">
          {t("privacyPage.sections.howWeUse.title")}
        </h2>
        <p>{t("privacyPage.sections.howWeUse.intro")}</p>
        <ul className="list-disc list-inside">
          {howWeUse.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-8">
          {t("privacyPage.sections.retention.title")}
        </h2>
        <p>{t("privacyPage.sections.retention.content")}</p>

        <h2 className="text-xl font-semibold mt-8">
          {t("privacyPage.sections.security.title")}
        </h2>
        <ul className="list-disc list-inside">
          {security.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-8">{t("privacyPage.sections.compliance.title")}</h2>
        <p>{t("privacyPage.sections.compliance.intro")}</p>
        <ul className="list-disc list-inside">
          {compliance.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </ul>
        <p>{t("privacyPage.sections.compliance.note")}</p>

        <h2 className="text-xl font-semibold mt-8">{t("privacyPage.sections.languages.title")}</h2>
        <p>
          {t("privacyPage.sections.languages.content")}
        </p>

        <h2 className="text-xl font-semibold mt-8">{t("privacyPage.sections.rights.title")}</h2>
        <p>{t("privacyPage.sections.rights.intro")}</p>
        <ul className="list-disc list-inside">
          {rights.map((items, index) => (
            <li key={index}>{items}</li>
          ))}
        </ul>
        <p>
         {t("privacyPage.sections.rights.contact")}
        </p>

        <h2 className="text-xl font-semibold mt-8">{t("privacyPage.sections.updates.title")}</h2>
        <p>
         {t("privacyPage.sections.updates.content")}
        </p>
      </section>
    </div>
  );
};

export default Privacypolicy;
