import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  
  // --- NEW: Replaced 'program' with 'major' ---
  const [major, setMajor] = useState(""); 
  
  const [gender, setGender] = useState("");
  const [locationCollected, setLocationCollected] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // --- NEW: Pass the major state to the Question Page ---
    navigate("/question", { 
      state: { 
        formData: { fname, lname, age, school, major, gender, location: locationCollected, soundEnabled } 
      } 
    });
  };

  const inputStyle = { 
    padding: "15px", 
    fontSize: "1.5rem", 
    borderRadius: "10px", 
    border: "2px solid #ccc", 
    width: "400px", 
    textAlign: "center" 
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "sans-serif", textAlign: "center", backgroundColor: "#f9f9f9", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>Memory Game</h1>
      
      <div style={{ maxWidth: "800px", backgroundColor: "white", padding: "30px", borderRadius: "15px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", marginBottom: "40px", textAlign: "left", fontSize: "1.5rem", lineHeight: "1.6" }}>
        <h2 style={{ marginTop: "0", color: "#007bff", textAlign: "center" }}>How to Play</h2>
        <ul>
          <li><strong>The Goal:</strong> Memorize 5 consecutive sequences of 10 numbers.</li>
          <li><strong>Memorize (10s):</strong> You have 10 seconds to memorize.</li>
          <li><strong>Pause (5s):</strong> The screen clears—get ready!</li>
          <li><strong>Input:</strong> Type the numbers. Boxes auto-advance.</li>
          <li><strong>Submit:</strong> Press <strong>Enter</strong> to check and move to the next round.</li>
          <li>You are being <strong>timed</strong> so try to complete it as fast as you can!</li>
        </ul>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
        
        <input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} required style={inputStyle} />
        <input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required min="1" style={inputStyle} />
        <input type="text" placeholder="School" value={school} onChange={(e) => setSchool(e.target.value)} required style={inputStyle} />
        
        {/* --- NEW: The Major Dropdown --- */}
        <select value={major} onChange={(e) => setMajor(e.target.value)} required style={{ ...inputStyle, backgroundColor: "white", cursor: "pointer" }}>
          <option value="" disabled>Select Major...</option>
          <option value="Engineering">Engineering</option>
          <option value="Math and Physics">Math and Physics</option>
          <option value="Health and Life Sciences">Health and Life Sciences</option>
          <option value="Arts and Social Sciences">Arts and Social Sciences</option>
          <option value="Other">Other</option>
        </select>
        
        <select value={gender} onChange={(e) => setGender(e.target.value)} required style={{ ...inputStyle, backgroundColor: "white", cursor: "pointer" }}>
          <option value="" disabled>Select Gender...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
          <option value="Other">Other</option>
        </select>

        <input type="text" placeholder="Location Collected" value={locationCollected} onChange={(e) => setLocationCollected(e.target.value)} required style={inputStyle} />

        <label style={{ fontSize: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} style={{ width: "25px", height: "25px", cursor: "pointer" }} />
          Enable Sound Effects
        </label>

        <button type="submit" style={{ padding: "15px 40px", fontSize: "2rem", marginTop: "20px", cursor: "pointer", borderRadius: "10px", backgroundColor: "#007bff", color: "white", border: "none", fontWeight: "bold" }}>
          Start Game
        </button>
      </form>
    </div>
  );
}