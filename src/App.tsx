import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/login/Login';
import LoginPage from './pages/login/LoginPage';
import Dashboard from './pages/dashboard/Dashboard';
import { useState } from 'react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Dashboard setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;