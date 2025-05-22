import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { authService } from "./lib/api/auth-service";
import { LoginForm } from "./components/login-form";
import Dashboard from "./app/dashboard/page";
import RegisterPage from "./app/registro/page";
import DashboardLayout from "./app/dashboard/layout";
import CrearTicketPage from "./app/dashboard/crearTicket/page";


const PrivateRoute = () => {
  return authService.isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterPage />} />

        {/* Rutas privadas bajo /dashboard */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="crearTicket" element={<CrearTicketPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
