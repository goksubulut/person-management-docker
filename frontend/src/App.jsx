import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import People from "./pages/People";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>
            Add Person
          </Link>
          <Link to="/people">People List</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<People />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;