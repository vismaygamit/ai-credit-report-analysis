import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchReport, getReportByReportId } from "../store/reportSlice";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";
import reshape from "arabic-reshaper";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Analyzer = () => {
  const { t, i18n } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const { openSignIn } = useClerk();
  const [thumbnail, setThumbnail] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isReport, setIsReport] = useState(false);
  const [reportLanguage, setReportLanguage] = useState("en");
  const dispatch = useDispatch();
  const { data, loading, error, statusCode } = useSelector(
    (state) => state.report
  );
  const currentLanguage = i18n.language;
  const [result, setResult] = useState(data?.data);
  const [creditData, setcreditData] = useState({});
  const [isReset, setIsReset] = useState(false);

  const fileInputRef = useRef(null);
  const location = useLocation();
  const referrer = location.state?.from;
  const { isSignedIn, user } = useUser();
  const [paymentStatus, setPaymentStatus] = useState("false");

  const statusColorClass = (status) => {
    const map = {
      Excellent: "text-green-700",
      Strong: "text-emerald-700",
      Good: "text-green-600",
      Moderate: "text-yellow-600",
      "Neutral / Concern": "text-gray-500",
      Short: "text-gray-600",
      "Recent Inquiries": "text-yellow-600",
      Poor: "text-red-600",
      Limited: "text-gray-500",
      "No Data": "text-gray-400",
      "Moderate Risk": "text-yellow-700",
      Positive: "text-green-500",
      Mixed: "text-orange-500",
      "Elevated Activity": "text-orange-600",
      "Good Diversification": "text-blue-600",
    };
    return map[status] || "text-gray-700";
  };

  const scoreCategory =
    creditData?.creditScore < 660
      ? t("analyzePage.fair")
      : creditData?.creditScore < 725
      ? t("analyzePage.good")
      : creditData?.creditScore < 760
      ? t("analyzePage.veryGood")
      : t("analyzePage.excellent");

  const scoreColors = {
    [t("analyzePage.fair")]: "bg-yellow-300",
    [t("analyzePage.good")]: "bg-green-300",
    [t("analyzePage.veryGood")]: "bg-green-400",
    [t("analyzePage.excellent")]: "bg-green-600",
  };

  const generateActionPlanPDF = async () => {
    try {
      let fontUrl, fontBytes, font, doc;
      let actionPlanTranslation, threeMonthActionPlan;

      // if (reportLanguage.startsWith("en")) {
      actionPlanTranslation = "Action Plan";
      threeMonthActionPlan = "3-Month Action Plan";
      // } else if (reportLanguage.startsWith("es")) {
      //   // Spanish
      //   actionPlanTranslation = "Plan de acción";
      //   threeMonthActionPlan = "Plan de acción de 3 meses";
      // } else if (reportLanguage.startsWith("fr")) {
      //   // French
      //   actionPlanTranslation = "Plan d'action";
      //   threeMonthActionPlan = "Plan d'action sur 3 mois";
      // } else if (reportLanguage.startsWith("ru")) {
      //   // Russian
      //   actionPlanTranslation = "План действий";
      //   threeMonthActionPlan = "План действий на 3 месяца";
      // } else if (reportLanguage.startsWith("uk")) {
      //   // Ukrainian
      //   actionPlanTranslation = "План дій";
      //   threeMonthActionPlan = "План дій на 3 місяці";
      // } else if (reportLanguage.startsWith("hi")) {
      //   // Hindi
      //   actionPlanTranslation = "कार्य योजना";
      //   threeMonthActionPlan = "3 महीने की कार्य योजना";
      // } else if (reportLanguage.startsWith("ar")) {
      //   // Arabic (RTL)
      //   actionPlanTranslation = "خطة العمل";
      //   threeMonthActionPlan = "خطة عمل لمدة 3 أشهر";
      // } else {
      //   // Fallback
      //   actionPlanTranslation = "Action Plan";
      //   threeMonthActionPlan = "3-Month Action Plan";
      // }

      // if (
      //   reportLanguage.startsWith("en") ||
      //   reportLanguage.startsWith("es") ||
      //   reportLanguage.startsWith("fr")
      // ) {
      doc = await PDFDocument.create();
      font = await doc.embedFont(StandardFonts.Helvetica);
      // } else if (
      //   reportLanguage.startsWith("ru") ||
      //   reportLanguage.startsWith("uk")
      // ) {
      //   fontUrl = "/fonts/Roboto-Regular.ttf";
      // } else if (reportLanguage.startsWith("hi")) {
      //   fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
      // } else if (reportLanguage.startsWith("ar")) {
      //   fontUrl = "/fonts/Amiri-Regular.ttf";
      // }

      if (fontUrl) {
        fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
        doc = await PDFDocument.create();
        doc.registerFontkit(fontkit);
        font = await doc.embedFont(fontBytes);
      }

      const page = doc.addPage([595, 842]); // A4 size
      // Logo
      const logoBytes = await fetch("/assets/logo.png").then((res) =>
        res.arrayBuffer()
      );
      const logoImage = await doc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.1);
      page.drawImage(logoImage, {
        x: 240,
        y: 790,
        width: logoDims.width,
        height: logoDims.height,
      });

      // Draw helper
      let y = 755;
      const lineHeight = 18;
      const pageWidth = 595;

      const drawText = (text, size = 12, bold = false, align = "left") => {
        if (y < 50) {
          y = 700;
          doc.addPage();
        }

        // let shaped;

        // const shaped = reportLanguage.startsWith("ar")
        //   ? reshape.convertArabic(text)
        //   : text;
        const shaped = text;

        const textWidth = font.widthOfTextAtSize(shaped, size);
        const x = align === "center" ? (pageWidth - textWidth) / 2 : 50;

        page.drawText(shaped, {
          x,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });

        y -= lineHeight;
      };
      // Centered heading: Action Plan
      drawText(t(actionPlanTranslation), 20, true, "center");

      // Underlines
      // page.drawLine({
      //   start: { x: 50, y: 780 },
      //   end: { x: 545, y: 780 },
      //   thickness: 1,
      //   color: rgb(0, 0, 0),
      // });
      // page.drawLine({
      //   start: { x: 50, y: 750 },
      //   end: { x: 545, y: 750 },
      //   thickness: 1,
      //   color: rgb(0, 0, 0),
      // });

      // Centered subtitle
      drawText(t(threeMonthActionPlan), 14, true);
      // Action Plan Content
      creditData?.actionPlan.forEach((month) => {
        drawText(month.month, 12, true);
        month.actions.forEach((action) => {
          drawText(`- ${action}`, 10);
        });
      });

      const pdfBytes = await doc.save();

      // Trigger download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "credit_report_summary.pdf";
      link.click();
    } catch (error) {
      // console.log("error", error);
    }
  };

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

  const handleReset = async () => {
    setFileName("");
    setThumbnail(null);
    setIsReport(false);
    setIsReset(true);
    localStorage.removeItem("creditReport");
  };

  const onUnlock = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const hasCreditData = creditData && Object.keys(creditData).length > 0;
    const reportId = creditData?._id;

    if (!hasCreditData || !reportId) {
      toast.error("Invalid data");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/checkout`,
        JSON.stringify({
          userId: user?.id,
          reportId,
        }),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to process checkout.");
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error("Invalid data");
      } else {
        toast.error("Something went wrong. Please try again later!");
      }
    }
  };

  const onAnalyze = async () => {
    if (!pdfFile) {
      toast.error("No file selected.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("userId", user?.id ? user.id : "");
      formData.append("reportId", data?.result?._id ? data?.result._id : "");
      dispatch(fetchReport(formData));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Credit report is empty or invalid file.");
        return;
      }
      toast.error("Something went wrong. Please try again later!");
    }
  };

  useEffect(() => {
    if (statusCode && statusCode != 200) {
      error && toast.error(error.message);
    }
  }, [statusCode, error]);

  const getReport = async () => {
    try {
      if (isSignedIn) {
        dispatch(getReportByReportId(user.id));
        setIsReport(true);
      }
    } catch (error) {
      setIsReport(false);
      toast.error("Failed to fetch report. Please try again later.");
    }
  };

  useEffect(() => {
    referrer === "paymentSuccess" && getReport();
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      referrer != "paymentSuccess" && getReport();
    }
  }, [isSignedIn]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("creditReport"));

    if (
      ((data?.data && data?.data?.count === 0) ||
        (savedData && Object.keys(savedData).length > 0)) &&
      loading === false
    ) {

      setIsReport(true);
      setcreditData(savedData);
    }

    if (data?.data && data?.data?.count > 0) {
      setcreditData(data?.data?.result);
      setPaymentStatus(data?.data.ispro ? "paid" : "fail");
      setIsReport(true);
      setReportLanguage(data?.data.result.reportLanguage);

      if (!isSignedIn) {
        localStorage.setItem(
          "creditReport",
          JSON.stringify(data?.data?.result)
        );
      }
      if (isSignedIn) {
        localStorage.removeItem("creditReport");
      }
    }
  }, [data]);

  return (
    <div
      className={`px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 mx-auto max-w-6xl w-full`}
    >
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
              {thumbnail && (
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
              <>
                {Object.keys(creditData || {}).length > 0 && isReport && (
                  <div className="max-w-full md:max-w-7xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br text-black">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3">
                        {t("analyzePage.planTitle")}
                      </h2>
                      <div className="text-xl font-semibold mb-6">
                        <p className="text-[18px] font-semibold border-b pb-2 mb-2">
                          {t("analyzePage.creditScoreOverview")}
                        </p>

                        {creditData?.creditScore ? (
                          <>
                            <p className="text-[15px]">
                              {t("analyzePage.score")}:
                              <span
                                className={`${
                                  paymentStatus === "paid" && !isReset
                                    ? "font-normal"
                                    : "flex italic justify-center font-normal text-gray-500"
                                }`}
                              >
                                {paymentStatus === "paid" && !isReset
                                  ? creditData?.creditScore
                                  : t("analyzePage.exactScoreAfterPayment")}
                              </span>
                            </p>
                            <p className="text-sm mt-2">
                              {t("analyzePage.yourScoreIsInThe")}
                              <span
                                className={`px-4 py-1 mx-1 rounded-full text-sm font-semibold ${scoreColors[scoreCategory]}`}
                              >
                                {scoreCategory}
                              </span>{" "}
                              {t("analyzePage.range")}
                            </p>
                          </>
                        ) : (
                          <span className="font-normal text-[15px]">
                            {t("emptyData")}
                          </span>
                        )}
                        <div className="mt-4 grid grid-cols-4 text-center text-sm font-semibold border border-gray-300">
                          <div className="bg-yellow-300 py-2 border-r border-gray-300">
                            {t("analyzePage.fair")}
                          </div>
                          <div className="bg-green-300 py-2 border-r border-gray-300">
                            {t("analyzePage.good")}
                          </div>
                          <div className="bg-green-400 py-2 border-r border-gray-300">
                            {t("analyzePage.veryGood")}
                          </div>
                          <div className="bg-green-600 py-2 text-white">
                            {t("analyzePage.excellent")}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-[18px] font-semibold border-b pb-2 mb-2">
                          {t("analyzePage.factorAnalysis")}
                        </h3>
                        <div className="overflow-auto">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="bg-gray-100 border-collapse">
                                <th className="p-2">
                                  {t("analyzePage.factor")}
                                </th>
                                <th className="p-2">
                                  {t("analyzePage.status")}
                                </th>
                                <th className="p-2">
                                  {t("analyzePage.details")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditData.factorAnalysis ? (
                                creditData.factorAnalysis.map((item, i) => (
                                  <tr
                                    key={i}
                                    className={`border-collapse ${
                                      i > 1 &&
                                      paymentStatus &&
                                      paymentStatus != "paid" &&
                                      "bg-gray-100"
                                    }`}
                                  >
                                    <td className="p-2">{item.factor}</td>
                                    <td
                                      className={`p-2 font-semibold
                                       ${
                                         i > 1
                                           ? paymentStatus &&
                                             paymentStatus === "paid" &&
                                             !isReset
                                             ? statusColorClass(item.status)
                                             : "italic text-gray-500"
                                           : statusColorClass(item.status)
                                       }`}
                                    >
                                      {i > 1
                                        ? paymentStatus &&
                                          paymentStatus === "paid" &&
                                          !isReset
                                          ? item.status
                                          : t(
                                              "analyzePage.availableAfterPayment"
                                            )
                                        : item.status}
                                    </td>
                                    <td
                                      className={`p-2 transition-colors duration-200 ${
                                        i > 1 &&
                                        (paymentStatus != "paid" || isReset) &&
                                        "italic text-gray-500"
                                      }`}
                                    >
                                      {i > 1
                                        ? paymentStatus &&
                                          paymentStatus === "paid" &&
                                          !isReset
                                          ? item.details
                                          : t(
                                              "analyzePage.availableAfterPayment"
                                            )
                                        : item.details}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3}>
                                    <div className="flex items-center justify-center h-32 w-full text-center font-semibold">
                                      {t("emptyData")}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-[18px] font-semibold border-b pb-2 mb-2">
                          {t("analyzePage.threeMonthActionPlan")}
                        </h3>
                        {creditData.actionPlan ? (
                          <>
                            <ul className="list-decimal pl-6 space-y-2 text-[15px]">
                              {creditData.actionPlan &&
                                creditData.actionPlan.map((item, i) => {
                                  const isFirst = i === 0;
                                  const shouldRender =
                                    isFirst ||
                                    (paymentStatus === "paid" && !isReset);

                                  if (!shouldRender) return null;

                                  return (
                                    <li key={i}>
                                      <strong>{item.month}:</strong>
                                      <ul className="list-disc pl-6 mt-1 space-y-1">
                                        {Array.isArray(item.actions) &&
                                          item.actions.map((action, index) => (
                                            <li key={index}>{action}</li>
                                          ))}
                                      </ul>
                                    </li>
                                  );
                                })}
                            </ul>
                            {(paymentStatus != "paid" || isReset) && (
                              <span className="flex mt-2 italic text-[15px] text-gray-500 justify-center text-center">
                                {t(
                                  "analyzePage.monthTwoThreePlansAfterPayment"
                                )}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="font-normal text-[15px]">
                            {t("emptyData")}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-[18px] font-semibold border-b pb-2 mb-2">
                          {t("analyzePage.delinquencyExpiry")}
                        </h3>
                        {creditData.delinquencyStatus ? (
                          <p
                            className={`${
                              paymentStatus === "paid" && !isReset
                                ? "text-black"
                                : "italic text-gray-500 text-center"
                            } text-[15px]`}
                          >
                            {paymentStatus === "paid" && !isReset
                              ? creditData.delinquencyStatus
                              : t("analyzePage.availableAfterPayment")}
                          </p>
                        ) : (
                          <span className="font-normal text-[15px]">
                            {t("emptyData")}
                          </span>
                        )}
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
                        {paymentStatus === "paid" && data?.data?.ispro && (
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
                )}
                {/* {isEmpty && isReport && (
                  <div className="flex flex-col items-center justify-center p-6 rounded-lg">
                    <div className="text-3xl mb-2">⚠️</div>
                    <p className="text-center font-medium text-[16px]">
                      Credit report is empty or the uploaded file is invalid.
                    </p>
                    {!thumbnail &&
                    <button
                      disabled={loading}
                      onClick={handleReset}
                      className={`cursor-pointer mt-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-white font-semibold text-sm sm:text-base ${
                        loading
                          ? "bg-blue-300 cursor-not-allowed text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {t("analyzePage.resetButton")}
                    </button>
                    }
                  </div>
                )} */}
              </>
              {/* )} */}
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
