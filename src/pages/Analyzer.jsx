import React, { useState } from "react";
import { toast } from "react-toastify";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Analyzer = () => {
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

  return (
    <>
      <div className="px-4 py-6 sm:px-6 md:px-10 md:py-10 m-4 max-w-4xl mx-auto">
        {!fileName && (
          <div
            className={`border-2 border-dashed rounded-2xl px-4 py-8 sm:px-6 sm:py-10 text-center transition ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } min-h-[200px] sm:min-h-[250px] md:min-h-[300px]`}
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
            />
            <label
              htmlFor="fileUploadInput"
              className="cursor-pointer block my-8 sm:my-12 md:my-20"
            >
              <p className="text-gray-500 text-sm sm:text-base">
                Drag & drop file here or click to upload
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Accepted: Only PDF files up to 10MB are allowed.
              </p>
            </label>
          </div>
        )}

        {thumbnail && (
          <div className="mt-4">
            <h2 className="text-3xl font-semibold mb-2 text-center">Preview</h2>
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
            <div className="mt-6 flex justify-center gap-4 flex-wrap">
              <button
                className={`px-6 py-3 rounded-lg transition font-medium ${
                  fileName.length === 0
                    ? "bg-blue-300 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={fileName.length === 0}
              >
                Analyze
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
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Analyzer;
