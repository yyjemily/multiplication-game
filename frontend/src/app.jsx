import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import QuestionPage from "./pages/QuestionPage";

// The 'export default' right here is what your error is looking for!
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </BrowserRouter>
  );
}