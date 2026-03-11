import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function QuestionPage() {
  const location = useLocation();
  const formData = location.state?.formData || { fname: "Anonymous", lname: "" }; // set anonymous if user skips the setup form

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Audio references and state
  const audioRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Update music speed whenever correctCount hits a multiple of 5
  useEffect(() => {
    if (correctCount > 0 && correctCount % 5 === 0) {
      const newSpeed = 1.0 + (Math.floor(correctCount / 5) * 0.25);
      setPlaybackSpeed(newSpeed);
      
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed;
      }
    }
  }, [correctCount]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/questions");
      setQuestions(response.data);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // Function to handle the Play/Pause button
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentQuestion = questions[currentQuestionIndex];
    const timeTaken = (Date.now() - startTime) / 1000;
    setTimes((prev) => [...prev, timeTaken]);

    const isCorrect = answer.trim() === currentQuestion.answer;
    if (isCorrect) {
      setFeedback(`Correct! Took ${timeTaken.toFixed(2)}s.`);
      setCorrectCount((prev) => prev + 1);
    } else {
      setFeedback(`Incorrect. Answer: ${currentQuestion.answer}.`);
    }

    setAnswer("");
    setCurrentQuestionIndex((prev) => prev + 1);
    setStartTime(Date.now());
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === questions.length) {
      saveGameData();
    }
  }, [currentQuestionIndex, questions.length]);

  const saveGameData = async () => {
    const accuracy = (correctCount / questions.length) * 100;
    try {
      await axios.post("http://127.0.0.1:5000/api/save_result", {
        firstName: formData.fname || "Anonymous",
        lastName: formData.lname || "",
        accuracy: accuracy,
        times: times
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  if (currentQuestionIndex >= questions.length) {
    const accuracy = (correctCount / questions.length) * 100;
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    return (
      <div style={{ padding: "20px" }}>
        <h2>Experiment Complete!</h2>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
        <p>Average Time: {avgTime.toFixed(2)} seconds</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {/* Points directly to the static folder on your Flask server */}
      <audio ref={audioRef} src="http://127.0.0.1:5000/static/music.mp3" loop />
      
      <h1>Multiplication Task</h1>
      
      <div style={{ marginBottom: "20px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
        <button onClick={toggleMusic} style={{ marginRight: "15px", padding: "8px 16px" }}>
          {isPlaying ? "Pause Music ⏸️" : "Play Music ▶️"}
        </button>
        <span style={{ color: "gray" }}>Current Speed: {playbackSpeed}x</span>
      </div>

      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{questions[currentQuestionIndex].question}</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter answer"
          autoFocus
        />
        <button type="submit">Submit</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
}

export default QuestionPage;