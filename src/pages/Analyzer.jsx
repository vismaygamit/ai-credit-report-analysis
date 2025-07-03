import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReport,
  getReportByReportId,
  resetReportErrorAndStatus,
} from "../store/reportSlice";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import * as fontkit from "fontkit";
import reshape from "arabic-reshaper";
import { saveAs } from "file-saver";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

  // const statusColorClass = (status) => {
  //   const map = {
  //     Excellent: "text-green-700",
  //     Strong: "text-emerald-700",
  //     Good: "text-green-600",
  //     Moderate: "text-yellow-600",
  //     "Neutral / Concern": "text-gray-500",
  //     Short: "text-gray-600",
  //     "Recent Inquiries": "text-yellow-600",
  //     Poor: "text-red-600",
  //     Limited: "text-gray-500",
  //     "No Data": "text-gray-400",
  //     "Moderate Risk": "text-yellow-700",
  //     Positive: "text-green-500",
  //     Mixed: "text-orange-500",
  //     "Elevated Activity": "text-orange-600",
  //     "Good Diversification": "text-blue-600",
  //   };
  //   return map[status] || "text-gray-700";
  // };

  const generateActionPlanPDF = async () => {
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points (1/72 inch)

      // Embed a font that supports basic Unicode (Helvetica)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Define fonts and styles
      const fontSize = 12;
      const titleFontSize = 20;
      const subTitleFontSize = 16;
      const lineHeight = 15;
      const margin = 50;
      let y = 830; // Starting y-position near the top

      // Helper function to add text
      const addText = (text, x, y, size, color = rgb(0, 0, 0)) => {
        page.drawText(text, { x, y, size, font, color });
        return y - lineHeight;
      };

      // Embed and add logo at top middle
      const logoBytes = await fetch("/assets/logo.png").then((res) =>
        res.arrayBuffer()
      ); // Adjust path
      const logoImage = await pdfDoc.embedPng(logoBytes); // Use embedJpg for .jpg
      const logoDims = logoImage.scale(0.2); // Scale to 20% of original size (adjust as needed)
      const pageWidth = 595.28; // A4 width in points
      const logoX = (pageWidth - 140) / 2; // Center horizontally
      console.log("width", logoDims.width);
      console.log("height", logoDims.height);

      // return;
      page.drawImage(logoImage, {
        x: logoX,
        y: 770, // Place logo at the top
        width: 140,
        height: 50,
      });
      y -= logoDims.height + 20; // Move y past logo and add extra space

      // Title and Timestamp below logo
      y = addText("Score Progress Report", margin, y, titleFontSize);
      // y = addText(
      //   `As of ${new Date().toLocaleString("en-US", {
      //     timeZone: "Asia/Kolkata",
      //     hour12: true,
      //     month: "long",
      //     day: "numeric",
      //     year: "numeric",
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   })} IST`, // 12:55 PM IST, July 02, 2025
      //   margin,
      //   y,
      //   fontSize
      // );
      y -= 20;

      // Credit Summary
      y = addText("Credit Summary", margin, y, subTitleFontSize);
      const creditSummary = creditData.scoreProgress.creditSummary;
      const summaryItems = [
        `Score: ${creditSummary.score} (${creditData.summary.rating})`,
        `Utilization: ${creditSummary.utilization}`,
        `On-time Payments: ${creditSummary.onTimePayments}`,
        `Accounts in Good Standing: ${creditSummary.activeAccounts}`,
        `Inquiries: ${creditSummary.hardInquiries} hard, ${creditSummary.softInquiries}`,
        `Derogatory Marks: ${creditSummary.derogatoryMarks || "None"}`,
      ];
      summaryItems.forEach((item) => {
        y = addText(`• ${item}`, margin + 10, y, fontSize);
      });
      y -= 20;

      // Score Simulator (Replace "→" with "-")
      y = addText("Score Simulator", margin, y, subTitleFontSize);
      creditData.scoreProgress.scoreSimulator.forEach((scenario, i) => {
        y = addText(
          `${i + 1}. ${scenario.scenario} - ${scenario.projectedScoreChange}`,
          margin + 10,
          y,
          fontSize
        );
      });
      y -= 20;

      // Action Checklist (Replace "✔" with "X" and "⃣" with "O")
      y = addText("Action Checklist", margin, y, subTitleFontSize);
      Object.entries(creditData.scoreProgress.checklist).forEach(
        ([action, completed], i) => {
          const actionText =
            action === "payCTB1"
              ? "Pay off $500 on Canadian Tire #1"
              : action === "keepCIBCOpen"
              ? "Keep CIBC and Royal Bank accounts open"
              : action === "requestCLI"
              ? "Submit CLI request to Rogers Bank"
              : action === "reportRent"
              ? "Register rent reporting via FrontLobby"
              : action === "avoidApplications"
              ? "Avoid credit card applications until September 2025"
              : "";
          y = addText(
            `${completed ? "X" : "O"} ${actionText}`,
            margin + 10,
            y,
            fontSize,
            completed ? rgb(0, 0.5, 0) : rgb(0.5, 0.5, 0.5)
          );
        }
      );
      y -= 20;

      // Progress Projection (Text representation)
      y = addText("Progress Projection", margin, y, subTitleFontSize);
      creditData.scoreProgress.forecastChart.dataPoints.forEach((point) => {
        y = addText(
          `${new Date(point.date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}: ${point.score}`,
          margin + 10,
          y,
          fontSize
        );
      });
      y = addText(
        `Target Score: ${
          creditData.scoreProgress.forecastChart.targetScore
        } by ${new Date(
          creditData.scoreProgress.forecastChart.targetDate
        ).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`,
        margin + 10,
        y,
        fontSize
      );

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Save the PDF file
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "score_progress.pdf");
      console.log("PDF generated successfully as credit_summary.pdf");
    } catch (error) {
      console.log("error", error);
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
      dispatch(resetReportErrorAndStatus());
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
    if (statusCode && statusCode != 200 && error) {
      error && toast.error(error.message);
    }
    if (data?.data && data?.data?.count === 0) {
      if (statusCode && statusCode === 200 && Object.keys(creditData).length === 0) {
        toast.warn("No data found!");
      }
    }

    console.log("status", statusCode, error, data);

    dispatch(resetReportErrorAndStatus());
  }, [statusCode, error]);

  const getReport = async () => {
    try {
      if (isSignedIn) {
        // await handleReset();
        dispatch(getReportByReportId(user.id));
        // setIsReport(true);
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
    if (data) {
      const savedData = JSON.parse(localStorage.getItem("creditReport"));

      if (data?.data && data?.data?.count === 0) {
        // setIsReport(true);
        setFileName(false);
        setIsReport(false);
        setThumbnail(false);
        setcreditData({});
        // if (statusCode && statusCode === 200) {
        //   toast.warn("No data found!");
        // }
      }

      if (savedData && Object.keys(savedData).length > 0 && loading === false) {
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
    }
    console.log("data", data);
  }, [data]);

  return (
    <div
      className={`px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 mx-auto lg:w-full sm:w-full`}
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
                    <div className="p-4 sm:p-6 text-black">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3">
                        {t("analyzePage.planTitle")}
                      </h2>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 bg-white rounded-2xl space-y-0">
                          <h2 className="text-2xl font-bold">
                            Structured Summary
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-1">
                            <div>
                              <p>
                                <span className="font-semibold text-xl">
                                  Score:{" "}
                                </span>
                                <span className="pr-1">
                                  {creditData?.summary.score ?? "None"}
                                </span>
                                {creditData?.summary.rating ?? ""}
                              </p>
                              <h3 className="font-semibold text-xl">
                                Tradelines:
                              </h3>
                              <ul className="list-disc list-inside space-y-2">
                                <li>
                                  <span className="font-semibold text-xl">
                                    Revolving (
                                    {creditData?.summary.tradelines.revolving
                                      ?.length || 0}{" "}
                                    accounts):
                                  </span>
                                  <ul className="list-disc list-inside pl-4">
                                    {creditData?.summary.tradelines.revolving
                                      ?.length > 0 ? (
                                      creditData.summary.tradelines.revolving.map(
                                        (account, index) => (
                                          <li
                                            key={index}
                                            className={`p-1 ${
                                              index > 0
                                                ? paymentStatus === "paid" &&
                                                  !isReset
                                                  ? ""
                                                  : "bg-gray-200 italic text-gray-400"
                                                : ""
                                            }`}
                                          >
                                            {index > 0
                                              ? paymentStatus === "paid" &&
                                                !isReset
                                                ? `${account
                                                    .split("(")[0]
                                                    .trim()} (${
                                                    account.includes("closed")
                                                      ? "Closed"
                                                      : "Open"
                                                  })`
                                                : "Visible After Payment"
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()} (${
                                                  account.includes("closed")
                                                    ? "Closed"
                                                    : "Open"
                                                })`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li>None</li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    Installment (
                                    {creditData?.summary.tradelines.installment
                                      ?.length || 0}{" "}
                                    account
                                    {creditData?.summary.tradelines.installment
                                      ?.length !== 1
                                      ? "s"
                                      : ""}
                                    ):
                                  </span>
                                  <ul className="list-disc list-inside pl-4 p-1">
                                    {creditData?.summary.tradelines.installment
                                      ?.length > 0 ? (
                                      creditData.summary.tradelines.installment.map(
                                        (account, index) => (
                                          <li
                                            key={index}
                                            className={`p-1 ${
                                              index > 0
                                                ? paymentStatus === "paid" &&
                                                  !isReset
                                                  ? ""
                                                  : "bg-gray-200 italic text-gray-400"
                                                : ""
                                            }`}
                                          >
                                            {index > 0
                                              ? paymentStatus === "paid" &&
                                                !isReset
                                                ? `${account
                                                    .split("(")[0]
                                                    .trim()}`
                                                : "Visible After Payment"
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">None</li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    Open (
                                    {creditData?.summary.tradelines.open
                                      ?.length || 0}{" "}
                                    account
                                    {creditData?.summary.tradelines.open
                                      ?.length !== 1
                                      ? "s"
                                      : ""}
                                    ):
                                  </span>
                                  <ul className="list-disc list-inside pl-4 p-1">
                                    {creditData?.summary.tradelines.open
                                      ?.length > 0 ? (
                                      creditData.summary.tradelines.open.map(
                                        (account, index) => (
                                          <li
                                            key={index}
                                            className={`p-1 ${
                                              index > 0
                                                ? paymentStatus === "paid" &&
                                                  !isReset
                                                  ? ""
                                                  : "bg-gray-200 italic text-gray-400"
                                                : ""
                                            }`}
                                          >
                                            {index > 0
                                              ? paymentStatus === "paid" &&
                                                !isReset
                                                ? `${account
                                                    .split("(")[0]
                                                    .trim()}`
                                                : "Visible After Payment"
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">None</li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    Mortgage (
                                    {creditData?.summary.tradelines.mortgage
                                      ?.length || 0}{" "}
                                    account
                                    {creditData?.summary.tradelines.mortgage
                                      ?.length !== 1
                                      ? "s"
                                      : ""}
                                    ):
                                  </span>
                                  <ul className="list-disc list-inside pl-4">
                                    {creditData?.summary.tradelines.mortgage
                                      ?.length > 0 ? (
                                      creditData.summary.tradelines.mortgage.map(
                                        (account, index) => (
                                          <li
                                            key={index}
                                            className={`p-1 ${
                                              index > 0
                                                ? paymentStatus === "paid" &&
                                                  !isReset
                                                  ? ""
                                                  : "bg-gray-200 italic text-gray-400"
                                                : ""
                                            }`}
                                          >
                                            {index > 0
                                              ? paymentStatus === "paid" &&
                                                !isReset
                                                ? `${account
                                                    .split("(")[0]
                                                    .trim()}`
                                                : "Visible After Payment"
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">None</li>
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <p>
                                <span className="font-semibold text-xl">
                                  Payment History:{" "}
                                </span>
                                {creditData?.summary.paymentHistory
                                  ? `${
                                      creditData.summary.paymentHistory
                                        .allCurrent
                                        ? "All Current"
                                        : "Issues Detected"
                                    } (${
                                      creditData.summary.paymentHistory
                                        .missedOrLatePast24Months
                                    } missed/late in 24 months)`
                                  : "None"}
                              </p>
                              <h3 className="font-semibold mb-1 text-xl">
                                Inquiries:
                                {/* ({creditData?.summary.inquiries.total || "0"}): */}
                              </h3>
                              <ul className="list-disc list-inside space-y-2">
                                <li className="p-1">
                                  Hard Inquiries:{" "}
                                  {creditData?.summary.inquiries.hard?.length >
                                  0
                                    ? creditData.summary.inquiries.hard.length
                                    : "None"}{" "}
                                  total
                                </li>
                                <li className={`p-1`}>
                                  Soft Inquiries:{" "}
                                  <span
                                    className={`${
                                      paymentStatus === "paid" && !isReset
                                        ? ""
                                        : "bg-gray-200 italic text-gray-400"
                                    }`}
                                  >
                                    {creditData?.summary.inquiries.soft
                                      ?.length > 0
                                      ? paymentStatus === "paid" && !isReset
                                        ? creditData.summary.inquiries.soft.join(
                                            ", "
                                          )
                                        : "Visible After Payment"
                                      : "None"}
                                  </span>
                                </li>
                              </ul>
                              <h3 className="font-semibold mt-1 text-xl">
                                Credit Utilization:
                              </h3>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="p-1">
                                  Total revolving credit limit:{" "}
                                  {creditData?.summary.creditUtilization
                                    .totalLimit
                                    ? `$${creditData.summary.creditUtilization.totalLimit.toLocaleString()}`
                                    : "None"}
                                </li>
                                <li className={`p-1`}>
                                  Total revolving balance:{" "}
                                  <span
                                    className={`${
                                      paymentStatus === "paid" && !isReset
                                        ? ""
                                        : "bg-gray-200 italic text-gray-400"
                                    }`}
                                  >
                                    {creditData?.summary.creditUtilization
                                      .totalBalance
                                      ? paymentStatus === "paid" && !isReset
                                        ? `$${creditData.summary.creditUtilization.totalBalance.toLocaleString()}`
                                        : "Visible After Payment"
                                      : "None"}
                                  </span>
                                </li>
                                <li className="p-1">
                                  Utilization rate:{" "}
                                  {creditData?.summary.creditUtilization
                                    .utilizationRate
                                    ? `${(
                                        creditData.summary.creditUtilization
                                          .utilizationRate * 100
                                      ).toFixed(1)}% ✅ ${
                                        creditData.summary.creditUtilization
                                          .rating
                                      }`
                                    : "None"}
                                </li>
                              </ul>
                              <h3 className="font-semibold mt-1 text-xl">
                                Credit Age:
                              </h3>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="p-1">
                                  Oldest Account:{" "}
                                  {creditData?.summary.creditAge.oldest.account
                                    ? `${
                                        creditData.summary.creditAge.oldest
                                          .account
                                      } (Opened ${new Date(
                                        creditData.summary.creditAge.oldest.opened
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                      })})`
                                    : "None"}
                                </li>
                                <li className="p-1">
                                  Newest Account:{" "}
                                  <span
                                    className={`${
                                      paymentStatus === "paid" && !isReset
                                        ? ""
                                        : "bg-gray-200 italic text-gray-400"
                                    }`}
                                  >
                                    {creditData?.summary.creditAge.newest
                                      .account
                                      ? paymentStatus === "paid" && !isReset
                                        ? `${
                                            creditData.summary.creditAge.newest
                                              .account
                                          } (Opened ${new Date(
                                            creditData.summary.creditAge.newest.opened
                                          ).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                          })})`
                                        : "Visible After Payment"
                                      : "None"}
                                  </span>
                                </li>
                                <li className="p-1">
                                  Average Age:{" "}
                                  {creditData?.summary.creditAge.averageAgeYears
                                    ? `${creditData.summary.creditAge.averageAgeYears} years (Thin File)`
                                    : "None"}
                                </li>
                              </ul>
                              <p className="mt-2">
                                <span className="font-semibold text-xl">
                                  Collections:{" "}
                                </span>
                                {creditData?.summary.collections !== undefined
                                  ? creditData.summary.collections
                                  : "None"}
                              </p>
                              <p className="mt-1">
                                <span className="font-semibold text-xl">
                                  Judgments:{" "}
                                </span>
                                {creditData?.summary.judgments !== undefined
                                  ? creditData.summary.judgments
                                  : "None"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold">
                            Structured Data Extraction
                          </h2>
                          <h3 className="text-xl font-semibold mt-1">
                            Accounts & Balances
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                  <th className="text-left p-2">Type</th>
                                  <th className="text-left p-2">Lender</th>
                                  <th className="text-left p-2">Open Date</th>
                                  <th className="text-left p-2">Limit</th>
                                  <th className="text-left p-2">Balance</th>
                                  <th className="text-left p-2">Status</th>
                                  <th className="text-left p-2">Closed</th>
                                  <th className="text-left p-2">Past Due</th>
                                </tr>
                              </thead>
                              <tbody>
                                {creditData?.accountsAndBalances?.length > 0 ? (
                                  creditData.accountsAndBalances.map(
                                    (account, i) =>
                                      i > 2 &&
                                      (paymentStatus !== "paid" || isReset) ? (
                                        <tr
                                          key={i}
                                          className={`border-t hover:bg-slate-50 transition-colors italic text-gray-400 bg-gray-200`}
                                          style={{ textAlign: "center" }}
                                        >
                                          <td
                                            style={{ textAlign: "center" }}
                                            colSpan={8}
                                            className="p-3 text-sm text-center align-middle"
                                          >
                                            Visible After Payment
                                          </td>
                                        </tr>
                                      ) : (
                                        <tr
                                          key={i}
                                          className={`border-t hover:bg-slate-50 transition-colors ${
                                            i % 2 === 0
                                              ? "bg-white"
                                              : "bg-slate-50"
                                          }`}
                                        >
                                          <td className="p-3 text-sm whitespace-nowrap">
                                            {account.type
                                              ? account.type
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                account.type.slice(1)
                                              : "N/A"}
                                          </td>
                                          <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                            {account.lender || "N/A"}
                                          </td>
                                          <td className="p-2">
                                            {account.openDate &&
                                            !isNaN(
                                              new Date(
                                                account.openDate
                                              ).getTime()
                                            )
                                              ? new Date(
                                                  account.openDate
                                                ).toLocaleDateString("en-US", {
                                                  month: "short",
                                                  year: "numeric",
                                                })
                                              : "Unknown"}
                                          </td>
                                          <td className="p-2">
                                            {account.limit
                                              ? `$${account.limit.toLocaleString()}`
                                              : "N/A"}
                                          </td>
                                          <td className="p-2">
                                            {account.balance
                                              ? `$${account.balance.toLocaleString()}`
                                              : "$0"}
                                          </td>
                                          <td className="p-2">
                                            {account.status || "N/A"}
                                          </td>
                                          <td className="p-2">
                                            {account.closed ? "Yes" : "No"}
                                          </td>
                                          <td className="p-2">
                                            {account.pastDue
                                              ? `$${account.pastDue.toLocaleString()}`
                                              : "$0"}
                                          </td>
                                        </tr>
                                      )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={8}
                                      className="p-3 text-sm text-slate-700 text-center"
                                    >
                                      None
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold">
                            Inquiry Records
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Date
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Lender
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Type
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Affects Score
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {creditData?.inquiries?.length > 0 ? (
                                  creditData.inquiries.map((inq, i) =>
                                    i > 2 &&
                                    (paymentStatus !== "paid" || isReset) ? (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors italic text-gray-400 bg-gray-200`}
                                      >
                                        <td
                                          style={{ textAlign: "center" }}
                                          colSpan={4}
                                          className="p-3 text-sm text-center align-middle"
                                        >
                                          Visible After Payment
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors ${
                                          i % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50"
                                        }`}
                                      >
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {inq.date &&
                                          !isNaN(new Date(inq.date).getTime())
                                            ? new Date(
                                                inq.date
                                              ).toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "Unknown"}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {inq.lender || "N/A"}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {inq.type || "N/A"}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {typeof inq.affectsScore === "boolean"
                                            ? inq.affectsScore
                                              ? "Yes"
                                              : "No"
                                            : "N/A"}
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="p-3 text-sm text-slate-700 text-center"
                                    >
                                      None
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold">
                            Collections & Public Records
                          </h3>
                          <ul className="list-disc pl-5 text-sm">
                            <li className="p-1">
                              Collections:{" "}
                              {creditData?.publicRecords.collections !==
                              undefined
                                ? creditData.publicRecords.collections
                                : "None"}
                            </li>
                            <li className="p-1">
                              Judgments:{" "}
                              {creditData?.publicRecords.judgments !== undefined
                                ? creditData.publicRecords.judgments
                                : "None"}
                            </li>
                            <li className="p-1">
                              <span>Secured Loan:</span>{" "}
                              {creditData?.securedLoan?.lender
                                ? `${
                                    creditData.securedLoan.lender
                                  } - Registered: 
                                    ${creditData.securedLoan.registered}
                                 , Amount: $${creditData.securedLoan.amount.toLocaleString()}, Maturity: ${
                                    creditData.securedLoan.maturity
                                  }`
                                : "None"}
                            </li>
                          </ul>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold mb-2">
                            Credit Evaluation
                          </h2>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Metric
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    Analysis
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {creditData?.creditEvaluation ? (
                                  Object.entries(
                                    creditData.creditEvaluation
                                  ).map(([metric, analysis], i) =>
                                    i > 2 &&
                                    (paymentStatus !== "paid" || isReset) ? (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors italic text-gray-400 bg-gray-200`}
                                      >
                                        <td
                                          style={{ textAlign: "center" }}
                                          colSpan={2}
                                          className="p-3 text-sm text-center align-middle"
                                        >
                                          Visible After Payment
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors ${
                                          i % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50"
                                        }`}
                                      >
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {metric
                                            ? metric.charAt(0).toUpperCase() +
                                              metric.slice(1)
                                            : "N/A"}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {analysis || "None"}
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={2}
                                      className="p-3 text-sm text-slate-700 text-center"
                                    >
                                      None
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 overflow-x-auto w-full max-w-full">
                          <h2 className="text-2xl font-semibold">
                            Score Forecast Engine
                          </h2>
                          <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                            <thead>
                              <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                <th className="text-left p-2">Action</th>
                                <th className="text-left p-2">Impact (pts)</th>
                                <th className="text-left p-2">Timeline</th>
                                <th className="text-left p-2">Priority</th>
                                <th className="text-left p-2">Confidence</th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditData?.scoreForecast?.length > 0 ? (
                                creditData.scoreForecast.map((forecast, i) =>
                                  i > 1 &&
                                  (paymentStatus !== "paid" || isReset) ? (
                                    <tr
                                      key={i}
                                      className={`border-t hover:bg-slate-50 transition-colors italic text-gray-400 bg-gray-200`}
                                    >
                                      <td
                                        style={{ textAlign: "center" }}
                                        colSpan={5}
                                        className="p-3 text-sm text-slate-700 text-center align-middle"
                                      >
                                        Visible After Payment
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr
                                      key={i}
                                      className={`border-t hover:bg-slate-50 transition-colors ${
                                        i % 2 === 0 ? "bg-white" : "bg-slate-50"
                                      }`}
                                    >
                                      <td className="p-2">
                                        {forecast.action || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {typeof forecast.estimatedImpact ===
                                        "number"
                                          ? forecast.estimatedImpact
                                          : "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.timeline || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.priority || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.confidence || "N/A"}
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="p-3 text-sm text-slate-700 text-center"
                                  >
                                    None
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 overflow-x-auto w-full max-w-full">
                          <h2 className="text-2xl font-semibold">
                            AI Action Plan Generator
                          </h2>
                          <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                            <thead>
                              <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                <th className="text-left p-2">
                                  Recommendation
                                </th>
                                <th className="text-left p-2">Description</th>
                                <th className="text-left p-2">Priority</th>
                                <th className="text-left p-2">Timeline</th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditData?.actionPlan?.length > 0 ? (
                                creditData.actionPlan.map((forecast, i) =>
                                  i > 1 &&
                                  (paymentStatus !== "paid" || isReset) ? (
                                    <tr
                                      key={i}
                                      className={`border-t hover:bg-slate-50 transition-colors italic text-gray-400 bg-gray-200`}
                                    >
                                      <td
                                        style={{ textAlign: "center" }}
                                        colSpan={5}
                                        className="p-3 text-sm text-slate-700 text-center align-middle"
                                      >
                                        Visible After Payment
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr
                                      key={i}
                                      className={`border-t hover:bg-slate-50 transition-colors ${
                                        i % 2 === 0 ? "bg-white" : "bg-slate-50"
                                      }`}
                                    >
                                      <td className="p-2">
                                        {forecast.recommendation || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.description || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.priority || "N/A"}
                                      </td>
                                      <td className="p-2">
                                        {forecast.timeline || "N/A"}
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td
                                    colSpan={5}
                                    className="p-3 text-sm text-slate-700 text-center"
                                  >
                                    None
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold">
                            Dispute & Removal Toolkit
                          </h2>
                          <h3 className="text-xl font-semibold mb-2">
                            Dispute Letter
                          </h3>
                          <div className="bg-white border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap">
                            {creditData?.disputeToolkit?.disputeLetter ? (
                              <p>{creditData?.disputeToolkit.disputeLetter}</p>
                            ) : (
                              <p>None</p>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">
                            Goodwill Removal Script
                          </h3>
                          <div
                            className={`${
                              paymentStatus === "paid" && !isReset
                                ? "bg-white"
                                : "text-gray-400 bg-gray-200 italic text-center"
                            } border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap`}
                          >
                            {creditData?.disputeToolkit?.goodwillScript
                              ? paymentStatus === "paid" && !isReset
                                ? creditData.disputeToolkit.goodwillScript
                                : "Visible After Payment"
                              : "None"}
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold">
                            Score Progress Tracker
                          </h2>
                          <h3 className="text-lg font-semibold mb-2">
                            Credit Summary
                          </h3>
                          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-slate-700">
                            {creditData?.scoreProgress?.creditSummary ? (
                              <>
                                <li>
                                  <strong>Score:</strong>{" "}
                                  {creditData.scoreProgress.creditSummary.score}{" "}
                                  ({creditData.summary.rating})
                                </li>
                                <li>
                                  <strong>Utilization:</strong>{" "}
                                  {
                                    creditData.scoreProgress.creditSummary
                                      .utilization
                                  }
                                </li>
                                <li>
                                  <strong>On-time payments:</strong>{" "}
                                  {
                                    creditData.scoreProgress.creditSummary
                                      .onTimePayments
                                  }
                                </li>
                                <li>
                                  <strong>Accounts in Good Standing:</strong>{" "}
                                  {
                                    creditData.scoreProgress.creditSummary
                                      .activeAccounts
                                  }
                                </li>
                                <li>
                                  <strong>Inquiries:</strong>{" "}
                                  {
                                    creditData.scoreProgress.creditSummary
                                      .hardInquiries
                                  }{" "}
                                  hard,{" "}
                                  {
                                    creditData.scoreProgress.creditSummary
                                      .softInquiries
                                  }
                                </li>
                                <li>
                                  <strong>Derogatory Marks:</strong>{" "}
                                  {creditData.scoreProgress.creditSummary
                                    .derogatoryMarks || "None"}
                                </li>
                              </>
                            ) : (
                              <li className="col-span-2">None</li>
                            )}
                          </ul>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Score Simulator
                          </h3>
                          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                            {creditData?.scoreProgress?.scoreSimulator?.length >
                            0 ? (
                              creditData.scoreProgress.scoreSimulator.map(
                                (scenario, i) => (
                                  <li
                                    key={i}
                                    className={`${
                                      i > 0
                                        ? paymentStatus === "paid" && !isReset
                                          ? ""
                                          : "bg-gray-200 italic text-gray-400"
                                        : ""
                                    }`}
                                  >
                                    {/* {scenario.scenario} →{" "}
                                    {scenario.projectedScoreChange} */}
                                    {i > 0 &&
                                    (paymentStatus !== "paid" || isReset) ? (
                                      <span className="text-center block">
                                        Visible After Payment
                                      </span>
                                    ) : (
                                      <>
                                        {scenario.scenario
                                          ? scenario.scenario
                                              .split("(")[0]
                                              .trim()
                                          : "N/A"}{" "}
                                        →{" "}
                                        {typeof scenario.projectedScoreChange ===
                                        "number"
                                          ? scenario.projectedScoreChange
                                          : "N/A"}
                                      </>
                                    )}
                                  </li>
                                )
                              )
                            ) : (
                              <li>None</li>
                            )}
                          </ul>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-4">
                            Action Checklist
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {creditData?.scoreProgress?.checklist ? (
                              Object.entries(
                                creditData.scoreProgress.checklist
                              ).map(([action, completed], i) =>
                                i > 2 &&
                                (paymentStatus !== "paid" || isReset) ? (
                                  <li
                                    key={i}
                                    className={`${
                                      i > 0
                                        ? paymentStatus === "paid" && !isReset
                                          ? ""
                                          : "bg-gray-200 italic text-gray-400 col-span-1 sm:col-span-2 p-4 text-sm"
                                        : ""
                                    }`}
                                    aria-label="Restricted checklist item"
                                  >
                                    Visible After Payment
                                  </li>
                                ) : (
                                  <li
                                    key={i}
                                    className={`flex items-center gap-3 p-4 rounded-lg border shadow-sm ${
                                      completed
                                        ? "bg-gradient-to-r from-white to-blue-50 border-blue-200"
                                        : "bg-slate-50 border-slate-200"
                                    }`}
                                  >
                                    <span
                                      className={`text-2xl ml-2 mr-4 ${
                                        completed
                                          ? "text-green-500"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {completed ? "✔" : "⃣"}
                                    </span>
                                    <span className="text-sm">
                                      {action === "payCTB1" &&
                                        "Pay off $500 on Canadian Tire #1"}
                                      {action === "keepCIBCOpen" &&
                                        "Keep CIBC and Royal Bank accounts open"}
                                      {action === "requestCLI" &&
                                        "Submit CLI request to Rogers Bank"}
                                      {action === "reportRent" &&
                                        "Register rent reporting via FrontLobby"}
                                      {action === "avoidApplications" &&
                                        "Avoid credit card applications until September 2025"}
                                    </span>
                                  </li>
                                )
                              )
                            ) : (
                              <li className="col-span-2 p-4 text-sm text-slate-700">
                                None
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Progress Projection
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={
                                creditData?.scoreProgress?.forecastChart?.dataPoints?.map(
                                  (point) => ({
                                    name: point.date,
                                    score: point.score,
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
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 overflow-x-auto w-full max-w-full">
                          <h2 className="text-2xl font-semibold">
                            AI Reminder & Re-Evaluation Engine
                          </h2>
                          <div className="overflow-auto">
                            <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                  <th className="text-left p-2">Event</th>
                                  <th className="text-left p-2">
                                    Reminder Date
                                  </th>
                                  <th className="text-left p-2">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {creditData?.reminders?.length > 0 ? (
                                  creditData.reminders.map((reminder, i) =>
                                    i > 1 &&
                                    (paymentStatus !== "paid" || isReset) ? (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors 
                                            text-gray-400 bg-gray-200 italic text-center
                                        `}
                                      >
                                        <td
                                          colSpan={3}
                                          style={{ textAlign: "center" }}
                                          className="p-3 text-sm text-center align-middle"
                                        >
                                          Visible After Payment
                                        </td>
                                      </tr>
                                    ) : (
                                      <tr
                                        key={i}
                                        className={`border-t hover:bg-slate-50 transition-colors ${
                                          i % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50"
                                        }`}
                                      >
                                        <td className="p-2">
                                          {reminder.event || "N/A"}
                                        </td>
                                        <td className="p-2">
                                          {reminder.reminderDate &&
                                          !isNaN(
                                            new Date(
                                              reminder.reminderDate
                                            ).getTime()
                                          )
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
                                          {reminder.action || "N/A"}
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={3}
                                      className="p-3 text-sm text-slate-700 text-center"
                                    >
                                      None
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>
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
