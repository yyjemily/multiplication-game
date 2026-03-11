import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormPage from "./pages/FormPage";
import QuestionPage from "./pages/QuestionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The '/' path is the default homepage */}
        <Route path="/" element={<FormPage />} />
        {/* The '/questions' path is where the game lives */}
        <Route path="/questions" element={<QuestionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
