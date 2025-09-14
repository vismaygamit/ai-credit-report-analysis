import React from "react";
import { CheckCircle, Lock, AlertTriangle, RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCreditScoreColor } from "../util/analyzHelper";

const TestReport = ({ result, onUnlock, handleReset }) => {
  console.log("result", result);
  
  const { t } = useTranslation();

  const analyzePageItems = [
    t("analyzePage.creditSummary"),
    t("analyzePage.structuredData"),
    t("analyzePage.inquiryRecords"),
    t("analyzePage.creditEvaluation"),
    t("analyzePage.scoreForecast"),
    t("analyzePage.aiActionPlan"),
    `${t("analyzePage.dispute")} & ${t("analyzePage.removal")} ${t(
      "analyzePage.toolkit"
    )}`,
    t("analyzePage.scoreProgressTracker"),
    t("analyzePage.aiReminderEngine"),
    t("analyzePage.aiReminderEngine"), // duplicate
  ];

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {t("analyzePage.analysisPreview")}
      </h2>

      {/* Credit Score Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Current Credit Score */}
        <div className={`${getCreditScoreColor(result?.score)} rounded-lg p-6`}>
          <h3 className="text-gray-600 text-sm mb-2">
            {t("homePage.creditScore")}
          </h3>
          <div className="text-4xl font-bold mb-2">
            {result?.score}{" "}
            {result?.rating?.toLowerCase() == "fair"
              ? t("analyzePage.fair")
              : result?.rating?.toLowerCase() == "good"
              ? t("analyzePage.good")
              : result?.rating?.toLowerCase() == "very good"
              ? t("analyzePage.veryGood")
              : t("analyzePage.excellent")}
          </div>
        </div>

        {/* Improvement Potential */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-gray-600 text-sm mb-2">
            {t("analyzePage.improvementPotential")}
          </h3>
          <div className="text-4xl font-bold text-green-600 mb-2">
            +{result?.improvementPotential} {t("analyzePage.points")}
          </div>
          <p className="text-gray-500 text-sm">
            {t("analyzePage.estimatedIncrease")}
          </p>
        </div>
      </div>

      {/* Key Areas for Improvement */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("analyzePage.areasForImprovements")}
        </h3>
        <div className="space-y-4">
          {result?.keyAreasForImprovement?.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3" />
              <p className="text-gray-700 text-sm">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Analysis Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("analyzePage.completeAnalysis")}
            </h3>
            <p className="text-gray-600 text-sm">
              {t("analyzePage.unlockStrategies")}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-800">$25 CAD</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {analyzePageItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800">{item}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onUnlock}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200"
          >
            <Lock className="w-4 h-4" />
            <span>{t("analyzePage.unlockButton")}</span>
          </button>

          <button className="w-full bg-white hover:bg-gray-50 text-green-600 border border-green-300 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200" onClick={handleReset}>
            <RefreshCcw className="w-4 h-4" />
            <span>{t("analyzePage.resetButton")}</span>
          </button>

          {/* <button
            className={`px-6 py-3 rounded-lg cursor-pointer transition font-medium 
                          bg-green-600 hover:bg-green-700 text-white"
                      }`}
            onClick={handleReset}
          >
            {t("analyzePage.resetButton")}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default TestReport;
