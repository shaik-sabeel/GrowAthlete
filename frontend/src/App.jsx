import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />
        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}

        

        <Route
          path="/athlete/dashboard"
          element={
            <ProtectedRoute role="athlete">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
