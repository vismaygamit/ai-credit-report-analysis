import React, { useEffect } from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Analyzer from "./pages/Analyzer";
import "./i18n";
import Privacypolicy from "./pages/Privacypolicy";
import Paymentsuccess from "./pages/Paymentsuccess";
import Paymentfail from "./pages/Paymentfail";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  function ScrollToHashElement() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
}
  const { isSignedIn } = useUser();
  return (
    <Router>
       <ScrollToHashElement />
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
