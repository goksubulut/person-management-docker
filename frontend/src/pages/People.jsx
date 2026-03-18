/* eslint-disable react-hooks/set-state-in-effect */
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
    } catch {
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
    } catch {
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
    } catch {
      setError("Server connection failed.");
    }
  };

  return (
    <section className="card">
      <span className="badge">Registered Records</span>
      <h1 className="page-title">People List</h1>
      <p className="page-description">
        Browse existing records and manage person data with inline editing and
        safe deletion controls.
      </p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrap">
        <table className="table">
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
                        className="input inline-input"
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
                        className="input inline-input"
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
                      <div className="row-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => saveEdit(person.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="row-actions">
                        <button
                          className="btn btn-secondary"
                          onClick={() => startEdit(person)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => deletePerson(person.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="table-empty" colSpan="4">
                  No people found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default People;