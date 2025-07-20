import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import SubmitProject from "./pages/SubmitProject";
import ApproveProjects from "./pages/ApproveProjects";
import ChainValidation from "./pages/ChainValidation";
import Transactions from "./pages/Transactions"; // Burada yeni sayfayı import ettik
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/projects"
            element={<PrivateRoute><Projects /></PrivateRoute>}
          />
          <Route
            path="/submit"
            element={<PrivateRoute><SubmitProject /></PrivateRoute>}
          />
          <Route
            path="/approve"
            element={<PrivateRoute><ApproveProjects /></PrivateRoute>}
          />
          <Route
            path="/chain/validate"
            element={<PrivateRoute><ChainValidation /></PrivateRoute>}
          />
          {/* Yeni eklenen transaction sayfası */}
          <Route
            path="/transactions"
            element={<PrivateRoute><Transactions /></PrivateRoute>}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
