import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function QuestionPage() {
  const location = useLocation();
  const formData = location.state?.formData || { fname: "Anonymous", lname: "" };
  const navigate = useNavigate();

  const [numbers, setNumbers] = useState([]);
  const [userInputs, setUserInputs] = useState(Array(10).fill(""));
  const [phase, setPhase] = useState("memorize"); // Phases: "memorize", "input", "result"
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCorrect, setIsCorrect] = useState(null);

  // Generate 10 random numbers (0-99) on mount
  useEffect(() => {
    const randomNums = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    setNumbers(randomNums);
  }, []);

  // 10-second Timer for the memorization phase
  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft === 0) {
      setPhase("input");
    }
  }, [phase, timeLeft]);

  // Handle typed numbers
  const handleInputChange = (index, value) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  const handleSubmit = async () => {
    // Validate if the arrays match
    const correct = numbers.every((num, idx) => parseInt(userInputs[idx], 10) === num);
    setIsCorrect(correct);
    setPhase("result");

    // Play corresponding sound effects
    // Make sure you place 'correct.mp3' and 'wrong.mp3' in your frontend 'public' directory
    try {
      const audioUrl = correct ? "/correct.mp3" : "/wrong.mp3";
      const sound = new Audio(audioUrl);
      sound.play();
    } catch (err) {
      console.log("Sound could not be played.", err);
    }

    // Save to the backend
    try {
      await axios.post("http://localhost:5000/api/save", {
        fname: formData.fname,
        lname: formData.lname,
        numbers: numbers.join(","),
        inputs: userInputs.join(","),
        is_correct: correct
      });
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>Memory Game</h1>
      
      {phase === "memorize" && (
        <div>
          <h2>Memorize these numbers!</h2>
          <div style={{ fontSize: "2.5rem", margin: "30px", letterSpacing: "5px" }}>
            {numbers.join("  ")}
          </div>
          <h3 style={{ color: "red" }}>Time left: {timeLeft}s</h3>
        </div>
      )}

      {phase === "input" && (
        <div>
          <h2>Enter the numbers you memorized:</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", margin: "20px" }}>
            {userInputs.map((val, idx) => (
              <input
                key={idx}
                type="number"
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                style={{ width: "60px", height: "50px", fontSize: "1.5rem", textAlign: "center" }}
              />
            ))}
          </div>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", fontSize: "1.2rem", cursor: "pointer" }}>
            Submit
          </button>
        </div>
      )}

      {phase === "result" && (
        <div>
          <h2 style={{ color: isCorrect ? "green" : "red" }}>
            {isCorrect ? "Correct! 🎉" : "Wrong! 😢"}
          </h2>
          <p><strong>Original Numbers:</strong> {numbers.join(", ")}</p>
          <p><strong>Your Inputs:</strong> {userInputs.join(", ")}</p>
          <button onClick={() => navigate("/")} style={{ padding: "10px 20px", fontSize: "1.2rem", marginTop: "20px", cursor: "pointer" }}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}