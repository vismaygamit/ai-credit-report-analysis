import React, { useEffect } from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import Analyzer from "./pages/Analyzer";
import "./i18n";
import Privacypolicy from "./pages/Privacypolicy";
import Paymentsuccess from "./pages/Paymentsuccess";
import Paymentfail from "./pages/Paymentfail";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "/assets/js/chat-widget.js";
      script.async = true;
      document.body.appendChild(script);

     script.onload = () => {
        console.log("Chat widget script loaded ✅");
        if (window.setName) {
          console.log("Setting name in chat widget:");
          window.setName(user?.fullName || "Guest User");
        }
      };
      return () => {
        // cleanup when component unmounts
        document.body.removeChild(script);
      };
    }
    console.log("isSignedIn:::", isSignedIn);
    
  }, [isSignedIn]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacypolicy" element={<Privacypolicy />} />
          <Route path="/success" element={<Paymentsuccess />} />
          <Route path="/fail" element={<Paymentfail />} />
          {/* <Route
            path="/analyzer"
            element={isSignedIn ? <Analyzer /> : <Home />} /> */}
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
