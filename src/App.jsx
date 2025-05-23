import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { authService } from "./lib/api/auth-service";
import { LoginForm } from "./components/login-form";

// Importa tus páginas/componentes
import Inicio from "./app/dashboard/page";
import { Header } from "./components/header";
import NuevoTicket from "./app/dashboard/crearTicket/page";
import Sidebar from "./components/sidebar";

import RegisterPage from "./app/registro/page";

const PrivateRoute = () => {
  return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [departmentName, setDepartmentName] = useState(
    localStorage.getItem("department_name")
  );
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
      setDepartmentName(localStorage.getItem("department_name"));
      setUserId(localStorage.getItem("user_id"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUsername(null);
    setDepartmentName(null);
    setUserId(null);
    window.location.href = "/login";
  };

  const PrivateLayout = () => (
    <Header
      name={username || "Usuario"}
      departmentName={departmentName || "Sin departamento"}
      onLogout={handleLogout}
    >
      <Outlet />
    </Header>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/inicio" /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            <LoginForm
              setToken={setToken}
              setUsername={setUsername}
              setDepartmentName={setDepartmentName}
              setUserId={setUserId}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/tickets/nuevo" element={<NuevoTicket />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
