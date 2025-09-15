import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPaidReport,
  fetchReport,
  getReportByReportId,
  resetData,
  resetProgress,
  resetReportErrorAndStatus,
  setProgress,
  translateObject,
} from "../store/reportSlice";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";
import { saveAs } from "file-saver";
import ProgressBar from "@ramonak/react-progress-bar";
import { ShieldCheck } from "lucide-react";
import TestReport from "../components/TestReport";
import PaidReport from "../components/PaidReport";
import { useFileStorage } from "../util/tmpFileStorage";
import { clearPaymentId } from "../store/paymentSlice";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Analyzer = () => {
  const { tmpFile, saveFile, loadFile } = useFileStorage("report");
  const { t, i18n } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const { openSignIn } = useClerk();
  const [thumbnail, setThumbnail] = useState(null);
  const [fileName, setFileName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isReport, setIsReport] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, translated, error, statusCode } = useSelector(
    (state) => state.report
  );
  const paymentId = useSelector((state) => state.payment.paymentId);
  const progress = useSelector((state) => state.report.progress);
  const [isReportSent, setIsReportSent] = useState(data?.data?.ispro || false);
  let inquiriesCombined = [];
  const chartRef = useRef();
  const disputeRef = useRef();
  const goodWillRef = useRef();
  // const [result, setResult] = useState(data?.data);
  const [creditData, setcreditData] = useState({});
  const [isReset, setIsReset] = useState(false);
  const selectedLanguage = localStorage.getItem("preferLanguage") || "en";
  const fileInputRef = useRef(null);
  const location = useLocation();
  const referrer = location.state?.from;
  const { isSignedIn, user } = useUser();
  const [paymentStatus, setPaymentStatus] = useState("false");
  const { getToken } = useAuth();
  const helps = t("analyzePage.uploadingHelp", { returnObjects: true });

  const handleTranslate = async () => {
    try {
      let creditReportFortranslate;
      if (paymentStatus === "paid") {
        creditReportFortranslate = {
          _id: creditData._id,
          accountsAndBalances: creditData.accountsAndBalances,
          creditEvaluation: creditData.creditEvaluation,
          reminders: creditData.reminders,
          scoreChanges: creditData.scoreChanges,
          scoreForecast: creditData.scoreForecast,
          scoreProgress: creditData.scoreProgress,
        };
      } else {
        creditReportFortranslate = {
          improvementPotential: creditData.improvementPotential,
          keyAreasForImprovement: creditData.keyAreasForImprovement,
          rating: creditData.rating,
          score: creditData.score,
        };
      }
      // if (i18n.language != "en") {
      //   creditReportFortranslate = JSON.parse(localStorage.getItem("creditReportFortranslate"));
      // }
      const token = await getToken({ template: "hasura" });
      dispatch(resetData());
      dispatch(
        translateObject({
          object: creditReportFortranslate,
          targetLanguage: i18n.language,
          token,
          onProgress: (p) => dispatch(setProgress(p)),
        })
      );
      // localStorage.setItem("selectedLanguage", "");
    } catch (error) {
      console.error("Translation failed", error);
    }
  };

  const exportChartAsImage = async () => {
    const svg = chartRef.current?.querySelector("svg");
    if (!svg) return null;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    // Return a Promise that resolves when image is loaded and canvas is drawn
    const base64Image = await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const viewBox = svg.getAttribute("viewBox");
        let width, height;

        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
          width = vbWidth;
          height = vbHeight;
        } else {
          width = svg.clientWidth;
          height = svg.clientHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/png")); // Return the Base64 string
      };

      img.src = url;
    });

    return base64Image;
  };

  useEffect(() => {
    if (translated) {
      setcreditData(translated);
      if (paymentStatus != "paid" && translated?.score !== undefined && location.pathname === "/analyzer")
        localStorage.setItem("creditReport", JSON.stringify(translated));
    }
  }, [translated]);

  const generateActionPlanPDF = async () => {
    try {
      if (
        creditData &&
        typeof creditData === "object" &&
        Object.keys(creditData).length === 0
      ) {
        return;
      }
      let fontUrl, boldFontUrl, font, doc, boldFont;
      const selectedLanguage = i18n.language;

      if (
        selectedLanguage.startsWith("en") ||
        selectedLanguage.startsWith("es") ||
        selectedLanguage.startsWith("fr")
      ) {
        doc = await PDFDocument.create();
        font = await doc.embedFont(StandardFonts.Helvetica);
        boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
      } else if (
        selectedLanguage.startsWith("ru") ||
        selectedLanguage.startsWith("uk")
      ) {
        fontUrl = "/fonts/Roboto-Regular.ttf";
        boldFontUrl = "/fonts/Roboto-Bold.ttf";
      } else if (selectedLanguage.startsWith("hi")) {
        fontUrl = "/fonts/NotoSansDevanagari-Regular.ttf";
        boldFontUrl = "/fonts/NotoSansDevanagari-Bold.ttf";
      }

      if (fontUrl) {
        doc = await PDFDocument.create();
        const regularBytes = await fetch(fontUrl).then((res) =>
          res.arrayBuffer()
        );
        const boldBytes = await fetch(boldFontUrl).then((res) =>
          res.arrayBuffer()
        );

        doc.registerFontkit(fontkit);
        font = await doc.embedFont(regularBytes);
        boldFont = await doc.embedFont(boldBytes);
      }

      let page = doc.addPage([595.28, 841.89]);

      const fontSize = 10;
      const margin = 40;
      let y = 780;

      const newPage = () => {
        page = doc.addPage([595.28, 841.89]);
        y = 780;
      };

      const checkSpace = (neededHeight = fontSize + 4) => {
        if (y < margin + neededHeight) newPage();
      };

      const drawText = (text, isBold = false, offset = 0) => {
        checkSpace();
        page.drawText(text, {
          x: margin + offset,
          y,
          size: fontSize,
          font: isBold ? boldFont : font,
          color: rgb(0, 0, 0),
        });

        y -= fontSize + 4;
      };

      const pageWidth = page.getWidth();
      const availableWidth = pageWidth - margin * 2;

      const drawWrappedText = (
        text,
        font,
        fontSize,
        offset = 0,
        isBold = false
      ) => {
        const words = text.split(" ");
        let line = "";
        const lines = [];

        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const testWidth = font?.widthOfTextAtSize(testLine, fontSize);
          if (testWidth > availableWidth) {
            lines.push(line);
            line = word;
          } else {
            line = testLine;
          }
        }

        if (line) lines.push(line);
        for (const lineText of lines) {
          checkSpace();
          page.drawText(lineText, {
            x: margin + offset,
            y,
            size: fontSize,
            font: isBold ? boldFont : font,
            color: rgb(0, 0, 0),
          });
          y -= fontSize + 4;
        }
      };

      const drawSectionHeader = (text) => {
        const headerHeight = 13;
        checkSpace(headerHeight);
        page.drawRectangle({
          x: margin,
          y,
          width: 530,
          height: headerHeight,
          color: rgb(0.9, 0.9, 0.9),
        });

        page.drawText(text, {
          x: margin + 5,
          y: y + 3,
          size: 11,
          font: boldFont,
          color: rgb(0, 0, 0),
        });

        y -= headerHeight;
      };

      const drawTable = (headers, rows, tableType = "") => {
        drawTableRow(headers, true, tableType);

        rows.forEach((row, rowIndex) => {
          checkSpace(fontSize + 8);

          if (y < margin + fontSize + 8) {
            newPage();
            drawTableRow(headers, true, tableType);
          }

          drawTableRow(row, false, tableType);
        });
      };

      const wrapText = (text, font, fontSize, maxWidth = 495) => {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        for (let word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const width = font?.widthOfTextAtSize(testLine, fontSize);
          if (width < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }

        if (currentLine) lines.push(currentLine);
        return lines;
      };

      const drawSubHeading = (text) => {
        checkSpace(20);
        y -= 6;
        page.drawText(text, {
          x: margin,
          y: y,
          size: 11,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= 16;
      };

      const drawTableRow = (row, isHeader = false, tableType = "") => {
        let colWidths;
        if (row.length === 2) {
          colWidths = [120, 400];
        } else if (row.length === 3) {
          colWidths = [250, 80, 250];
        } else if (row.length === 4) {
          if (tableType === "inquiry") {
            colWidths = [80, 140, 270, 70];
          } else if (tableType === "actionPlan") {
            colWidths = [200, 200, 50, 80];
          } else if (tableType === "scoresimulator") {
            colWidths = [200, 200, 70, 50];
          } else {
            colWidths = [100, 160, 120, 120];
          }
        } else if (row.length === 5) {
          colWidths = [230, 40, 150, 50, 50];
        } else {
          colWidths = [60, 150, 65, 50, 60, 50, 50, 50];
        }

        let x = margin;

        // Calculate wrapped lines
        const wrappedLines = row.map((text, i) =>
          wrapText(String(text ?? ""), font, fontSize - 1, colWidths[i])
        );
        const maxLines = Math.max(...wrappedLines.map((lines) => lines.length));
        const rowHeight = maxLines * (fontSize + 2);

        checkSpace(rowHeight);
        wrappedLines.forEach((lines, i) => {
          const colX = x;
          const colY = y;

          lines.forEach((line, j) => {
            page.drawText(line, {
              x: colX,
              y: colY - j * (fontSize + 2),
              size: fontSize - 1,
              font: isHeader ? boldFont : font,
              color: rgb(0, 0, 0),
            });
          });

          x += colWidths[i];
        });

        y -= rowHeight;
      };

      const drawChecklist = (items) => {
        const itemList = Object.values(items);
        itemList.forEach((item) => {
          drawText(`${item.istrue ? "[o]" : "[x]"} ${item.desc}`);
        });
      };

      const drawMultilineBlock = (text) => {
        const paragraphs = text.split("\n");

        const processedParagraphs = paragraphs.map((p) => p);

        const lineCount = processedParagraphs
          .map((p) => wrapText(p, font, fontSize, 530).length)
          .reduce((a, b) => a + b, 0);

        const blockHeight = lineCount * (fontSize + 4);
        if (y - blockHeight < margin) newPage();

        drawMultiline(text);
      };

      const drawMultiline = (text) => {
        const paragraphs = text.split("\n");

        paragraphs.forEach((para) => {
          const wrappedLines = wrapText(para, font, fontSize, 530);

          wrappedLines.forEach((line) => {
            checkSpace();
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            y -= fontSize + 4;
          });

          y -= 4;
        });
      };

      // Start PDF Content
      // --- Embed Logo Image ---
      const logoBytes = await fetch("/assets/logo.png").then((res) =>
        res.arrayBuffer()
      );
      const logoImage = await doc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.25); // Resize (scale to 25%)

      // const pageWidth = page.getWidth();
      const logoX = (pageWidth - logoDims.width) / 2;
      const logoY = page.getHeight() - 70; // Top margin

      page.drawImage(logoImage, {
        x: 235,
        y: logoY,
        width: 150,
        height: 50,
      });
      y -= 40;
      drawSectionHeader(t("analyzePage.creditSummary"));
      const summary = creditData.summary;
      drawSubHeading(`${t("analyzePage.score")}:`);

      drawText(`${summary?.score} (${summary?.rating})`);
      drawSubHeading(`${t("analyzePage.tradelines")}:`);
      drawSubHeading(
        `${t("analyzePage.revolving")} ${t("analyzePage.accounts")}:`
      );
      summary?.tradelines?.revolving;
      drawSubHeading(
        `${t("analyzePage.installment")} ${t("analyzePage.accounts")}:`
      );
      summary?.tradelines?.installment;
      drawSubHeading(`${t("analyzePage.open")} ${t("analyzePage.accounts")}:`);
      summary?.tradelines.open;
      drawSubHeading(`${t("analyzePage.mortgage")}:`);
      summary?.tradelines?.mortgage;
      y -= 10;
      drawText(
        `${t("analyzePage.paymentHistory")}: ${t(
          "analyzePage.issuesDetected"
        )} ${summary?.paymentHistory?.missedOrLatePast24Months} ${t(
          "analyzePage.missedLate24Months"
        )}`
      );
      drawText(
        `${t("analyzePage.onTimePayments")}: ${
          creditData?.scoreProgress?.creditSummary?.onTimePayments
        }`
      );
      // if (
      //   creditData?.securedLoan &&
      //   typeof creditData.securedLoan === "object"
      // ) {
      //   const loan = creditData?.securedLoan;
      //   drawWrappedText(
      //     `${t("analyzePage.securedLoan")}: ${loan.lender} | ${t(
      //       "analyzePage.registered"
      //     )}: ${loan.registered} | ${t("analyzePage.amount")}: $${
      //       loan.amount
      //     } | ${t("analyzePage.maturity")}: ${loan.maturity}`,
      //     font,
      //     fontSize
      //   );
      // }
      drawText(
        `${t("analyzePage.goodStanding")} ${
          creditData?.scoreProgress?.creditSummary?.activeAccounts
        }`
      );
      // drawText(
      //   `${t("analyzePage.derogatoryMarks")} ${
      //     creditData?.scoreProgress?.creditSummary?.derogatoryMarks
      //   }`
      // );

      drawSubHeading(`${t("analyzePage.inquiries")}`);
      drawText(
        `${t("analyzePage.hardInquiries")}: ${summary?.inquiries?.hard?.length}`
      );
      drawText(
        `${t("analyzePage.softInquiries")}: ${summary?.inquiries?.soft?.length}`
      );
      drawSubHeading(`${t("analyzePage.creditUtilization")}`);
      drawText(
        `${t("analyzePage.totalLimit")}: $${
          summary.creditUtilization.totalLimit
        }`
      );
      drawText(
        `${t("analyzePage.totalBalance")}: $${
          summary.creditUtilization.totalBalance
        }`
      );
      drawText(
        `${t("analyzePage.utilizationRate")}: ${
          summary.creditUtilization.utilizationRate
        }% (${summary.creditUtilization.rating})`
      );

      drawSubHeading(`${t("analyzePage.creditAge")}`);
      drawText(
        `${t("analyzePage.oldestAccount")}: ${
          summary.creditAge.oldest.account
        } (${summary.creditAge.oldest.opened})`
      );
      drawText(
        `${t("analyzePage.newestAccount")}: ${
          summary.creditAge.newest.account
        } (${summary.creditAge.newest.opened})`
      );
      drawText(
        `${t("analyzePage.averageAge")} ${
          summary.creditAge.averageAgeYears
        } ${t("analyzePage.years")}`
      );
      // drawSubHeading(`${t("analyzePage.collections")} :`);
      // drawText(`${summary.collections}`);
      // drawSubHeading(`${t("analyzePage.judgments")} :`);

      // drawText(`${summary.judgments}`);

      if (creditData.accountsAndBalances?.length) {
        y -= 10;
        drawSectionHeader(`${t("analyzePage.structuredData")}`);
        drawSubHeading(`${t("analyzePage.accountsAndBalances")}`);
        const headers = [
          t("analyzePage.type"),
          t("analyzePage.lender"),
          t("analyzePage.openDate"),
          t("analyzePage.limit"),
          t("analyzePage.balance"),
          t("analyzePage.status"),
          t("analyzePage.closed"),
          t("analyzePage.pastDue"),
        ];
        const rows = creditData.accountsAndBalances.map((acc) => [
          acc.type.charAt(0).toUpperCase() + acc.type.slice(1) ||
            t("analyzePage.na"),
          acc.lender || t("analyzePage.na"),
          acc.openDate || t("analyzePage.na"),
          acc.limit ? `$${acc.limit}` : t("analyzePage.na"),
          acc.balance ? `$${acc.balance}` : t("analyzePage.na"),
          acc.status?.toLowerCase() === "open"
            ? t("analyzePage.open")
            : acc.status?.toLowerCase() === "closed"
            ? t("analyzePage.closed")
            : acc.status || t("analyzePage.na"),
          acc.closed === true
            ? t("analyzePage.yes")
            : acc.closed === false
            ? t("analyzePage.no")
            : t("analyzePage.na"),
          acc.pastDue ? `$${acc.pastDue}` : t("analyzePage.na"),
        ]);
        drawTable(headers, rows);
      }

      if (creditData.inquiries?.length) {
        drawSubHeading(`${t("analyzePage.inquiryRecords")}`);
        const headers = [
          t("analyzePage.date"),
          t("analyzePage.lender"),
          // t("analyzePage.type"),
          // t("analyzePage.affectsScore"),
        ];
        const rows = creditData.inquiries.map((i) => [
          i.date,
          i.lender,
          // i.type === "soft"
          //   ? t("analyzePage.soft")
          //   : i.type === "hard"
          //   ? t("analyzePage.hard")
          //   : t("analyzePage.na"),
          // i.affectsScore === true
          //   ? t("analyzePage.yes")
          //   : i.affectsScore === false
          //   ? t("analyzePage.no")
          //   : t("analyzePage.na"),
        ]);
        drawTable(headers, rows);
        y -= 10;
      }

      if (creditData.accountsAndBalances?.length) {
        drawSectionHeader(`${t("analyzePage.creditEvaluation")}`);
        const headers = [t("analyzePage.metric"), t("analyzePage.analysis")];
        const rows = Object.entries(creditData.creditEvaluation)
          .slice(0, 7)
          .map(([key, value], i) => [
            i === 0
              ? t("analyzePage.utilization")
              : i === 1
              ? t("analyzePage.creditMix")
              : i === 2
              ? t("analyzePage.paymentHistory")
              : i === 3
              ? t("analyzePage.delinquency")
              : i === 4
              ? t("analyzePage.inquiryFrequency")
              : i === 5
              ? t("analyzePage.derogatoryMarks")
              : i === 6
              ? t("analyzePage.fileDepth")
              : t("analyzePage.na"),
            value || t("analyzePage.na"),
          ]);
        drawTable(headers, rows);
        y -= 20;
      }

      if (creditData.scoreForecast?.length) {
        drawSectionHeader(`${t("analyzePage.scoreForecast")}`);
        const headers = [
          // t("analyzePage.action"),
          t("analyzePage.impact"),
          t("analyzePage.timeline"),
          t("analyzePage.priority"),
          t("analyzePage.confidence"),
        ];
        const rows = creditData.scoreForecast.map((f) => [
          // f.action,
          f.estimatedImpact,
          f.timeline,
          f.priority,
          f.confidence,
        ]);
        drawTable(headers, rows);
        y -= 20;
      }

      // if (creditData.actionPlan?.length) {
      //   drawSectionHeader(`${t("analyzePage.aiActionPlan")}`);
      //   const headers = [
      //     t("analyzePage.recommendation"),
      //     t("analyzePage.description"),
      //     t("analyzePage.priority"),
      //     t("analyzePage.timeline"),
      //   ];
      //   const rows = creditData.actionPlan.map((a) => [
      //     a.recommendation,
      //     a.description,
      //     a.priority,
      //     a.timeline,
      //   ]);
      //   drawTable(headers, rows, "actionPlan");
      //   y -= 10;
      // }

      const disputeHeading = `${t("analyzePage.dispute")} & ${t(
        "analyzePage.removal"
      )} ${t("analyzePage.toolkit")}`;
      drawSectionHeader(disputeHeading);
      drawSubHeading(
        `${t("analyzePage.dispute") + " " + t("analyzePage.letter")} :`
      );
      drawMultilineBlock(creditData.disputeToolkit.disputeLetter);
      drawSubHeading(
        `${
          t("analyzePage.goodwill") +
          " " +
          t("analyzePage.removal") +
          " " +
          t("analyzePage.letter")
        } :`
      );
      if (selectedLanguage.startsWith("ru")) y += 7;
      drawMultilineBlock(creditData.disputeToolkit.goodwillScript);
      y -= 10;
      if (creditData.scoreProgress) {
        drawSectionHeader(`${t("analyzePage.scoreProgressTracker")}`);
        drawSubHeading(`${t("analyzePage.scoreSimulator")}: `);
        const headers = [
          t("analyzePage.scenario"),
          t("analyzePage.description"),
          t("analyzePage.scoreChange"),
          t("analyzePage.impact"),
        ];
        const rows = creditData.scoreProgress.scoreSimulator.map((s) => [
          s.scenario,
          s.description,
          s.projectedScoreChange,
          s.impactType,
        ]);
        drawTable(headers, rows, "scoresimulator");
        y -= 10;

        drawSubHeading(`${t("analyzePage.actionChecklist")}: `);
        drawChecklist(creditData.scoreProgress.checklist);
        const chartImage = await exportChartAsImage();

        if (chartImage) {
          drawSubHeading(`${t("analyzePage.progressProjection")}: `);
          const base64 = chartImage.split(",")[1]; // remove prefix
          const byteArray = Uint8Array.from(atob(base64), (c) =>
            c.charCodeAt(0)
          );
          const chartPng = await doc.embedPng(byteArray);
          const chartDims = chartPng.scale(0.5);

          if (y < margin + chartDims.height) newPage();

          page.drawImage(chartPng, {
            x: 30,
            y: y - chartDims.height,
            width: chartDims.width - 30,
            height: chartDims.height,
          });

          y -= chartDims.height + 10;
        }
        y -= 10;
      }

      if (creditData.reminders?.length) {
        drawSectionHeader(`${t("analyzePage.aiReminderEngine")}`);

        const headers = [
          t("analyzePage.event"),
          t("analyzePage.reminderDate"),
          t("analyzePage.action"),
        ];
        const rows = creditData.reminders.map((r) => [
          r.event,
          r.reminderDate,
          r.action,
        ]);
        drawTable(headers, rows, "aireminder");
        y -= 10;
      }
      // Save and download
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (
        referrer === "paymentSuccess" &&
        creditData?.isEmailSent === false &&
        data?.data?.ispro &&
        isReportSent === false
      ) {
        await sendMail(blob);
        return;
      }
      saveAs(blob, "Credit_Report.pdf");
    } catch (error) {
      console.log("error", error);
    }
  };

  const sendMail = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "Credit_Report.pdf");
    formData.append("reportId", creditData?._id ? creditData?._id : "");

    try {
      const token = await getToken({ template: "hasura" });
      const { status } = await axios.post(
        `${import.meta.env.VITE_API_URL}/sendreport`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 200) {
        toast.success("Report sent successfully to your email.");
        setIsReportSent(true);
      }
      // console.log("Uploaded successfully", response.data);
    } catch (err) {
      // console.error("Upload failed", err);
    }
  };

  const handleDrag = (e) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
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
    if (!isSignedIn) {
      openSignIn();
      return;
    }
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
    setPaymentStatus("false");
    dispatch(resetData());
    // localStorage.removeItem("creditReport");
  };

  const onUnlock = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const hasCreditData = creditData && Object.keys(creditData).length > 0;
    const reportId = creditData?._id;

    if (!hasCreditData) {
      toast.error("Invalid data");
      return;
    }

    try {
      const token = await getToken({ template: "hasura" });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/checkout`,
        // JSON.stringify({
        //   // userId: user?.id,
        //   reportId,
        // }),
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
    // if (referrer != "paymentSuccess") {
    console.log("patmentid", paymentId);
    const isPaymentReferrer = referrer === "paymentSuccess" && !!paymentId;
    console.log("isPaymentReferrer", isPaymentReferrer);

    let storedFile;
    storedFile = await loadFile();
    if (isPaymentReferrer === true) {
      console.log("Loaded file from IndexedDB:", storedFile);
    }
    console.log("pdfFile", pdfFile, storedFile, tmpFile);

    if (!pdfFile && !storedFile) {
      toast.error("No file selected.");
      return;
    }
    // }
    try {
      // !isPaymentReferrer && saveFile(pdfFile);
      const token = await getToken({ template: "hasura" });
      const formData = new FormData();
      formData.append("file", isPaymentReferrer ? storedFile : pdfFile);
      // formData.append("userId", user?.id ? user.id : "");
      console.log("paymentId", paymentId);

      isPaymentReferrer &&
        formData.append("paymentId", paymentId ? paymentId : "");
      dispatch(resetReportErrorAndStatus());

      if (!isPaymentReferrer) {
        saveFile(pdfFile);
        dispatch(
          fetchReport({
            formData,
            token,
            language: i18n.language,
            onProgress: (p) => dispatch(setProgress(p)),
          })
        );
      } else {
        dispatch(
          fetchPaidReport({
            formData,
            token,
            language: i18n.language,
            onProgress: (p) => dispatch(setProgress(p)),
          })
        );
        dispatch(clearPaymentId());
        localStorage.removeItem("creditReport");
      }
    } catch (error) {
      console.log("error", error);

      if (error.response && error.response.status === 400) {
        setIsReport(false);
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
      if (
        statusCode &&
        statusCode === 200 &&
        Object.keys(creditData).length === 0
      ) {
        // toast.warn("No data found!");
      }
    }
    dispatch(resetReportErrorAndStatus());
  }, [statusCode, error]);

  const getReport = async () => {
    try {
      if (isSignedIn) {
        const userId = user.id;
        dispatch(
          getReportByReportId({
            userId,
            onProgress: (p) => dispatch(setProgress(p)),
          })
        );
      }
    } catch (error) {
      setIsReport(false);
      toast.error("Failed to fetch report. Please try again later.");
    }
  };

  useEffect(() => {
    if (!isSignedIn) return;
    const savedDataRaw = localStorage.getItem("creditReport");
    let savedData = null;

    try {
      savedData = savedDataRaw ? JSON.parse(savedDataRaw) : null;
    } catch (e) {
      console.error("Failed to parse creditReport from localStorage", e);
    }

    const hasSavedData = savedData && Object.keys(savedData).length > 0;
    if (referrer === "paymentSuccess") {
      onAnalyze();
    } else if (!hasSavedData && loading === false) {
      getReport();
    }

    if (hasSavedData && loading === false) {
      const preferLanguage = localStorage.getItem("preferLanguage");
      i18n.changeLanguage(creditData.preferLanguage || preferLanguage);
      setIsReport(true);
      if (
        creditData?.preferLanguage === undefined ||
        creditData?.preferLanguage == ""
      ) {
        setcreditData({ ...savedData, preferLanguage: preferLanguage });
      } else {
        setcreditData(savedData);
      }
      localStorage.setItem("sessionId", "");
    }
    console.log("isSignedIn");
  }, [isSignedIn]);

  useEffect(() => {
    if (loading === false) dispatch(resetProgress());
    if (!data) return;

    const savedData = JSON.parse(localStorage.getItem("creditReport"));
    console.log("here1", savedData);

    const hasNoData = data?.data?.count === 0;
    const hasData = data?.data?.count > 0;

    if (hasNoData) {
      setFileName(false);
      setIsReport(false);
      setThumbnail(false);
      setcreditData({});
    }

    if (savedData && Object.keys(savedData).length > 0 && loading === false) {
      console.log("here2", savedData);

      setIsReport(true);
      setcreditData(savedData);
      localStorage.setItem("sessionId", "");
      // return;
    }

    if (hasData) {
      // localStorage.removeItem("creditReport");
      const result = data.data.result;
      setcreditData(result);
      setPaymentStatus(data.data.ispro ? "paid" : "fail");
      setIsReport(true);
      if (data.data.ispro === true) {
        inquiriesCombined = [
          ...(result?.summary?.inquiries?.hard || []),
          ...(result?.summary?.inquiries?.soft || []),
        ];
        inquiriesCombined.sort((a, b) => new Date(b.date) - new Date(a.date));
        setcreditData({
          ...result,
          inquiries: inquiriesCombined,
        });
        // localStorage.setItem(
        //   "creditReport",
        //   JSON.stringify({
        //     ...result,
        //     inquiries: inquiriesCombined,
        //   })
        // );
        clearPaymentId();
        localStorage.setItem("sessionId", result.sessionId);
        localStorage.removeItem("creditReport");
      }  
      if (
        data.data.ispro === false &&
        result?.score !== undefined &&
        location.pathname === "/analyzer"
      ) {
        localStorage.setItem("creditReport", JSON.stringify(result));
      } else if (data.data.ispro === false && result?.summary) {
        handleReset();
        toast.warning("Please reupload the file and try again!");
      }
      console.log(data.data);
      i18n.changeLanguage(result?.preferLanguage);
      // if (!isSignedIn) {
      //   localStorage.setItem(
      //     "creditReport",
      //     JSON.stringify({
      //       ...result,
      //       inquiries: inquiriesCombined,
      //     })
      //   );
      // }
    }
  }, [data]);

  useEffect(() => {
    if (
      creditData &&
      typeof creditData === "object" &&
      Object.keys(creditData).length === 0
    ) {
      return;
    }
    if (
      referrer === "paymentSuccess" &&
      creditData?.isEmailSent === false &&
      data?.data?.ispro
    ) {
      setTimeout(() => {
        generateActionPlanPDF();
      }, 5000);
    }
  }, [creditData]);

  useEffect(() => {
    if (Object.keys(creditData).length < 1) return;
    if (i18n?.language != creditData?.preferLanguage) {
      console.log("i18n.language", i18n.language);

      localStorage.removeItem("creditReport");
      handleTranslate();
    }
    localStorage.setItem("preferLanguage", i18n.language);
    // i18n.changeLanguage(selectedLanguage);
  }, [i18n.language]);

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
                  disabled={isSignedIn ? false : true}
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
                      onClick={() => {
                        !isSignedIn
                          ? openSignIn()
                          : fileInputRef.current?.click();
                      }}
                      className="cursor-pointer bg-green-600 fileUploadInput text-white px-6 py-3 mt-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      {t("analyzePage.chooseFile")}
                    </button>
                  </p>
                </label>
              </div>
              <p className="w-full max-w-3xl mx-auto text-left transition text-xs sm:text-sm mt-3">
                {t("analyzePage.acceptedFile")}
                <br />
                <br />
                {/* {t("analyzePage.privacyNote")} */}
                <div className="w-full max-w-md space-y-4">
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-green-600">
                        <img
                          src="/shield-lock.svg"
                          className="w-13 h-13 fill-green-500 mx-auto text-white"
                          alt="Security Shield"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {t("analyzePage.shieldcontent1")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("analyzePage.shieldcontent1Additional")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-green-600">
                        <ShieldCheck className="w-10 h-10 fill-green-500 mx-auto text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {" "}
                          {t("analyzePage.shieldcontent2")}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("analyzePage.shieldcontent2Additional")}
                        </p>
                      </div>
                    </div>
                    <div className="items-center">
                      <a
                        href="#"
                        className="text-blue-600 underline ml-auto text-sm"
                      >
                        {t("privacyPage.title")}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">
                      {t("analyzePage.needHelp")}
                    </h2>
                    <ul className="space-y-1 text-gray-700">
                      {helps.map((help, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600">
                            <div className="text-green-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </span>
                          <span>{help}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
                      onClick={handleReset}
                    >
                      {t("analyzePage.resetButton")}
                    </button>
                  </div>
                </>
              )}
              <>
                {Object.keys(creditData || {}).length > 0 &&
                  isReport &&
                  (paymentStatus === "fail" || paymentStatus === "false") && (
                    <TestReport
                      result={creditData}
                      onUnlock={onUnlock}
                      handleReset={handleReset}
                    />
                  )}
              </>
              <>
                {Object.keys(creditData || {}).length > 0 &&
                  isReport &&
                  paymentStatus === "paid" && (
                    <PaidReport
                      creditData={creditData}
                      chartRef={chartRef}
                      onUnlock={onUnlock}
                      handleReset={handleReset}
                      isReset={isReset}
                      paymentStatus={paymentStatus}
                      loading={loading}
                      generateActionPlanPDF={generateActionPlanPDF}
                    />
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
        <div className="relative w-full h-[300px]">
          <div
            role="status"
            aria-live="polite"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
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
            <span className="mt-4 text-center text-sm sm:text-base md:text-lg px-4">
              {t("analyzePage.analysisInProgress")} <br />
              <br />
              <ProgressBar
                completed={progress}
                maxCompleted={100}
                bgColor="#155dfc"
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyzer;
