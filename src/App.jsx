import React from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Analyzer from "./pages/Analyzer";
import "./i18n";
import Privacypolicy from "./pages/Privacypolicy";
import Paymentsuccess from "./pages/Paymentsuccess";
import Paymentfail from "./pages/Paymentfail";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { isSignedIn } = useUser();
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
