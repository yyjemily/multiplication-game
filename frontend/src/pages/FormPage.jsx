import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/questions", { state: { formData } });
  };

  const addInput = () => {
    const inputName = prompt("Enter the name of the new input:");
    if (inputName) {
      setFormData((prev) => ({ ...prev, [inputName]: "" }));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Form Page</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label>
              {key}:
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={addInput} style={{ marginRight: "10px" }}>
          Add Input
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FormPage;