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
  translateObject,
} from "../store/reportSlice";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import * as fontkit from "fontkit";
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
  const dispatch = useDispatch();
  const { data, loading, translated, error, statusCode } = useSelector(
    (state) => state.report
  );
  let inquiriesCombined = [];
  const chartRef = useRef();
  const disputeRef = useRef();
  const goodWillRef = useRef();
  const [chartImage, setChartImage] = useState(null);
  // const [result, setResult] = useState(data?.data);
  const [creditData, setcreditData] = useState({});
  const [isReset, setIsReset] = useState(false);
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
  const fileInputRef = useRef(null);
  const location = useLocation();
  const referrer = location.state?.from;
  const { isSignedIn, user } = useUser();
  const [paymentStatus, setPaymentStatus] = useState("false");

  const handleTranslate = async () => {
    try {
      let creditReportFortranslate = creditData;
      // if (i18n.language != "en") {
      //   creditReportFortranslate = JSON.parse(localStorage.getItem("creditReportFortranslate"));
      // }

      dispatch(
        translateObject({
          object: creditReportFortranslate,
          targetLanguage: i18n.language,
        })
      );
      // localStorage.setItem("selectedLanguage", "");
    } catch (error) {
      console.error("Translation failed", error);
    }
  };

  const exportChartAsImage = async () => {
    const svg = chartRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

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

      // Scale proportionally
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      // ctx.scale(scaleFactor, scaleFactor); // This keeps correct proportions

      ctx.drawImage(img, 0, 0, width, height); // Keep image in bounds

      const base64Image = canvas.toDataURL("image/png");
      setChartImage(base64Image);

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  useEffect(() => {
    if (translated) {
      setcreditData(translated);
      if (isSignedIn) {
        setTimeout(() => {
          exportChartAsImage();
        }, 4000);
      }
    }
  }, [translated]);

  const generateActionPlanPDF = async () => {
    try {
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

      drawText(`${summary.score} (${summary.rating})`);
      drawSubHeading(`${t("analyzePage.tradelines")}:`);
      drawSubHeading(
        `${t("analyzePage.revolving")} ${t("analyzePage.accounts")}:`
      );
      summary.tradelines.revolving.forEach((t) => drawText(`• ${t}`));
      drawSubHeading(
        `${t("analyzePage.installment")} ${t("analyzePage.accounts")}:`
      );
      summary.tradelines.installment.forEach((t) => drawText(`• ${t}`));
      drawSubHeading(`${t("analyzePage.open")} ${t("analyzePage.accounts")}:`);
      summary.tradelines.open.forEach((t) => drawText(`• ${t}`));
      drawSubHeading(`${t("analyzePage.mortgage")}:`);
      summary.tradelines.mortgage.forEach((t) => drawText(`• ${t}`));
      y -= 10;
      drawText(
        `${t("analyzePage.paymentHistory")}: ${
          creditData.summary.paymentHistory.allCurrent
            ? t("analyzePage.allCurrent")
            : t("analyzePage.issuesDetected")
        } ${summary.paymentHistory.missedOrLatePast24Months} ${t(
          "analyzePage.missedLate24Months"
        )}`
      );
      drawText(
        `${t("analyzePage.onTimePayments")}: ${
          creditData.scoreProgress.creditSummary.onTimePayments
        }`
      );
      if (
        creditData.securedLoan &&
        typeof creditData.securedLoan === "object"
      ) {
        const loan = creditData.securedLoan;
        drawWrappedText(
          `${t("analyzePage.securedLoan")}: ${loan.lender} | ${t(
            "analyzePage.registered"
          )}: ${loan.registered} | ${t("analyzePage.amount")}: $${
            loan.amount
          } | ${t("analyzePage.maturity")}: ${loan.maturity}`,
          font,
          fontSize
        );
      }
      drawText(
        `${t("analyzePage.goodStanding")} ${
          creditData.scoreProgress.creditSummary.activeAccounts
        }`
      );
      drawText(
        `${t("analyzePage.derogatoryMarks")} ${
          creditData.scoreProgress.creditSummary.derogatoryMarks
        }`
      );

      drawSubHeading(`${t("analyzePage.inquiries")}`);
      drawText(
        `${t("analyzePage.hardInquiries")}: ${summary.inquiries.hard?.length}`
      );
      drawText(
        `${t("analyzePage.softInquiries")}: ${summary.inquiries.soft?.length}`
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
      drawSubHeading(`${t("analyzePage.collections")} :`);
      drawText(`${summary.collections}`);
      drawSubHeading(`${t("analyzePage.judgments")} :`);

      drawText(`${summary.judgments}`);

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
          acc.status === "open"
            ? t("analyzePage.open")
            : acc.status === "closed"
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
          t("analyzePage.type"),
          t("analyzePage.affectsScore"),
        ];
        const rows = creditData.inquiries.map((i) => [
          i.date,
          i.lender,
          i.type === "soft"
            ? t("analyzePage.soft")
            : i.type === "hard"
            ? t("analyzePage.hard")
            : t("analyzePage.na"),
          i.affectsScore === true
            ? t("analyzePage.yes")
            : i.affectsScore === false
            ? t("analyzePage.no")
            : t("analyzePage.na"),
        ]);
        drawTable(headers, rows);
        y -= 10;
      }

      if (creditData.accountsAndBalances?.length) {
        drawSectionHeader(`${t("analyzePage.creditEvaluation")}`);
        const headers = [t("analyzePage.metric"), t("analyzePage.analysis")];
        const rows = Object.entries(creditData.creditEvaluation).map(
          ([key, value], i) => [
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
          ]
        );
        drawTable(headers, rows);
        y -= 20;
      }

      if (creditData.scoreForecast?.length) {
        drawSectionHeader(`${t("analyzePage.scoreForecast")}`);
        const headers = [
          t("analyzePage.action"),
          t("analyzePage.impact"),
          t("analyzePage.timeline"),
          t("analyzePage.priority"),
          t("analyzePage.confidence"),
        ];
        const rows = creditData.scoreForecast.map((f) => [
          f.action,
          f.estimatedImpact,
          f.timeline,
          f.priority,
          f.confidence,
        ]);
        drawTable(headers, rows);
        y -= 20;
      }

      if (creditData.actionPlan?.length) {
        drawSectionHeader(`${t("analyzePage.aiActionPlan")}`);
        const headers = [
          t("analyzePage.recommendation"),
          t("analyzePage.description"),
          t("analyzePage.priority"),
          t("analyzePage.timeline"),
        ];
        const rows = creditData.actionPlan.map((a) => [
          a.recommendation,
          a.description,
          a.priority,
          a.timeline,
        ]);
        drawTable(headers, rows, "actionPlan");
        y -= 10;
      }

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
      saveAs(blob, "Credit_Report.pdf");
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
        toast.warn("No data found!");
      }
    }
    dispatch(resetReportErrorAndStatus());
  }, [statusCode, error]);

  const getReport = async () => {
    try {
      if (isSignedIn) {
        dispatch(getReportByReportId(user.id));
      }
    } catch (error) {
      setIsReport(false);
      toast.error("Failed to fetch report. Please try again later.");
    }
  };

  useEffect(() => {
  if (!isSignedIn) return;

  console.log("referrer:", referrer);

  const savedDataRaw = localStorage.getItem("creditReport");
  let savedData = null;

  try {
    savedData = savedDataRaw ? JSON.parse(savedDataRaw) : null;
  } catch (e) {
    console.error("Failed to parse creditReport from localStorage", e);
  }

  const hasSavedData = savedData && Object.keys(savedData).length > 0;

  if (referrer === "paymentSuccess") {
    getReport();
  } else if (!hasSavedData && loading === false) {
    getReport();
  }

  if (hasSavedData && loading === false) {
    setIsReport(true);
    setcreditData(savedData);
  }
}, [isSignedIn]);


  useEffect(() => {
    if (!data) return;

    const savedData = JSON.parse(localStorage.getItem("creditReport"));

    const hasNoData = data?.data?.count === 0;
    const hasData = data?.data?.count > 0;

    if (hasNoData) {
      setFileName(false);
      setIsReport(false);
      setThumbnail(false);
      setcreditData({});
    }

    if (savedData && Object.keys(savedData).length > 0 && loading === false) {
      setIsReport(true);
      setcreditData(savedData);
    }

    if (hasData) {
      const result = data.data.result;
      setcreditData(result);
      setPaymentStatus(data.data.ispro ? "paid" : "fail");
      setIsReport(true);
      inquiriesCombined = [
        ...(result.summary.inquiries.hard || []),
        ...(result.summary.inquiries.soft || []),
      ];
      inquiriesCombined.sort((a, b) => new Date(b.date) - new Date(a.date));
      setcreditData({
        ...result,
        inquiries: inquiriesCombined,
      });
      if (!isSignedIn) {
        localStorage.setItem(
          "creditReport",
          JSON.stringify({
            ...result,
            inquiries: inquiriesCombined,
          })
        );
      }
      if (isSignedIn) {
        localStorage.removeItem("creditReport");
        // if (i18n.language === "en") {
        // localStorage.setItem("creditReportFortranslate", JSON.stringify(result))
        // }
        setTimeout(() => {
          exportChartAsImage();
        }, 4000);
      }
    }
  }, [data]);

  useEffect(() => {
    if (Object.keys(creditData).length > 0) {
      handleTranslate();
    }
    // i18n.changeLanguage(selectedLanguage);
  }, [i18n?.language]);

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
                            {t("analyzePage.creditSummary")}
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-1">
                            <div>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.score")}:{" "}
                                </span>
                                <span className="pr-1">
                                  {creditData?.summary.score ??
                                    t("analyzePage.none")}
                                </span>
                                {creditData?.summary.rating ?? ""}
                              </p>
                              <h3 className="font-semibold text-xl">
                                {t("analyzePage.tradelines")}:
                              </h3>
                              <ul className="list-disc list-inside space-y-2">
                                <li>
                                  <span className="font-semibold text-xl">
                                    {t("analyzePage.revolving")} (
                                    {creditData?.summary.tradelines.revolving
                                      ?.length || 0}{" "}
                                    {t("analyzePage.accounts")}):
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
                                                    account.includes(
                                                      t("analyzePage.close")
                                                    )
                                                      ? t("analyzePage.close")
                                                      : t("analyzePage.open")
                                                  })`
                                                : t(
                                                    "analyzePage.availableAfterPayment"
                                                  )
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()} (${
                                                  account.includes(
                                                    t("analyzePage.close")
                                                  )
                                                    ? t("analyzePage.close")
                                                    : t("analyzePage.open")
                                                })`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li>{t("analyzePage.none")}</li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    {t("analyzePage.installment")} (
                                    {creditData?.summary.tradelines.installment
                                      ?.length || 0}{" "}
                                    {t("analyzePage.accounts")}
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
                                                : t(
                                                    "analyzePage.availableAfterPayment"
                                                  )
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">
                                        {t("analyzePage.none")}
                                      </li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    {t("analyzePage.open")} (
                                    {creditData?.summary.tradelines.open
                                      ?.length || 0}{" "}
                                    {t("analyzePage.accounts")}
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
                                                : t(
                                                    "analyzePage.availableAfterPayment"
                                                  )
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">
                                        {t("analyzePage.none")}
                                      </li>
                                    )}
                                  </ul>
                                </li>
                                <li>
                                  <span className="font-semibold text-xl">
                                    {t("analyzePage.mortgage")} (
                                    {creditData?.summary.tradelines.mortgage
                                      ?.length || 0}{" "}
                                    {t("analyzePage.accounts")}
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
                                                : t(
                                                    "analyzePage.availableAfterPayment"
                                                  )
                                              : `${account
                                                  .split("(")[0]
                                                  .trim()}`}
                                          </li>
                                        )
                                      )
                                    ) : (
                                      <li className="p-1">
                                        {t("analyzePage.none")}
                                      </li>
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.paymentHistory")}:{" "}
                                </span>
                                {creditData?.summary.paymentHistory
                                  ? `${
                                      creditData.summary.paymentHistory
                                        .allCurrent
                                        ? t("analyzePage.allCurrent")
                                        : t("analyzePage.issuesDetected")
                                    } (${
                                      creditData.summary.paymentHistory
                                        .missedOrLatePast24Months
                                    } ${t("analyzePage.missedLate24Months")})`
                                  : t("analyzePage.none")}
                              </p>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.onTimePayments")}:{" "}
                                </span>
                                {creditData?.scoreProgress.creditSummary
                                  ? `${creditData.scoreProgress.creditSummary.onTimePayments}`
                                  : t("analyzePage.none")}
                              </p>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.securedLoan")}:
                                </span>{" "}
                                {creditData?.securedLoan?.lender
                                  ? `${creditData.securedLoan.lender} - ${t(
                                      "analyzePage.registered"
                                    )}:
                                    ${creditData.securedLoan.registered}
                                 , ${t("analyzePage.amount")}: ${
                                      creditData.securedLoan?.amount
                                        ? "$" + creditData.securedLoan?.amount
                                        : t("analyzePage.na")
                                    }, ${t("analyzePage.maturity")}: ${
                                      creditData.securedLoan.maturity
                                    }`
                                  : t("analyzePage.none")}
                              </p>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.goodStanding")}:{" "}
                                </span>
                                {creditData?.scoreProgress.creditSummary
                                  ? `${creditData.scoreProgress.creditSummary.activeAccounts}`
                                  : t("analyzePage.none")}
                              </p>
                              <p>
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.derogatoryMarks")}:{" "}
                                </span>
                                {creditData?.scoreProgress.creditSummary
                                  ? `${creditData.scoreProgress.creditSummary.derogatoryMarks}`
                                  : t("analyzePage.none")}
                              </p>
                              <p className="mt-2">
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.collections")}:{" "}
                                </span>
                                {creditData?.summary.collections !== undefined
                                  ? creditData.summary.collections
                                  : t("analyzePage.none")}
                              </p>
                              <p className="mt-1">
                                <span className="font-semibold text-xl">
                                  {t("analyzePage.judgments")}:{" "}
                                </span>
                                {creditData?.summary.judgments !== undefined
                                  ? creditData.summary.judgments
                                  : t("analyzePage.none")}
                              </p>
                              <h3 className="font-semibold mb-1 text-xl">
                                {t("analyzePage.inquiries")}:
                                {/* ({creditData?.summary.inquiries.total || "0"}): */}
                              </h3>
                              <ul className="list-disc list-inside space-y-2">
                                <li className="p-1">
                                  {t("analyzePage.hardInquiries")}:{" "}
                                  {creditData?.summary.inquiries.hard?.length >
                                  0
                                    ? creditData.summary.inquiries.hard.length
                                    : t("analyzePage.none")}{" "}
                                </li>
                                <li className={`p-1`}>
                                  {t("analyzePage.softInquiries")}:{" "}
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
                                        ? creditData.summary.inquiries.soft
                                            ?.length
                                        : t("analyzePage.availableAfterPayment")
                                      : t("analyzePage.none")}
                                  </span>
                                </li>
                              </ul>
                              <h3 className="font-semibold text-xl">
                                {t("analyzePage.creditUtilization")}:
                              </h3>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="p-1">
                                  {t("analyzePage.totalLimit")}:{" "}
                                  {creditData?.summary?.creditUtilization
                                    ?.totalLimit
                                    ? `$${creditData?.summary?.creditUtilization?.totalLimit?.toLocaleString()}`
                                    : t("analyzePage.none")}
                                </li>
                                <li className={`p-1`}>
                                  {t("analyzePage.totalBalance")}:{" "}
                                  <span
                                    className={`${
                                      paymentStatus === "paid" && !isReset
                                        ? ""
                                        : "bg-gray-200 italic text-gray-400"
                                    }`}
                                  >
                                    {creditData?.summary?.creditUtilization
                                      ?.totalBalance
                                      ? paymentStatus === "paid" && !isReset
                                        ? `$${creditData.summary.creditUtilization.totalBalance.toLocaleString()}`
                                        : t("analyzePage.availableAfterPayment")
                                      : t("analyzePage.none")}
                                  </span>
                                </li>
                                <li className="p-1">
                                  {t("analyzePage.utilizationRate")}:{" "}
                                  {creditData?.summary?.creditUtilization
                                    ?.utilizationRate
                                    ? `${creditData.summary.creditUtilization.utilizationRate}% ✅ ${creditData.summary.creditUtilization.rating}`
                                    : t("analyzePage.none")}
                                </li>
                              </ul>
                              <h3 className="font-semibold mt-1 text-xl">
                                {t("analyzePage.creditAge")}:
                              </h3>
                              <ul className="list-disc list-inside space-y-1">
                                <li className="p-1">
                                  {t("analyzePage.oldestAccount")}:{" "}
                                  {creditData?.summary?.creditAge?.oldest
                                    .account
                                    ? `${
                                        creditData.summary.creditAge.oldest
                                          .account
                                      } (Opened ${new Date(
                                        creditData.summary.creditAge.oldest.opened
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                      })})`
                                    : t("analyzePage.none")}
                                </li>
                                <li className="p-1">
                                  {t("analyzePage.newestAccount")}:{" "}
                                  <span
                                    className={`${
                                      paymentStatus === "paid" && !isReset
                                        ? ""
                                        : "bg-gray-200 italic text-gray-400"
                                    }`}
                                  >
                                    {creditData?.summary?.creditAge?.newest
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
                                        : t("analyzePage.availableAfterPayment")
                                      : t("analyzePage.none")}
                                  </span>
                                </li>
                                <li className="p-1">
                                  {t("analyzePage.averageAge")}:{" "}
                                  {creditData?.summary?.creditAge
                                    ?.averageAgeYears
                                    ? `${
                                        creditData.summary.creditAge
                                          .averageAgeYears
                                      } ${t("analyzePage.years")}`
                                    : t("analyzePage.none")}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold">
                            {t("analyzePage.structuredData")}
                          </h2>
                          <h3 className="text-xl font-semibold mt-1">
                            {t("analyzePage.accountsAndBalances")}
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                  <th className="text-left p-2">
                                    {t("analyzePage.type")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.lender")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.openDate")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.limit")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.balance")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.status")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.closed")}
                                  </th>
                                  <th className="text-left p-2">
                                    {t("analyzePage.pastDue")}
                                  </th>
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
                                            {t(
                                              "analyzePage.availableAfterPayment"
                                            )}
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
                                              : t("analyzePage.na")}
                                          </td>
                                          <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                            {account.lender ||
                                              t("analyzePage.na")}
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
                                              : t("analyzePage.na")}
                                          </td>
                                          <td className="p-2">
                                            {account.balance
                                              ? `$${account.balance.toLocaleString()}`
                                              : "$0"}
                                          </td>
                                          <td className="p-2">
                                            {account.status === "open"
                                              ? t("analyzePage.open")
                                              : account.status === "closed"
                                              ? t("analyzePage.closed")
                                              : account.status ||
                                                t("analyzePage.na")}
                                          </td>
                                          <td className="p-2">
                                            {account.closed
                                              ? t("analyzePage.yes")
                                              : t("analyzePage.no")}
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
                                      {t("analyzePage.none")}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold">
                            {t("analyzePage.inquiryRecords")}
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.date")}
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.lender")}
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.type")}
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.affectsScore")}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(creditData?.inquiries) &&
                                creditData.inquiries.length > 0 ? (
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
                                          {t(
                                            "analyzePage.availableAfterPayment"
                                          )}
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
                                          {inq.lender || t("analyzePage.na")}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {inq.type === "soft"
                                            ? t("analyzePage.soft")
                                            : t("analyzePage.hard") ||
                                              t("analyzePage.na")}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {typeof inq.affectsScore === "boolean"
                                            ? inq.affectsScore
                                              ? t("analyzePage.yes")
                                              : t("analyzePage.no")
                                            : t("analyzePage.na")}
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
                                      {t("analyzePage.none")}
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4">
                          <h2 className="text-2xl font-semibold mb-2">
                            {t("analyzePage.creditEvaluation")}
                          </h2>
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                              <thead>
                                <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.metric")}
                                  </th>
                                  <th className="p-3 text-left text-xs font-medium text-slate-600 tracking-wider">
                                    {t("analyzePage.analysis")}
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
                                          {t(
                                            "analyzePage.availableAfterPayment"
                                          )}
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
                                          {/* {metric
                                            ? metric.charAt(0).toUpperCase() +
                                              metric.slice(1)
                                            : t("analyzePage.na")} */}
                                          {i === 0
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
                                            : ""}
                                        </td>
                                        <td className="p-3 text-sm text-slate-700 whitespace-nowrap">
                                          {analysis || t("analyzePage.none")}
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
                                      {t("analyzePage.none")}
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
                            {t("analyzePage.scoreForecast")}
                          </h2>
                          <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                            <thead>
                              <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                <th className="text-left p-2">
                                  {t("analyzePage.action")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.impact")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.timeline")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.priority")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.confidence")}
                                </th>
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
                                        {t("analyzePage.availableAfterPayment")}
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
                                        {forecast.action || t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.estimatedImpact ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.timeline ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.priority ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.confidence ||
                                          t("analyzePage.na")}
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
                                    {t("analyzePage.none")}
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
                            {t("analyzePage.aiActionPlan")}
                          </h2>
                          <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                            <thead>
                              <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                <th className="text-left p-2">
                                  {t("analyzePage.recommendation")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.description")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.priority")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.timeline")}
                                </th>
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
                                        {t("analyzePage.availableAfterPayment")}
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
                                        {forecast.recommendation ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.description ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.priority ||
                                          t("analyzePage.na")}
                                      </td>
                                      <td className="p-2">
                                        {forecast.timeline ||
                                          t("analyzePage.na")}
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
                                    {t("analyzePage.none")}
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
                            {t("analyzePage.dispute")} &{" "}
                            {t("analyzePage.removal") +
                              " " +
                              t("analyzePage.toolkit")}
                          </h2>
                          <h3 className="text-xl font-semibold mb-2">
                            {t("analyzePage.dispute") +
                              " " +
                              t("analyzePage.letter")}
                          </h3>
                          <div className="bg-white border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap">
                            {creditData?.disputeToolkit?.disputeLetter ? (
                              <p ref={disputeRef}>
                                {creditData?.disputeToolkit.disputeLetter}
                              </p>
                            ) : (
                              <p>{t("analyzePage.none")}</p>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-2">
                            {t("analyzePage.goodwill") +
                              " " +
                              t("analyzePage.removal") +
                              " " +
                              t("analyzePage.letter")}
                          </h3>
                          <div
                            className={`${
                              paymentStatus === "paid" && !isReset
                                ? "bg-white"
                                : "text-gray-400 bg-gray-200 italic text-center"
                            } border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap`}
                          >
                            <span ref={goodWillRef}>
                              {creditData?.disputeToolkit?.goodwillScript
                                ? paymentStatus === "paid" && !isReset
                                  ? creditData.disputeToolkit.goodwillScript
                                  : t("analyzePage.availableAfterPayment")
                                : t("analyzePage.none")}
                            </span>
                          </div>
                        </div>
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 overflow-x-auto">
                          <h2 className="text-2xl font-semibold">
                            {t("analyzePage.scoreProgressTracker")}
                          </h2>
                          <h3 className="text-lg font-semibold">
                            {t("analyzePage.scoreSimulator")}
                          </h3>
                          <table className="w-full min-w-[600px] text-sm border-collapse rounded-xl overflow-hidden shadow-sm">
                            <thead>
                              <tr className="border-b bg-slate-100 text-slate-600 uppercase tracking-wide text-xs font-semibold">
                                <th className="text-left p-2">
                                  {t("analyzePage.scenario")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.description")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.scoreChange")}
                                </th>
                                <th className="text-left p-2">
                                  {t("analyzePage.impact")}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {creditData?.scoreProgress?.scoreSimulator
                                ?.length > 0 ? (
                                creditData.scoreProgress.scoreSimulator.map(
                                  (scenario, i) =>
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
                                          {t(
                                            "analyzePage.availableAfterPayment"
                                          )}
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
                                          {scenario.scenario ||
                                            t("analyzePage.na")}
                                        </td>
                                        <td className="p-2">
                                          {scenario.description ||
                                            t("analyzePage.na")}
                                        </td>
                                        <td className="p-2">
                                          {scenario.projectedScoreChange ||
                                            t("analyzePage.na")}
                                        </td>
                                        <td className="p-2">
                                          {scenario.impactType ||
                                            t("analyzePage.na")}
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
                                    {t("analyzePage.none")}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div className="p-4 overflow-x-auto">
                          <h3 className="text-lg font-semibold mb-4">
                            {t("analyzePage.actionChecklist")}
                          </h3>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {creditData?.scoreProgress?.checklist ? (
                              Object.values(
                                creditData.scoreProgress.checklist
                              ).map((item, i) => {
                                const desc = item?.desc ?? t("analyzePage.na");
                                const istrue = item?.istrue ?? false;

                                if (
                                  i > 2 &&
                                  (paymentStatus !== "paid" || isReset)
                                ) {
                                  return (
                                    <li
                                      key={i}
                                      className="bg-gray-200 italic text-gray-400 col-span-1 sm:col-span-2 p-4 text-sm"
                                      aria-label="Restricted checklist item"
                                    >
                                      {t("analyzePage.availableAfterPayment")}
                                    </li>
                                  );
                                }

                                return (
                                  <li
                                    key={i}
                                    className={`flex items-center gap-3 p-4 rounded-lg border shadow-sm ${
                                      istrue
                                        ? "bg-gradient-to-r from-white to-blue-50 border-blue-200"
                                        : "bg-slate-50 border-slate-200"
                                    }`}
                                  >
                                    <span>
                                      {istrue ? (
                                        <svg
                                          className="w-8 h-8 text-green-500 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 11.917 9.724 16.5 19 7.5"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          className="w-8 h-8 text-red-500 dark:text-white"
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18 17.94 6M18 18 6.06 6"
                                          />
                                        </svg>
                                      )}
                                    </span>
                                    <span className="text-sm">{desc}</span>
                                  </li>
                                );
                              })
                            ) : (
                              <li className="col-span-2 p-4 text-sm text-slate-700">
                                {t("analyzePage.none")}
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* ref={chartRef} */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            {t("analyzePage.progressProjection")}
                          </h3>
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
                      </section>

                      <section className="space-y-0 border border-slate-200 shadow-lg mt-4 rounded-md">
                        <div className="p-4 overflow-x-auto w-full max-w-full">
                          <h2 className="text-2xl font-semibold">
                            {t("analyzePage.aiReminderEngine")}
                          </h2>
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
                                          {t(
                                            "analyzePage.availableAfterPayment"
                                          )}
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
                                          {reminder.event ||
                                            t("analyzePage.na")}
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
                                          {reminder.action ||
                                            t("analyzePage.na")}
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
                                      {t("analyzePage.none")}
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
