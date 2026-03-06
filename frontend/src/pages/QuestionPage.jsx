import React, { useState, useEffect } from "react";
import axios from "axios";

function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/questions"); // Correct endpoint
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentQuestion = questions[currentQuestionIndex];
      const response = await axios.post("http://127.0.0.1:5000/api/answer", {
        answer,
        correct_answer: currentQuestion.answer,
      });
      if (response.data.correct) {
        setFeedback("Correct!");
        setAnswer("");
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setFeedback("Incorrect. Try again.");
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    }
  };

  if (questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return <div>Congratulations! You've completed all the questions.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Question Page</h1>
      <p>{questions[currentQuestionIndex].question}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
        />
        <button type="submit">Submit</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default QuestionPage;