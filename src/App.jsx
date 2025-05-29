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
import Dashboard from "./app/dashboard/page";
import PrivateLayout from "./PrivateLayout";
import RegisterPage from "./app/registro/page";
import CreateTicketForm from "./app/dashboard/crearTicket/page";
import TickedAsigando from "./app/dashboard/ticked/[id]/page"
import AssignedDepartment from "./app/dashboard/departamento/page"
import NuestroCreado from "./app/dashboard/ourcreate/page"

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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="registro" element={<RegisterPage />} />

        <Route path="dashboard" element={<PrivateLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="crear" element={<CreateTicketForm />} />
          <Route path="asignado" element={<TickedAsigando />}/>
          {/*<Route path="mis-tickets" element={<MisTickets />} />*/}
          <Route path="departamento" element={<AssignedDepartment />} />
          <Route path="ourcreate" element={<NuestroCreado />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
