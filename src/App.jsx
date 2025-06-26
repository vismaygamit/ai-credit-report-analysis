import React, {useEffect} from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Analyzer from "./pages/Analyzer";
import "./i18n";
import Privacypolicy from "./pages/Privacypolicy";
import Paymentsuccess from "./pages/Paymentsuccess";
import Paymentfail from "./pages/Paymentfail";

const App = () => {
  
    useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ru,uk,es,fr,ar,hi", // customize as needed
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacypolicy" element={<Privacypolicy />} />
          <Route path="/success" element={<Paymentsuccess />} />
          <Route path="/fail" element={<Paymentfail />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
