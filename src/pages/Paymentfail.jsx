import React from "react";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Paymentfail = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-fit flex items-center justify-center py-12">
      <div className="p-8 rounded-2xl shadow-lg bg-red-50 text-center max-w-md w-full">
        <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h1>
        <p className="text-sm text-gray-500">
          You will be redirected to the home page shortly.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm text-red-600 hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Paymentfail;
