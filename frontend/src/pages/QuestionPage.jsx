import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function QuestionPage() {
  //navigation
  const location = useLocation();
  const formData = location.state?.formData || { fname: "Anonymous", lname: "" };
  const navigate = useNavigate();

  //variables
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  
  //audio
  const audioRef = useRef(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  //function
  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit the experiment early? Your data will not be saved.")) {
      navigate("/");
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/questions");
      setQuestions(response.data);
      setStartTime(Date.now());
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

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

  // 5. UseEffects (Watchers)
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (correctCount > 0 && correctCount % 5 === 0) {
      const newSpeed = 1.0 + (Math.floor(correctCount / 5) * 0.25);
      setPlaybackSpeed(newSpeed);
      if (audioRef.current) {
        audioRef.current.playbackRate = newSpeed;
      }
    }
  }, [correctCount]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex === questions.length) {
      saveGameData();
    }
  }, [currentQuestionIndex, questions.length]);

  // 6. UI Rendering
  if (questions.length === 0) return <div>Loading...</div>;

  if (currentQuestionIndex >= questions.length) {
    const accuracy = (correctCount / questions.length) * 100;
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h2>Experiment Complete!</h2>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
        <p>Average Time: {avgTime.toFixed(2)} seconds</p>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: "600px", margin: "60px auto", padding: "40px",
      borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", textAlign: "center"
    }}>
      <audio ref={audioRef} src="http://127.0.0.1:5000/static/music.mp3" loop />
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Multiplication Task</h2>
        <button onClick={handleExit} style={{ backgroundColor: "#ff4d4d", color: "white", padding: "8px 16px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Exit Game 🛑
        </button>
      </div>

      <div style={{ marginBottom: "30px", padding: "12px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #ddd" }}>
        <button onClick={toggleMusic} style={{ marginRight: "15px", padding: "8px 16px", cursor: "pointer", borderRadius: "5px" }}>
          {isPlaying ? "Pause Music ⏸️" : "Play Music ▶️"}
        </button>
        <span style={{ color: "gray", fontWeight: "bold" }}>Current Speed: {playbackSpeed}x</span>
      </div>

      <p style={{ fontSize: "36px", fontWeight: "bold", margin: "30px 0" }}>
        {questions[currentQuestionIndex].question}
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          autoFocus
          style={{ padding: "12px", fontSize: "20px", width: "120px", textAlign: "center", marginRight: "15px", borderRadius: "5px", border: "2px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "12px 24px", fontSize: "18px", cursor: "pointer", borderRadius: "5px", backgroundColor: "#4CAF50", color: "white", border: "none" }}>
          Submit
        </button>
      </form>
      
      {feedback && (
        <p style={{ marginTop: "20px", fontSize: "16px", fontWeight: "bold", color: feedback.includes("Correct") ? "#4CAF50" : "#ff4d4d" }}>
          {feedback}
        </p>
      )}
    </div>
  );
}

export default QuestionPage;