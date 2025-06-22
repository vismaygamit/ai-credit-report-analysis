import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Analyzer = () => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState({});
  const [isReport, setIsReport] = useState(false);
  const [creditData, setcreditData] = useState({});
  const fileInputRef = useRef(null);
  const location = useLocation();
  const referrer = location.state?.from;
  const { isSignedIn, user } = useUser();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    if (!file) return;
    if (file) {
      if (isFilePDF(file)) {
        setPdfFile(file);
        setFileName(file.name);
        showThumbail(file);
      }
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files && e.target.files?.[0];
    if (!file) return;
    if (file) {
      if (isFilePDF(file)) {
        setPdfFile(file);
        setFileName(file.name);
        showThumbail(file);
      }
    }
  };

  const showThumbail = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      const pdf = await pdfjsLib.getDocument(typedArray).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 0.3 }); // Thumbnail scale
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      setThumbnail(canvas.toDataURL("image/png"));
    };
    fileReader.readAsArrayBuffer(file);
  };

  const isFilePDF = (file) => {
    const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
    if (file.type !== "application/pdf" || file.size > maxSizeInBytes) {
      toast.error("Please upload a valid PDF file.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleReset = () => {
    setFileName("");
    setThumbnail(null);
    setIsReport(false);
    setLoading(false);
  };

  const onUnlock = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/checkout`,
        JSON.stringify({ userId: user?.id }),
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setLoading(false);
        window.location.href = response.data.url;
        return;
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error("Invalid data1");
        return;
      }
      console.log("Error during payment process:", error);

      toast.error("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const onAnalyze = async () => {
    if (!pdfFile) {
      toast.error("No file selected.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("userId", user?.id);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data?.result) {
        setResult(response.data);
      } else {
        toast.error("1Something went wrong. Please try again later!");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Credit report is empty or invalid file.");
        return;
      }
      toast.error("Something went wrong. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const getReport = async (userId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/report/${userId}`
      );
      if (response.data.count === 0) {
        setIsReport(false);
        // toast.info("No previous report found.");
      } else {
        setResult(response.data);
        setIsReport(true);
      }
    } catch (error) {
      setIsReport(false);
      toast.error("Failed to fetch report. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      referrer === "paymentSuccess" ? handleReset() : getReport(user.id);
    }
  }, []);

  const sections = useMemo(() => {
    if (result.count > 0) {
      setIsReport(true);
      if (result.ispro) {
        setcreditData(result.result);
      } else {
        return [
          {
            title: "📊 Credit Score",
            items: result.result.credit_score || [],
            color: "text-blue-700",
          },
          {
            title: "⚠️ Main Concerns",
            items: result.result.main_concerns || [],
            color: "text-red-600",
          },
          {
            title: "📂 Types of Accounts",
            items: result.result.types_of_accounts || [],
            color: "text-gray-700",
          },
        ];
      }
    }
  }, [result]);

  return (
    <div
      className={`px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 mx-auto max-w-7xl w-full`}>
      {!loading && (
        <>
          {!fileName && !isReport && !thumbnail && (
            <>
              <div
                className={`w-full max-w-3xl mx-auto border-2 border-dashed rounded-2xl text-center transition ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } p-6 sm:p-10`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="hidden"
                  id="fileUploadInput"
                  ref={fileInputRef}
                />
                <label
                  htmlFor="fileUploadInput"
                  className="cursor-pointer block my-8 sm:my-12 md:my-10"
                >
                  <div className="mb-4 flex justify-center">
                    <img
                      src="/assets/pdf.svg"
                      height="80"
                      width="80"
                      className="object-contain"
                      alt="Upload PDF"
                    />
                  </div>
                  <p className="text-xl sm:text-2xl">
                    {t("analyzePage.dragDrop")} <br /> {t("analyzePage.or")}{" "}
                    <br />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer bg-blue-600 fileUploadInput text-white px-6 py-3 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      {t("analyzePage.chooseFile")}
                    </button>
                  </p>
                </label>
              </div>
              <p className="w-full max-w-3xl mx-auto text-left transition text-xs sm:text-sm mt-3">
                {t("analyzePage.acceptedFile")}
                <br />
                {t("analyzePage.privacyNote")}
              </p>
            </>
          )}

          {(thumbnail || isReport) && (
            <div className={`mb-6 w-full ${loading ? "opacity-20" : ""}`}>
              {!isReport && (
                <>
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">
                    {t("analyzePage.preview")}
                  </h2>
                  <div className="w-full max-w-xs mx-auto">
                    <img
                      src={thumbnail}
                      alt="PDF thumbnail"
                      className="w-full h-auto border rounded-lg shadow-md object-contain"
                    />
                  </div>
                  {fileName && (
                    <p className="mt-2 text-sm text-gray-600 text-center">
                      {fileName}
                    </p>
                  )}
                  <div className="mt-6 mb-5 flex justify-center gap-4 flex-wrap">
                    <button
                      className={`px-6 py-3 cursor-pointer rounded-lg transition font-medium ${
                        loading
                          ? "bg-blue-300 cursor-not-allowed text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      disabled={loading}
                      onClick={onAnalyze}
                    >
                      {t("analyzePage.analyzeButton")}
                    </button>
                    <button
                      className={`px-6 py-3 rounded-lg cursor-pointer transition font-medium ${
                        fileName.length === 0
                          ? "bg-green-300 cursor-not-allowed text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      // disabled={fileName.length === 0}
                      onClick={handleReset}
                    >
                      {t("analyzePage.resetButton")}
                    </button>
                  </div>
                </>
              )}
              {result.count > 0 && (
                <>
                  <div className="max-w-full md:max-w-7xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br from-teal-400 to-indigo-600 text-black">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white text-center mb-3 sm:mb-4">
                        {result.ispro
                          ? t("analyzePage.proTitle")
                          : t("analyzePage.planTitle")}
                      </h2>
                      {result.ispro === true &&
                        Object.keys(creditData).length > 0 && (
                          <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
                          >
                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Credit Scores
                              </h2>
                              {creditData?.credit_scores ? (
                                <ResponsiveContainer width="100%" height={200}>
                                  <BarChart
                                    data={Object.entries(
                                      creditData?.credit_scores || {}
                                    ).map(([label, value]) => ({
                                      label,
                                      value,
                                    }))}
                                  >
                                    <XAxis dataKey="label" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                      dataKey="value"
                                      fill="#3b82f6"
                                      radius={[6, 6, 0, 0]}
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              ) : (
                                <p className="text-center">{t("emptyData")}</p>
                              )}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Income & Employment
                              </h2>
                              <div className="space-y-1 text-sm ">
                                {creditData.income_employment ? (
                                  Object.entries(
                                    creditData?.income_employment
                                  ).map(([k, v]) => (
                                    <p key={k}>
                                      <strong className="capitalize">
                                        {k.replace(/_/g, " ")}:
                                      </strong>{" "}
                                      {v != null ? v.toString() : "-"}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-center">
                                    {t("emptyData")}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="bg-white border-gray-200 transition-shadow duration-300 hover:shadow-md border rounded-2xl shadow p-4 md:col-span-2">
                              <h2 className="text-lg font-semibold mb-4">
                                Liabilities Summary
                              </h2>

                              <div className="overflow-x-auto">
                                <table className="w-full text-sm border-t min-w-[600px]">
                                  <thead>
                                    <tr className="text-left border-b">
                                      <th className="py-2">Type</th>
                                      <th>Balance</th>
                                      <th>Credit Limit</th>
                                      <th>High Credit</th>
                                      <th>Scheduled Payment</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {creditData.liabilities_summary ? (
                                      Object.entries(
                                        creditData.liabilities_summary
                                      ).map(([type, details]) => (
                                        <tr key={type} className="border-b">
                                          <td className="capitalize py-2">
                                            {type}
                                          </td>
                                          <td>
                                            {details?.balance
                                              ? `$${details.balance}`
                                              : "-"}
                                          </td>
                                          <td>
                                            {details?.credit_limit
                                              ? `$${details.credit_limit}`
                                              : "-"}
                                          </td>
                                          <td>
                                            {details?.high_credit
                                              ? `$${details.high_credit}`
                                              : "-"}
                                          </td>
                                          <td>
                                            {details?.scheduled_payment
                                              ? `$${details.scheduled_payment}`
                                              : "-"}
                                          </td>
                                        </tr>
                                      ))
                                    ) : (
                                      <tr className="text-center">
                                        <td colSpan={5}>{t("emptyData")}</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="bg-white border-gray-200 transition-shadow duration-300 hover:shadow-md border rounded-2xl shadow p-4">
                              <h2 className="text-lg font-semibold mb-4">
                                Risk Ratios
                              </h2>
                              {creditData.ratios ? (
                                <>
                                  <p className="text-sm">
                                    <strong>DTI Ratio:</strong>{" "}
                                    {creditData.ratios &&
                                    creditData.ratios.dti_ratio != null
                                      ? creditData.ratios.dti_ratio + "%"
                                      : "-"}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Revolving Utilization:</strong>{" "}
                                    {creditData.ratios &&
                                    creditData.ratios
                                      .revolving_utilization_ratio != null
                                      ? creditData.ratios
                                          .revolving_utilization_ratio + "%"
                                      : "-"}
                                  </p>
                                </>
                              ) : (
                                <p className="text-center">{t("emptyData")}</p>
                              )}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Credit History
                              </h2>
                              <div className="space-y-1 text-sm">
                                {creditData?.credit_history_summary ? (
                                  Object.entries(
                                    creditData.credit_history_summary
                                  ).map(([k, v]) => (
                                    <p key={k}>
                                      <strong className="capitalize">
                                        {k.replace(/_/g, " ")}:
                                      </strong>{" "}
                                      {v != null ? v.toString() : "-"}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-center">
                                    {t("emptyData")}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Inquiries
                              </h2>
                              {creditData.inquiries_summary ? (
                                <>
                                  <p className="text-sm">
                                    <strong>Count:</strong>{" "}
                                    {creditData.inquiries_summary &&
                                    creditData.inquiries_summary
                                      .recent_inquiries != null
                                      ? creditData.inquiries_summary
                                          .recent_inquiries
                                      : "-"}
                                  </p>
                                  <p className="text-sm">
                                    <strong>Sources:</strong>{" "}
                                    {creditData.inquiries_summary &&
                                    Array.isArray(
                                      creditData.inquiries_summary.sources
                                    )
                                      ? creditData.inquiries_summary.sources.join(
                                          ", "
                                        )
                                      : "-"}
                                  </p>
                                </>
                              ) : (
                                <p className="text-center">{t("emptyData")}</p>
                              )}
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Red Flags
                              </h2>
                              <ul className="list-disc ml-6 text-sm space-y-1">
                                {creditData.red_flags?.length > 0 ? (
                                  creditData.red_flags.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))
                                ) : (
                                  <p className="text-center">
                                    {t("emptyData")}
                                  </p>
                                )}
                              </ul>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Positive Indicators
                              </h2>
                              <ul className="list-disc ml-6 text-sm space-y-1">
                                {creditData.positive_indicators?.length > 0 ? (
                                  creditData.positive_indicators.map(
                                    (item, i) => <li key={i}>{item}</li>
                                  )
                                ) : (
                                  <p className="text-center">
                                    {t("emptyData")}
                                  </p>
                                )}
                              </ul>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                DataX Derogatory Info
                              </h2>
                              <p className="text-sm">
                                <strong>Returned Payments:</strong>{" "}
                                {creditData.datx_derogatory_info &&
                                creditData.datx_derogatory_info
                                  .returned_payments != null
                                  ? creditData.datx_derogatory_info
                                      .returned_payments
                                  : "-"}
                              </p>
                              <p className="text-sm">
                                <strong>Subprime Lenders:</strong>{" "}
                                {Array.isArray(
                                  creditData.datx_derogatory_info
                                    .subprime_lenders
                                )
                                  ? creditData.datx_derogatory_info.subprime_lenders.join(
                                      ", "
                                    )
                                  : "-"}
                              </p>
                              <p className="text-sm">
                                <strong>Notes:</strong>{" "}
                                {creditData.datx_derogatory_info &&
                                creditData.datx_derogatory_info.notes
                                  ? creditData.datx_derogatory_info.notes
                                  : "-"}
                              </p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Recommendations
                              </h2>
                              <div className="text-sm space-y-2">
                                <div>
                                  <strong>For Underwriters:</strong>
                                  <ul className="list-disc ml-6">
                                    {creditData.recommendations &&
                                    creditData.recommendations?.for_borrower
                                      ?.length > 0 &&
                                    Array.isArray(
                                      creditData.recommendations
                                        .for_underwriters
                                    ) ? (
                                      creditData.recommendations.for_underwriters.map(
                                        (rec, i) => <li key={i}>{rec}</li>
                                      )
                                    ) : (
                                      <p className="text-center">
                                        {t("emptyData")}
                                      </p>
                                    )}
                                  </ul>
                                </div>
                                <div>
                                  <strong>For Borrower:</strong>
                                  <ul className="list-disc ml-6">
                                    {creditData.recommendations &&
                                    creditData.recommendations?.for_borrower
                                      ?.length > 0 &&
                                    Array.isArray(
                                      creditData.recommendations.for_borrower
                                    ) ? (
                                      creditData.recommendations.for_borrower.map(
                                        (rec, i) => <li key={i}>{rec}</li>
                                      )
                                    ) : (
                                      <p className="text-center">
                                        {t("emptyData")}
                                      </p>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 transition-shadow duration-300 hover:shadow-md">
                              <h2 className="text-lg font-semibold mb-4">
                                Final Risk Assessment
                              </h2>
                              <div className="grid text-sm">
                                {creditData.final_assessment ? (
                                  Object.entries(
                                    creditData.final_assessment
                                  ).map(([k, v]) => (
                                    <p key={k}>
                                      <strong className="capitalize">
                                        {k.replace(/_/g, " ")}:
                                      </strong>{" "}
                                      {v}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-center">
                                    {t("emptyData")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      {result.ispro === false &&
                        sections.map((section, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-2xl mb-3 shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-300"
                          >
                            <h3
                              className={`text-xl font-semibold mb-3 ${section.color}`}
                            >
                              {section.title}
                            </h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {section.items.map((item, i) => (
                                <li key={i} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                      {result.ispro === false && (
                        <div className="flex justify-center">
                          <button
                            disabled={loading}
                            onClick={onUnlock}
                            className="cursor-pointer px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white font-semibold text-sm sm:text-base"
                          >
                            {t("analyzePage.unlockButton")}
                          </button>
                        </div>
                      )}

                      {result.ispro === false && (
                        <p className="text-xs text-center mt-2 sm:mt-3 opacity-80">
                          {t("analyzePage.processingTime")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      className={`px-6 py-3 mt-2 rounded-lg cursor-pointer transition font-medium ${
                        fileName.length === 0 && !isReport
                          ? "bg-green-300 cursor-not-allowed text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      // disabled={fileName.length === 0}
                      onClick={handleReset}
                    >
                      {t("analyzePage.resetButton")}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {loading && (
        <div
          role="status"
          className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
        >
          <svg
            aria-hidden="true"
            className="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
