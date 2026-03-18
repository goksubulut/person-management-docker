import { useState } from "react";
import API_BASE from "../api";

function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!fullName.trim()) {
      setError("Full Name cannot be empty.");
      return;
    }

    if (!email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/people`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setMessage("Person added successfully.");
      setFullName("");
      setEmail("");
    } catch {
      setError("Server connection failed.");
    }
  };

  return (
    <section className="card">
      <span className="badge">Registration Form</span>
      <h1 className="page-title">Add a New Person</h1>
      <p className="page-description">
        Create a new person record through a clean, validated interface
        connected to a PostgreSQL-backed REST API.
      </p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. Goksu Bulut"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="input"
            type="email"
            placeholder="e.g. goksu@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="btn btn-primary" type="submit">
            Add Person
          </button>
        </div>
      </form>
    </section>
  );
}

export default Home;