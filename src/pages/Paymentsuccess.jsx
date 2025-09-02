import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const Paymentsuccess = () => {
  const navigate = useNavigate();
  const [sessionDetails, setSessionDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDownload = async () => {
    const doc = new jsPDF();
   
    // Colors
    const primaryColor = [34, 197, 94]; // Tailwind's green-500
    const grayText = [100, 100, 100];

    // Optional: Add a logo (if you have one)
    doc.addImage("/assets/logo.png", "PNG", 80, 10, 50, 15);

    // Title
    doc.setFontSize(22);
    // doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Successful", 70, 35);

    doc.setFontSize(13);
    doc.setTextColor(...grayText);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your purchase!", 80, 45);

    // Line separator
    doc.setDrawColor(230);
    doc.line(20, 40, 190, 40);

    // Payment Details
    doc.setFontSize(12);
    doc.setTextColor(60);
    const labels = [
      ["Date:", new Date().toLocaleDateString()],
      ["Transaction Id:", sessionDetails.payment_intent],
      ["Email:", sessionDetails.customer_details?.email],
      ["Amount Paid:", `$${(sessionDetails.amount_total / 100).toFixed(2)}`],
      ["Status:", sessionDetails.payment_status],
    ];

    let y = 55;
    labels.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 55, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 150, y, { align: "right" });
      y += 10;
    });

    // Line separator
    doc.setDrawColor(230);
    doc.line(20, y, 190, y);

    // Footer
    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(130);
    doc.text(
      "This receipt was generated automatically. No signature is required.",
      50,
      y
    );
    const pdfBlob = doc.output("blob");
    await sendMail(pdfBlob);
    // Save the PDF
    // doc.save("payment_receipt.pdf");
  };

  const sendMail = async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "Payment_Receipt.pdf");

    try {
      const token = await getToken({ template: "hasura" });
      await axios.post(
        `${import.meta.env.VITE_API_URL}/sendreceipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Uploaded successfully", response.data);
    } catch (err) {
      // console.error("Upload failed", err);
    }
  };

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const sessionId = new URLSearchParams(window.location.search).get(
        "session_id"
      );
      if (!sessionId) {
        navigate("/");
        return;
      }
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/paymentdetails?session_id=${sessionId}`
        );
        setIsLoading(false);
        setSessionDetails(data);
      } catch (error) {
        console.error("Error fetching session details:", error);
        navigate("/");
      }
    };

    fetchSessionDetails();
  }, []);

  useEffect(() => {
    if (!sessionDetails || Object.keys(sessionDetails).length === 0) return;
    const timer = setTimeout(() => {
      handleDownload();
    }, 2000);
    return () => clearTimeout(timer);
  }, [sessionDetails]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/analyzer", { state: { from: "paymentSuccess" } });
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-fit flex items-center justify-center py-12">
      {isLoading && (
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
      {!isLoading && (
        <div className="p-8 rounded-2xl shadow-lg bg-green-50 text-center max-w-md w-full">
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Payment Successful
          </h1>
          <p className="text-gray-600 mb-4">Thank you for your purchase!</p>
          <p className="text-gray-600 mb-4">
            Transaction Number: {sessionDetails.payment_intent}
          </p>
          <div className="text-sm text-left mt-6 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Date:</span>
              <span>{new Date().toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Amount Paid:</span>
              <span>${(sessionDetails.amount_total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span className="font-medium">Status:</span>
              <span>{sessionDetails.payment_status || "N/A"}</span>
            </div>
            <div className="text-gray-600 text-center">
              You will be redirected to the analysis page shortly.
            </div>
          </div>

          <Link to="/analyzer" className="mt-6 inline-block text-sm hover:underline">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Paymentsuccess;
