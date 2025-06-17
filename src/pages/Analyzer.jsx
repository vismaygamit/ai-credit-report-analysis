import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Analyzer = () => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);
  const [fileName, setFileName] = useState("");

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
    console.log("handleDrop called");

    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];

    if (!file) return;
    if (file) {
      if (isFilePDF(file)) {
        setFileName(file.name);
        showThumbail(file);
      }
    }
  };

  const handleChange = async (e) => {
    console.log("handlechange called");

    const file = e.target.files && e.target.files?.[0];

    if (!file) return;
    if (file) {
      if (isFilePDF(file)) {
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
  };
  const fileInputRef = useRef(null);

  const markdownText = `**Credit Score & Rank:**
- **VantageScore 3.0:** 609
- This score is considered **fair** or below average (it ranks around the 24th percentile, so it’s lower than most people’s scores).

**Major Negative Items:**
- **Late Payments:** There are 11 accounts with 30-day late payments and 1 with a 60-day late payment.
- **High Balances:** The balances on your credit cards are high compared to your credit limits.
- **Recent Account Activity:** Some accounts are fairly new, which can affect your score.
- **Number of Credit Checks:** There have been several credit inquiries, but these haven't significantly hurt your score.
- No bankruptcies or collections are reported.

**Breakdown of Accounts (from page 3):**
- **Revolving Accounts (like credit cards):** 15 accounts (11 have a balance)
- **Installment Loans (like auto loans):** 10 accounts (2 have a balance)
- **Mortgages:** 0 accounts
- **Other Accounts:** 4 accounts (1 has a balance)
- **Total outstanding balances:** About $32,854 on revolving (credit cards), $6,027 on installment, and $775 in other categories.

**Summary:**
You have a mix of credit cards and loans, but high credit card balances and some missed payments are bringing down your score. There are no bankruptcies or accounts in collections. Reducing credit card balances and making on-time payments can help improve the score over time.
`;
  return (
    <div className="px-4 sm:px-6 md:px-10 py-10 lg:p-12 lg:py-12 max-w-4xl mx-auto w-full">
      {!fileName && (
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
                {t("analyzePage.dragDrop")} <br /> {t("analyzePage.or")} <br />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer bg-blue-600 fileUploadInput text-white px-6 py-3 mt-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {t("analyzePage.chooseFile")}
                </button>
              </p>
            </label>
          </div>

          <p className="text-xs sm:text-sm mt-3 lg:ml-4">
            {t("analyzePage.acceptedFile")}
            <br />
            {t("analyzePage.privacyNote")}
          </p>
        </>
      )}

      {thumbnail && (
        <div className="mb-6 w-full">
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
            <p className="mt-2 text-sm text-gray-600 text-center">{fileName}</p>
          )}
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <button
              className={`px-6 py-3 rounded-lg transition font-medium ${
                fileName.length === 0
                  ? "bg-blue-300 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              disabled={fileName.length === 0}
            >
              {t("analyzePage.analyzeButton")}
            </button>
            <button
              className={`px-6 py-3 rounded-lg transition font-medium ${
                fileName.length === 0
                  ? "bg-green-300 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              disabled={fileName.length === 0}
              onClick={handleReset}
            >
              {t("analyzePage.resetButton")}
            </button>
          </div>

          <div className="mt-4 sm:mt-8 max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full p-4 sm:p-6 rounded-xl shadow-lg bg-gradient-to-br from-teal-400 to-indigo-600 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-3 sm:mb-4">
                Basic Insights
              </h2>
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Credit Score & Ranking
                  </h3>
                  <ul className="mt-1 sm:mt-2 text-xs sm:text-sm space-y-1 list-disc list-inside">
                    <li>VantageScore 2.0: 600</li>
                    <li>
                      This score is considered fair to below average, ranking in
                      the 24th percentile, meaning it falls below the majority
                      of individuals' scores.
                    </li>
                  </ul>
                   <h3 className="text-lg sm:text-xl font-bold mt-2">
                    Major Negative Items
                  </h3>
                  <ul className="mt-1 sm:mt-2 text-xs sm:text-sm space-y-1 list-disc list-inside">
                    <li>Late Payments: There are 11 accounts with 30-day late payments and 1 with a 60-day late payment.</li>
                    {/* <li>
                      This score is considered fair to below average, ranking in
                      the 24th percentile, meaning it falls below the majority
                      of individuals' scores.
                    </li> */}
                  </ul>
                   <h3 className="text-lg sm:text-xl font-bold mt-2">
                    Breakdown of Accounts (from page 3):
                  </h3>
                  <ul className="mt-1 sm:mt-2 text-xs sm:text-sm space-y-1 list-disc list-inside">
                    <li>Revolving Accounts (like credit cards): 15 accounts (11 have a balance)</li>
                    <li>
                      Installment Loans (like auto loans): 10 accounts (2 have a balance)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-center">
                <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-white font-semibold text-sm sm:text-base">
                  Unlock Personalized Insights for $100
                </button>
              </div>
              <p className="text-xs text-center mt-2 sm:mt-3 opacity-80">
                Processing Time: 2-3 mins
              </p>
            </div>
          </div>

          {/* <div className="p-4 whitespace-pre-wrap"> */}
          {/* <button onClick={handlePrompt}>Get Response</button> */}
          {/* <div className="mt-4 whitespace-pre-wrap border p-2 bg-gray-100"> */}
          {/* <div className="prose whitespace-pre-wrap">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-gray-800 leading-relaxed">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-blue-700 font-bold">
                      {children}
                    </strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside pl-5 text-gray-800 space-y-1">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  h1: ({ children }) => (
                    <h1 className="text-blue-700 font-bold text-xl">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-blue-700 font-bold text-lg">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-blue-700 font-bold text-base">
                      {children}
                    </h3>
                  ),
                }}
              >
                {markdownText}
              </ReactMarkdown>
            </div> */}
          {/* </div> */}
          {/* </div> */}
          {/* <div className="relative opacity-50 pointer-events-none">
  jhjhfg
</div>
<div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center">
  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700">
    Unlock with Pro
  </button>
</div> */}
        </div>
      )}
    </div>
  );
};

export default Analyzer;
