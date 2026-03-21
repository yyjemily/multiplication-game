import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const NUM_ITEMS = 10;
const MAX_RANDOM = 10; 
const MEMORIZE_SECONDS = 10;
const PAUSE_SECONDS = 5;
const NUM_ROUNDS = 5;
const BACKEND_URL = "http://127.0.0.1:5000/api/save";

export default function QuestionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData;

  useEffect(() => {
    if (!formData) navigate("/", { replace: true });
  }, [formData, navigate]);

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState("memorize"); 
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_SECONDS);
  
  const [numbers, setNumbers] = useState([]);
  const [userInputs, setUserInputs] = useState(Array(NUM_ITEMS).fill(""));
  
  const [allNumbers, setAllNumbers] = useState([]);
  const [allUserInputs, setAllUserInputs] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  const [inputStartTime, setInputStartTime] = useState(null);
  const [roundTimes, setRoundTimes] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  const [notes, setNotes] = useState("");
  // We still use the preference from the form page, but no longer have a button to change it
  const [isSoundOn] = useState(formData?.soundEnabled ?? true);

  const inputRefs = useRef([]);

  useEffect(() => {
    const randomNums = Array.from({ length: NUM_ITEMS }, () => Math.floor(Math.random() * MAX_RANDOM));
    setNumbers(randomNums);
  }, [round]);

  useEffect(() => {
    if (timeLeft > 0 && (phase === "memorize" || phase === "pause")) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (phase === "memorize") {
        setPhase("pause");
        setTimeLeft(PAUSE_SECONDS); 
      } else if (phase === "pause") {
        setPhase("input");
        setInputStartTime(Date.now());
      }
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === "input") {
      setTimeout(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }, 10);
    }
  }, [phase]);

  const handleInputChange = (index, value) => {
    if (value !== "" && !/^\d$/.test(value)) return;

    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);

    if (value !== "" && index < NUM_ITEMS - 1) {
      setTimeout(() => {
        if (inputRefs.current[index + 1]) inputRefs.current[index + 1].focus();
      }, 10);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && phase === "input") handleRoundSubmit();
  };

  const handleRoundSubmit = () => {
    const roundTime = (Date.now() - (inputStartTime || Date.now())) / 1000;
    const updatedRoundTimes = [...roundTimes, roundTime];
    const newTotalTime = totalTime + roundTime;

    let currentRoundCorrect = 0;
    numbers.forEach((num, idx) => {
      if (parseInt(userInputs[idx], 10) === num) currentRoundCorrect += 1;
    });

    const updatedAllNumbers = [...allNumbers, ...numbers];
    const updatedAllInputs = [...allUserInputs, ...userInputs];
    const updatedTotalScore = totalScore + currentRoundCorrect;

    if (isSoundOn) {
      try {
        const audioUrl = currentRoundCorrect === NUM_ITEMS ? "/correct.mp3" : "/wrong.mp3";
        new Audio(audioUrl).play().catch(() => {});
      } catch (e) { }
    }

    setAllNumbers(updatedAllNumbers);
    setAllUserInputs(updatedAllInputs);
    setTotalScore(updatedTotalScore);
    setTotalTime(newTotalTime);
    setRoundTimes(updatedRoundTimes);

    if (round < NUM_ROUNDS) {
      setRound(round + 1);
      setUserInputs(Array(NUM_ITEMS).fill(""));
      setPhase("memorize");
      setTimeLeft(MEMORIZE_SECONDS); 
    } else {
      // --- NEW: Go directly to the Results page after round 5 ---
      setPhase("result");
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await axios.post(BACKEND_URL, {
        ...formData, 
        numbers: allNumbers.join(","),
        inputs: allUserInputs.join(","),
        accuracy: totalScore,
        total_possible: NUM_ITEMS * NUM_ROUNDS,
        round_times: roundTimes, 
        total_time: totalTime,
        notes: notes 
      });
      // --- NEW: Send them back to the start form after saving ---
      navigate("/"); 
    } catch (error) {
      console.error("Backend Save Error:", error);
      alert("Could not save to backend. Make sure your Python server is running!");
      navigate("/"); 
    }
  };

  if (!formData) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", textAlign: "center", backgroundColor: "#f9f9f9", padding: "20px" }}>
      
      {phase !== "result" && phase !== "notes" && (
        <button 
          onClick={() => navigate("/")}
          style={{ position: "absolute", top: "20px", left: "20px", padding: "10px 20px", fontSize: "1.2rem", cursor: "pointer", borderRadius: "8px", backgroundColor: "#dc3545", color: "white", border: "none" }}
        >
        Quit & Return
        </button>
      )}

      <h1 style={{ fontSize: "4rem", marginBottom: "10px" }}>Memory Game</h1>
      
      {(phase === "memorize" || phase === "pause" || phase === "input") && (
        <h3 style={{ fontSize: "2rem", color: "#555", marginTop: "0", marginBottom: "30px" }}>Round {round} of {NUM_ROUNDS}</h3>
      )}
      
      {phase === "memorize" && (
        <div>
          <h2 style={{ fontSize: "3rem" }}>Memorize these numbers!</h2>
          <div style={{ fontSize: "5rem", margin: "40px", letterSpacing: "15px", fontWeight: "bold" }}>{numbers.join(" ")}</div>
          <h3 style={{ fontSize: "2.5rem", color: "red" }}>Time left: {timeLeft}s</h3>
        </div>
      )}

      {phase === "pause" && (
        <div>
          <h2 style={{ fontSize: "4rem", color: "#ff8c00" }}>Get Ready...</h2>
          <h3 style={{ fontSize: "3rem" }}>Starting in {timeLeft}s</h3>
        </div>
      )}

      {phase === "input" && (
        <div>
          <h2 style={{ fontSize: "2.5rem" }}>Enter the numbers, then press Enter:</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", margin: "40px" }}>
            {userInputs.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: "80px", height: "80px", fontSize: "3rem", textAlign: "center", borderRadius: "10px", border: "2px solid #ccc" }}
              />
            ))}
          </div>
          <button onClick={handleRoundSubmit} style={{ padding: "15px 40px", fontSize: "2rem", cursor: "pointer", borderRadius: "10px", backgroundColor: "#007bff", color: "white", border: "none" }}>
            {round < NUM_ROUNDS ? "Next Round" : "Finish Rounds"}
          </button>
        </div>
      )}

      {/* --- NEW: Results display phase, showing the button to proceed to notes --- */}
      {phase === "result" && (
        <div>
          <h2 style={{ fontSize: "4rem", color: totalScore > (NUM_ITEMS * NUM_ROUNDS / 2) ? "green" : "red" }}>
            {totalScore === (NUM_ITEMS * NUM_ROUNDS) ? "Perfect! 🎉" : `You got ${totalScore} out of ${NUM_ITEMS * NUM_ROUNDS} correct!`}
          </h2>
          <h3 style={{ fontSize: "3rem", color: "#555", margin: "10px 0 10px 0" }}>
            Accuracy: {Math.round((totalScore / (NUM_ITEMS * NUM_ROUNDS)) * 100)}%
          </h3>
          <h3 style={{ fontSize: "2rem", color: "#007bff", margin: "0 0 30px 0" }}>
            Total Time: {totalTime.toFixed(2)} seconds
          </h3>
          <button onClick={() => setPhase("notes")} style={{ padding: "15px 40px", fontSize: "2rem", marginTop: "40px", cursor: "pointer", borderRadius: "10px", backgroundColor: "#007bff", color: "white", border: "none" }}>
            Continue to Notes
          </button>
        </div>
      )}

      {/* --- NEW: Notes phase is now at the very end, leading to the final save --- */}
      {phase === "notes" && (
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <h2 style={{ fontSize: "3rem", color: "#333" }}>Session Complete!</h2>
          <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Please log any experimental notes or observations below before saving your data.</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your notes here..."
            rows={6}
            style={{ width: "100%", padding: "15px", fontSize: "1.5rem", borderRadius: "10px", border: "2px solid #ccc", marginBottom: "20px", resize: "vertical" }}
          />
          <button onClick={handleFinalSubmit} style={{ padding: "15px 40px", fontSize: "2rem", cursor: "pointer", borderRadius: "10px", backgroundColor: "#28a745", color: "white", border: "none" }}>
            Save Data & Return Home
          </button>
        </div>
      )}

    </div>
  );
}