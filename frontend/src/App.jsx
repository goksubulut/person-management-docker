import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import People from "./pages/People";

function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <div className="container">
          <header className="topbar">
            <div className="brand">
              <div className="brand-title">Person Management System</div>
              <div className="brand-subtitle">
                Elegant full-stack CRUD interface powered by Docker
              </div>
            </div>

            <nav className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Add Person
              </NavLink>

              <NavLink
                to="/people"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                People List
              </NavLink>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;