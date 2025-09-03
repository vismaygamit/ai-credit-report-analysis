import React, { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route
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
      const widgetScript = document.createElement("script");
      widgetScript.type = "module";
      widgetScript.src = "/assets/js/chat-widget.js";

      widgetScript.onload = async () => {
        localStorage.setItem("uid", user.id);
        localStorage.setItem("SOCKET_URL", import.meta.env.VITE_SOCKET_URL);
        window.updateTokenAndReconnect();
        if (window.setName) {
          window.setName(user?.fullName || "Guest User");
        }
      };

      document.body.appendChild(widgetScript);
      return () => {
        const widgetScript = document.querySelector(
          'script[src="/assets/js/chat-widget.js"]'
        );
        if (widgetScript) {
          document.body.removeChild(widgetScript);
        }
      };
    }
  }, [isSignedIn, user?.fullName]);

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
