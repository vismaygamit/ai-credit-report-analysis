import React, { useState } from "react";
import {
  CheckCircle,
  User,
  FileText,
  Calendar,
  TrendingUp,
  Target,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCreditScoreColor } from "../util/analyzHelper";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PaidReport = ({
  creditData,
  chartRef,
  onUnlock,
  handleReset,
  isReset,
  paymentStatus,
  loading,
  generateActionPlanPDF,
}) => {
  console.log("creditData", creditData);
  console.log("onUnlock", onUnlock);
  console.log("handleReset", handleReset);
  console.log("isReset", isReset);
  console.log("paymentStatus", paymentStatus);
  console.log("loading", loading);

  const { t } = useTranslation();

  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    structured: false,
    inquiry: false,
    evaluation: false,
    forecast: false,
    actionPlan: false,
    disputes: false,
    progress: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const Section = ({ title, children, sectionKey, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 flex items-center justify-between hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </div>
      {expandedSections[sectionKey] && <div className="p-6">{children}</div>}
    </div>
  );

  const ScoreCard = ({ score, label, color }) => (
    <div className={`p-4 rounded-lg border-2 ${color} text-center`}>
      <div className="text-2xl font-bold mb-1">{score}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );

  return (
    <div className="max-w-full md:max-w-7xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-4 sm:p-6 text-black">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t("analyzePage.planTitle")}
              </h1>
            </div>
          </div>
        </div>

        {/* Credit Summary */}
        <Section
          title={t("analyzePage.creditSummary")}
          sectionKey="summary"
          icon={User}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ScoreCard
              score={`${creditData?.summary?.score ?? t("analyzePage.none")}`}
              label={`${t("analyzePage.score")} ${
                creditData?.summary?.rating == "fair"
                  ? t("analyzePage.fair")
                  : creditData?.summary?.rating == "good"
                  ? t("analyzePage.good")
                  : creditData?.summary?.rating == "very good"
                  ? t("analyzePage.veryGood")
                  : t("analyzePage.excellent")
              }`}
              color={getCreditScoreColor(creditData?.summary?.score)}
            />
            <ScoreCard
              score={creditData?.accountsAndBalances?.length}
              label={t("analyzePage.totalAccounts")}
              color="border-blue-200 bg-blue-50"
            />
            <ScoreCard
              score={
                creditData?.summary?.creditAge?.averageAgeYears
                  ? `${creditData.summary.creditAge.averageAgeYears} ${t(
                      "analyzePage.years"
                    )}`
                  : t("analyzePage.none")
              }
              label={t("analyzePage.averageAge")}
              color="border-purple-200 bg-purple-50"
            />

            <ScoreCard
              score={
                creditData?.summary?.creditUtilization?.utilizationRate
                  ? `${creditData.summary.creditUtilization.utilizationRate}%`
                  : t("analyzePage.none")
              }
              label={t("analyzePage.utilizationRate")}
              color="border-orange-200 bg-orange-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.paymentHistory")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.onTimePayments")}
                  </span>
                  <span className="font-medium text-green-600">
                    {creditData?.scoreProgress?.creditSummary
                      ? `${creditData.scoreProgress?.creditSummary?.onTimePayments}`
                      : t("analyzePage.none")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.missedLate24Months")}
                  </span>
                  <span className="font-medium text-red-600">
                    {
                      creditData?.summary?.paymentHistory
                        ?.missedOrLatePast24Months
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.goodStanding")}
                  </span>
                  <span className="font-medium text-green-600">
                    {creditData?.scoreProgress?.creditSummary
                      ? `${creditData.scoreProgress.creditSummary.activeAccounts}`
                      : t("analyzePage.none")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.accountTypes")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.revolving")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.tradelines?.revolving || 0}{" "}
                    {t("analyzePage.accounts")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.installment")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.tradelines?.installment || 0}{" "}
                    {t("analyzePage.accounts")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("analyzePage.open")}</span>
                  <span className="font-medium">
                    {creditData?.summary?.tradelines?.open || 0}{" "}
                    {t("analyzePage.accounts")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.mortgage")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.tradelines?.mortgage || 0}{" "}
                    {t("analyzePage.accounts")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.creditUtilization")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.totalLimit")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.creditUtilization
                      ? `$${creditData.summary.creditUtilization.totalLimit}`
                      : t("analyzePage.none")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.totalBalance")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.creditUtilization
                      ? `$${creditData.summary.creditUtilization.totalBalance}`
                      : t("analyzePage.none")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.creditAge")}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.oldestAccount")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.creditAge
                      ? `${creditData?.summary.creditAge.oldest.account} ${creditData?.summary.creditAge.oldest.opened}`
                      : t("analyzePage.none")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("analyzePage.newestAccount")}
                  </span>
                  <span className="font-medium">
                    {creditData?.summary?.creditAge
                      ? `${creditData?.summary.creditAge.newest.account} ${creditData?.summary.creditAge.newest.opened}`
                      : t("analyzePage.none")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Structured Data Extraction */}
        <Section
          title={t("analyzePage.structuredData")}
          sectionKey="structured"
          icon={FileText}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.lender")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.type")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.openDate")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.limit")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.balance")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.closed")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.pastDue")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("analyzePage.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {creditData?.accountsAndBalances?.length > 0 ? (
                  creditData.accountsAndBalances.map((account, i) => (
                    <tr
                      key={i}
                      className={`border-t hover:bg-slate-50 transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.lender || t("analyzePage.na")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.type
                          ? account.type.charAt(0).toUpperCase() +
                            account.type.slice(1)
                          : t("analyzePage.na")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.openDate &&
                        !isNaN(new Date(account.openDate).getTime())
                          ? new Date(account.openDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {account.limit
                          ? `$${account.limit.toLocaleString()}`
                          : t("analyzePage.na")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.balance
                          ? `$${account.balance.toLocaleString()}`
                          : "$0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`'inline-flex px-2 py-1 text-xs font-semibold rounded-full' ${
                            account.closed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.closed
                            ? t("analyzePage.yes")
                            : t("analyzePage.no")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.pastDue
                          ? `$${account.pastDue.toLocaleString()}`
                          : "$0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {account.status?.toLowerCase() === "open"
                          ? t("analyzePage.open")
                          : account.status?.toLowerCase() === "closed"
                          ? t("analyzePage.closed")
                          : account.status || t("analyzePage.na")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-3 text-sm text-slate-700 text-center"
                    >
                      {t("analyzePage.none")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Inquiry Records */}
        <Section
          title={t("analyzePage.inquiryRecords")}
          sectionKey="inquiry"
          icon={Calendar}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg mb-2 bg-green-200 font-semibold">
                  {t("analyzePage.softInquiries")} (
                  {creditData?.summary?.inquiries?.soft?.length || 0})
                </h4>
                <ul className="text-gray-600 space-y-1">
                  {Array.isArray(creditData?.summary?.inquiries?.soft) &&
                  creditData.summary.inquiries.soft.length > 0 ? (
                    creditData.summary.inquiries.soft.map((inq, i) => (
                      <li key={i} className="text-green-800">
                        • {inq.lender || t("analyzePage.na")}
                        {", "}
                        {inq.date && !isNaN(new Date(inq.date).getTime())
                          ? new Date(inq.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Unknown"}
                      </li>
                    ))
                  ) : (
                    <li>{t("analyzePage.none")}</li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 bg-red-200">
                  {t("analyzePage.hardInquiries")} (
                  {creditData?.summary?.inquiries?.hard?.length || 0})
                </h4>
                <ul className="space-y-1">
                  {Array.isArray(creditData?.summary?.inquiries?.hard) &&
                  creditData.summary.inquiries.hard.length > 0 ? (
                    creditData.summary.inquiries.hard.map((inq, i) => (
                      <li key={i} className="text-red-800">
                        • {inq.lender || t("analyzePage.na")}
                        {", "}
                        {inq.date && !isNaN(new Date(inq.date).getTime())
                          ? new Date(inq.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Unknown"}
                      </li>
                    ))
                  ) : (
                    <li>{t("analyzePage.none")}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Credit Evaluation */}
        <Section
          title={t("analyzePage.creditEvaluation")}
          sectionKey="evaluation"
          icon={TrendingUp}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.strengths")}
              </h3>
              <div className="space-y-3">
                {Array.isArray(creditData?.creditEvaluation?.strengths) &&
                creditData.creditEvaluation.strengths.length > 0 ? (
                  creditData.creditEvaluation.strengths.map((strength, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
                      <span className="text-gray-700">{strength}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start">
                    {/* <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 mr-3" /> */}
                    <span className="text-gray-500">
                      {t("analyzePage.none")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.areasForImprovements")}
              </h3>
              <div className="space-y-3">
                {Array.isArray(
                  creditData?.creditEvaluation?.areaOfImprovements
                ) &&
                creditData.creditEvaluation.areaOfImprovements.length > 0 ? (
                  creditData.creditEvaluation.areaOfImprovements.map(
                    (improvements, i) => (
                      <div key={i} className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3" />
                        <span className="text-gray-700">{improvements}</span>
                      </div>
                    )
                  )
                ) : (
                  <div className="flex items-start">
                    {/* <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 mr-3" /> */}
                    <span className="text-gray-500">
                      {t("analyzePage.none")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Score Forecast Engine */}
        <Section
          title={t("analyzePage.scoreForecast")}
          sectionKey="forecast"
          icon={TrendingUp}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {/* Projected Score Changes */}
            </h3>
            {Array.isArray(creditData?.scoreChanges) &&
            creditData.scoreChanges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creditData.scoreChanges.map((change, i) => (
                  <div
                    key={i}
                    className={`text-center shadow p-6 ${
                      i === 0
                        ? "bg-blue-100"
                        : i === 1
                        ? "bg-green-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <div
                      className={`text-2xl font-bold
          ${
            i === 0
              ? "text-blue-600"
              : i === 1
              ? "text-green-600"
              : "text-purple-600"
          }`}
                    >
                      {change.estimatedImpact}
                    </div>
                    <div className="text-sm text-gray-600">
                      {change.timeline}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                {t("analyzePage.none")}
              </div>
            )}
          </div>
        </Section>

        {/* AI Action Plan Generator */}
        <Section
          title={t("analyzePage.aiActionPlan")}
          sectionKey="actionPlan"
          icon={Target}
        >
          <div className="space-y-6">
            {Array.isArray(creditData?.scoreForecast) &&
              creditData.scoreForecast.map((rec, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 border ${
                    rec.priority?.toLowerCase() === "high"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : rec.priority?.toLowerCase() === "medium" ||
                        rec.priority?.toLowerCase() === "medium-high"
                      ? "bg-blue-50 border-blue-200 text-blue-800"
                      : rec.priority?.toLowerCase() === "critical"
                      ? "bg-red-50 border-red-200 text-red-800"
                      : "bg-yellow-50 border-yellow-200 text-yellow-800"
                  }`}
                >
                  <div className="flex items-start">
                    {rec.priority?.toLowerCase() === "high" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    ) : rec.priority?.toLowerCase() === "medium" ||
                      rec.priority?.toLowerCase() === "medium-high" ? (
                      <Target className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                    )}

                    <div>
                      <h4 className="text-sm font-mediu">
                        {rec.priority?.toLowerCase() === "high"
                          ? t("analyzePage.high")
                          : rec.priority?.toLowerCase() === "medium"
                          ? t("analyzePage.medium")
                          : rec.priority?.toLowerCase() === "medium-high"
                          ? t("analyzePage.mediumHigh")
                          : t("analyzePage.critical")}{" "}
                        {t("analyzePage.priority")}
                      </h4>
                      <p className="text-sm mt-1">{rec.action}</p>
                      <span className="inline-block mt-2 py-1 text-xs rounded">
                        <span className="font-semibold">
                          {t("analyzePage.impact")}:
                        </span>{" "}
                        {rec.estimatedImpact} |{" "}
                        <span className="font-semibold">
                          {t("analyzePage.timeline")}:
                        </span>{" "}
                        {rec.timeline}
                      </span>
                      <div className="mt-1 text-xs">
                        <span className="font-semibold">
                          {t("analyzePage.confidence")}:
                        </span>{" "}
                        {rec.confidence}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Section>

        {/* Dispute & Removal Toolkit */}
        <Section
          title={`${t("analyzePage.dispute")} & ${
            t("analyzePage.removal") + " " + t("analyzePage.toolkit")
          } `}
          sectionKey="disputes"
          icon={FileText}
        >
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-3">
                {t("analyzePage.dispute") + " " + t("analyzePage.letter")}
              </h4>
              <div className="text-sm text-red-700 space-y-2 whitespace-pre-wrap">
                {creditData?.disputeToolkit?.disputeLetter ? (
                  <p>{creditData?.disputeToolkit.disputeLetter}</p>
                ) : (
                  <p>{t("analyzePage.none")}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">
                {t("analyzePage.goodwill") +
                  " " +
                  t("analyzePage.removal") +
                  " " +
                  t("analyzePage.letter")}
              </h4>
              <div className="text-sm text-blue-700 space-y-2 whitespace-pre-line">
                {creditData?.disputeToolkit?.goodwillScript
                  ? //paymentStatus === "paid" && !isReset
                    //   ?
                    creditData.disputeToolkit.goodwillScript
                  : // : t("analyzePage.availableAfterPayment")
                    t("analyzePage.none")}
              </div>
            </div>
          </div>
        </Section>

        {/* Score Progress Tracker */}
        <Section
          title={t("analyzePage.scoreProgressTracker")}
          sectionKey="progress"
          icon={TrendingUp}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.scoreSimulator")}
              </h3>
              <div className="space-y-4">
                {Array.isArray(creditData?.scoreProgress?.scoreSimulator) &&
                  creditData.scoreProgress?.scoreSimulator.map((s, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {s.scenario}
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            s.impactType?.toLowerCase() === "positive"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {s.projectedScoreChange}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {s.description}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("analyzePage.actionChecklist")}
              </h3>
              <div className="space-y-3">
                {creditData?.scoreProgress?.checklist ? (
                  Object.values(creditData.scoreProgress.checklist).map(
                    (item, i) => {
                      const desc = item?.desc ?? t("analyzePage.na");
                      const istrue = item?.istrue ?? false;

                      return (
                        <div key={i} className="flex items-center">
                          {istrue ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                              <span className="text-sm text-gray-700 line-through">
                                {desc}
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500 mr-3" />
                              <span className="text-sm text-gray-700">
                                {desc}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    }
                  )
                ) : (
                  <div className="text-sm text-gray-500">
                    {t("analyzePage.none")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* Progress Projection Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("analyzePage.aiReminderEngine")}
          </h2>
          <div className="text-center">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={
                  creditData?.scoreProgress?.forecastChart?.dataPoints?.map(
                    (point) => ({
                      name: point?.date,
                      [t("analyzePage.score")]: point?.score,
                    })
                  ) || []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[650, 720]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={t("analyzePage.score")}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            ref={chartRef}
            style={{
              width: 1120,
              height: 400,
              position: "absolute",
              top: -9999,
              left: -9999,
              visibility: "hidden",
            }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={
                  creditData?.scoreProgress?.forecastChart?.dataPoints?.map(
                    (point) => ({
                      name: point?.date,
                      [t("analyzePage.score")]: point?.score,
                    })
                  ) || []
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[650, 720]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={t("analyzePage.score")}
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="p-4 overflow-x-auto w-full max-w-full">
            <div>
              <h3 className="text-lg font-semibold">
                {t("analyzePage.aiReminderEngine")}
              </h3>
              <div className="overflow-auto">
                <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                  <thead>
                    <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                      <th className="text-left p-2">
                        {t("analyzePage.event")}
                      </th>
                      <th className="text-left p-2">
                        {t("analyzePage.reminderDate")}
                      </th>
                      <th className="text-left p-2">
                        {t("analyzePage.action")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditData?.reminders?.length > 0 ? (
                      creditData.reminders.map((reminder, i) => (
                        <tr
                          key={i}
                          className={`border-t hover:bg-slate-50 transition-colors ${
                            i % 2 === 0 ? "bg-white" : "bg-slate-50"
                          }`}
                        >
                          <td className="p-2">
                            {reminder.event || t("analyzePage.na")}
                          </td>
                          <td className="p-2">
                            {reminder.reminderDate &&
                            !isNaN(new Date(reminder.reminderDate).getTime())
                              ? new Date(
                                  reminder.reminderDate
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Unknown"}
                          </td>
                          <td className="p-2">
                            {reminder.action || t("analyzePage.na")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="p-3 text-sm text-slate-700 text-center"
                        >
                          {t("analyzePage.none")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          {(isReset || paymentStatus != "paid") && (
            <button
              disabled={loading}
              onClick={onUnlock}
              className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-white font-semibold text-sm sm:text-base ${
                loading
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {t("analyzePage.unlockButton")}
            </button>
          )}
          <button
            disabled={loading}
            onClick={handleReset}
            className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-white font-semibold text-sm sm:text-base ${
              loading
                ? "bg-blue-300 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {t("analyzePage.resetButton")}
          </button>
          {/* {paymentStatus === "paid" && data?.data?.ispro && ( */}
          {paymentStatus === "paid" && (
            <button
              disabled={loading}
              onClick={generateActionPlanPDF}
              className={`cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-white font-semibold text-sm sm:text-base ${
                loading
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {t("analyzePage.downloadActionPlan")}
            </button>
          )}
        </div>

        {/* {!isReport && (
                        <p className="text-xs text-center mt-2 sm:mt-3 opacity-80">
                          {t("analyzePage.processingTime")}
                        </p>
                      )} */}
      </div>
    </div>
  );
};

export default PaidReport;
