import React from "react";
import "./App.css"; // Ensure you have Tailwind CSS imported
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Analyzer from "./pages/Analyzer";
import Test from "./pages/test";
import "./i18n"

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/test" element={<Test />} />
          {/* Add more routes here as needed */}
        </Routes>
      </Layout>
     </Router>
  );
};

export default App;
