/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import API_BASE from "../api";

function People() {
  const [people, setPeople] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchPeople = async () => {
    try {
      const response = await fetch(`${API_BASE}/people`);
      const data = await response.json();
      setPeople(data);
    } catch (err) {
      setError("Failed to fetch people.");
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const startEdit = (person) => {
    setEditingId(person.id);
    setEditFullName(person.full_name);
    setEditEmail(person.email);
    setError("");
    setMessage("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditFullName("");
    setEditEmail("");
    setError("");
    setMessage("");
  };

  const saveEdit = async (id) => {
    setError("");
    setMessage("");

    if (!editFullName.trim()) {
      setError("Full Name cannot be empty.");
      return;
    }

    if (!editEmail.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    if (!emailRegex.test(editEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/people/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: editFullName,
          email: editEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Update failed.");
        return;
      }

      setMessage("Person updated successfully.");
      setEditingId(null);
      setEditFullName("");
      setEditEmail("");
      fetchPeople();
    } catch (err) {
      setError("Server connection failed.");
    }
  };

  const deletePerson = async (id) => {
    setError("");
    setMessage("");

    const confirmed = window.confirm(
      "Are you sure you want to delete this person?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE}/people/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Delete failed.");
        return;
      }

      setMessage("Person deleted successfully.");
      fetchPeople();
    } catch (err) {
      setError("Server connection failed.");
    }
  };

  return (
    <div>
      <h1>People List</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {people.length > 0 ? (
            people.map((person) => (
              <tr key={person.id}>
                <td>{person.id}</td>

                <td>
                  {editingId === person.id ? (
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                    />
                  ) : (
                    person.full_name
                  )}
                </td>

                <td>
                  {editingId === person.id ? (
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  ) : (
                    person.email
                  )}
                </td>

                <td>
                  {editingId === person.id ? (
                    <>
                      <button onClick={() => saveEdit(person.id)}>Save</button>
                      <button onClick={cancelEdit} style={{ marginLeft: "8px" }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(person)}>Edit</button>
                      <button
                        onClick={() => deletePerson(person.id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No people found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default People;