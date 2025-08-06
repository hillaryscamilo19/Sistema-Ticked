"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { authService } from "./lib/api/auth-service";
import { LoginForm } from "./components/login-form";
import "./index.css";

// Importa tus páginas/componentes existentes
import Dashboard from "./app/dashboard/page";
import RegisterPage from "./app/registro/page";
import CreateTicketForm from "./app/dashboard/crearTicket/page";
import TickedAsigando from "./app/dashboard/ticked/[id]/page";
import AssignedDepartment from "./app/dashboard/departamento/page";
import NuestroCreado from "./app/dashboard/ourcreate/page";
import TicketDetail from "./app/dashboard/asignacion/page";
import Sidebar from "./components/sidebar";

// Importa los componentes del panel de administración
import AdminPanel from "./app/component/admin-panel";
import AdminTickets from "./app/component/admin/admin-tickets";
import AdminUsuarios from "./app/component/admin/admin-usuarios";
import AdminDepartamentos from "./app/component/admin/admin-departamentos";
import AdminEstadisticas from "./app/component/admin/admin-estadisticas";
import AdminCategoria from "./app/component/admin/admin-categoria";

const PrivateRoute = () => {
  return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

// Componente para proteger rutas del departamento de Tecnología
const TechAdminRoute = () => {
  const [isTechUser, setIsTechUser] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkTechDepartment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const userResponse = await fetch("http://localhost:8000/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("👉 Usuario:", userData);

        if (userData.department_id) {
          const deptResponse = await fetch("http://localhost:8000/departments", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (deptResponse.ok) {
            const departments = await deptResponse.json();
            console.log("👉 Departamentos:", departments);

            const userDepartment = departments.find(
              (dept) =>
                String(dept._id) === String(userData.department_id) ||
                String(dept.id) === String(userData.department_id)
            );

            console.log("👉 Departamento del usuario:", userDepartment);

            if (
              userDepartment &&
              (userDepartment.name?.toLowerCase() === "tecnologia" ||
                userDepartment.name?.toLowerCase() === "tecnología" ||
                userDepartment.nombre?.toLowerCase() === "tecnologia" ||
                userDepartment.nombre?.toLowerCase() === "tecnología")
            ) {
              console.log("✅ Usuario pertenece a Tecnología");
              setIsTechUser(true);
            } else {
              console.warn("⚠️ El usuario NO es de Tecnología");
            }
          }
        }
      }
    } catch (error) {
      console.error("❌ Error al verificar el departamento:", error);
    } finally {
      setLoading(false);
    }
  };

  checkTechDepartment();
}, []);


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isTechUser) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
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

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          {/* Rutas del Dashboard con Sidebar */}
          <Route path="/dashboard" element={<Sidebar />}>
            <Route index element={<Dashboard />} />
            <Route path="crear" element={<CreateTicketForm />} />
            <Route path="asignado" element={<TickedAsigando />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="departamento" element={<AssignedDepartment />} />
            <Route path="ourcreate" element={<NuestroCreado />} />
          </Route>

          {/* Rutas del Panel de Administración - Solo para usuarios de Tecnología */}
          <Route element={<TechAdminRoute />}>
            <Route path="/admin" element={<AdminPanel />}>
              <Route index element={<Navigate to="tickets" replace />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="departamentos" element={<AdminDepartamentos />} />
              <Route path="Categoria" element={<AdminCategoria />} />
              <Route path="estadisticas" element={<AdminEstadisticas />} />
            </Route>
          </Route>
        </Route>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
