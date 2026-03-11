import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    program: ""
  });
  const navigate = useNavigate();

  // Updates the state every time the user types or clicks a radio button
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This is what makes the Start button work!
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the browser from doing a hard refresh
    
    // Navigates to the Game page AND secretly passes the user's data along
    navigate("/questions", { state: { formData } });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>
        ♪ MIE286 Project ― Effect of Music Speed on Multiplication Performance ♪
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fname">First name:</label><br />
          <input type="text" id="fname" name="fname" onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="lname">Last name:</label><br />
          <input type="text" id="lname" name="lname" onChange={handleChange} required style={{ width: "100%", padding: "8px" }} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Program:</label><br />
          
          <input type="radio" id="prog-engineering" name="program" value="Engineering" onChange={handleChange} required />
          <label htmlFor="prog-engineering"> Engineering</label><br />

          <input type="radio" id="prog-computer-science" name="program" value="Computer Science" onChange={handleChange} />
          <label htmlFor="prog-computer-science"> Computer Science</label><br />

          <input type="radio" id="prog-life-science" name="program" value="Life Science" onChange={handleChange} />
          <label htmlFor="prog-life-science"> Life Science</label><br />

          <input type="radio" id="prog-math" name="program" value="Math" onChange={handleChange} />
          <label htmlFor="prog-math"> Math</label><br />

          <input type="radio" id="prog-physics" name="program" value="Physics" onChange={handleChange} />
          <label htmlFor="prog-physics"> Physics</label><br />
        </div>

        <div style={{ backgroundColor: "#f4f4f4", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
          <h3>Instructions</h3>
          <p>1. Please ensure that all the information above has been filled out.</p>
          <p>2. Put on the headphones and adjust the volume such that it is comfortable for you.</p>
          <p>3. Click on the "Start" button.</p>
          <p>4. Complete the multiplication questions as quickly as possible.</p>
        </div>

        {/* Because this button is inside a <form onSubmit={...}>, clicking it runs handleSubmit */}
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>Start</button>
      </form>
    </div>
  );
}

export default FormPage;
