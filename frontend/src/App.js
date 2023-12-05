import { useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false); //state for loading

  const handleFileChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("number", number);
    formData.append("pdf", pdf);

    try {
      const response = await axios.post(
        "http://localhost:5000/send-email",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      // Display a success alert
      window.alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);

      // Display an error alert
      window.alert("Error sending email. Please try again.");
    } finally {
      setLoading(false); // Set loading back to false, whether success or failure
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <form className="email-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="number">Phone Number:</label>
            <input
              type="number"
              name="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              PDF File:
              <input type="file" accept=".pdf" onChange={handleFileChange} required />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
