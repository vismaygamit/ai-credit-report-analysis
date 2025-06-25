import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Paymentsuccess = () => {
  const navigate = useNavigate();
  const [sessionDetails, setSessionDetails] = useState({});

  const handleDownload = () => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [34, 197, 94]; // Tailwind's green-500
    const grayText = [100, 100, 100];

    // Optional: Add a logo (if you have one)
    doc.addImage("/assets/logo.png", "PNG", 80, 10, 50, 15);

    // Title
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
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

    // Save the PDF
    doc.save("payment_receipt.pdf");
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
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/paymentdetails?session_id=${sessionId}`
        );
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

        <Link to="/" className="mt-6 inline-block text-sm hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Paymentsuccess;
