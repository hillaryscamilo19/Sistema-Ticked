"use client";

import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  TicketIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon } from "lucide-react";
import tyz from "../img/tyz.png";

type Usuario = {
  _id: string;
  fullname?: string;
  role?: string;
  department_id?: string;
};

type Departamento = {
  _id: string;
  name?: string;
  id?: string;
  nombre?: string;
};

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const closeMobileSidebar = () => setMobileSidebarOpen(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [departamento, setDepartamento] = useState<Departamento | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTechUser, setIsTechUser] = useState(false);
  const navigate = useNavigate();

  const isAdminMenu = [
    "admin/todotickets",
    "admin/usuarios",
    "admin/departamentos",
    "admin/categorias",
    "admin/estadisticas",
  ].some((path) => location.pathname.startsWith(path));
  const toggleTheme = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("department_name");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const handleAdminPanel = () => {
    navigate("/admin/tickets");
  };

  // Primero cargar usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }

        const data = await res.json();
        setUsuario(data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  // Luego cargar departamentos cuando ya tenemos el usuario
  useEffect(() => {
    const fetchDepartamentos = async () => {
      if (!usuario?.department_id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          return navigate("/login");
        }

        const data = await response.json();
        setDepartamentos(data);

        // Buscar el departamento del usuario
        const userDepartamento = data.find(
          (d: Departamento) =>
            d._id === usuario.department_id || d.id === usuario.department_id
        );

        setDepartamento(userDepartamento || null);

        // Verificar si el usuario pertenece al departamento de Tecnología
        if (
          userDepartamento &&
          (userDepartamento.name?.toLowerCase() === "tecnología" ||
            userDepartamento.name?.toLowerCase() === "tecnologia" ||
            userDepartamento.nombre?.toLowerCase() === "tecnología" ||
            userDepartamento.nombre?.toLowerCase() === "tecnologia")
        ) {
          setIsTechUser(true);
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, [usuario, navigate]);

  return (
    <div className="d-flex vh-100">
      {/* SIDEBAR */}
      <div
        className={`p-3 border-end sidebar-vertical ${
          collapsed ? "collapsed" : ""
        } ${mobileSidebarOpen ? "open" : ""}`}
      >
        {isAdminMenu ? (
          <>
            <div className="text-center mb-4">
              {!collapsed ? <h2>TYZ - Logo</h2> : <h4>TYZ</h4>}
            </div>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/todotickets"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-ticket me-2" />
                  {!collapsed && "Tickets"}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/usuarios"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-users me-2" />
                  {!collapsed && "Usuarios"}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/departamentos"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-building me-2" />
                  {!collapsed && "Departamentos"}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/categorias"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-tags me-2" />
                  {!collapsed && "Categorías"}
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/estadisticas"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-chart-bar me-2" />
                  {!collapsed && "Estadísticas"}
                </Link>
              </li>
              <li className="nav-item mt-3">
                <Link
                  className="nav-link fw-bold d-flex align-items-center"
                  to="/inicio"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-arrow-left me-2" />
                  {!collapsed && "Volver a TYZ"}
                </Link>
              </li>
            </ul>
          </>
        ) : (
          <>
            <div className="text-center mb-4">
              <img
                src={tyz}
                alt="Logo"
                className="img-fluid"
                style={{
                  width: collapsed ? "40px" : "200px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            <ul className="nav flex-column ms-2">
              {!collapsed && (
                <p className="fw-bold text-uppercase small mb-2 mt-5">INICIO</p>
              )}
              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/inicio" ? "active-green" : ""
                  }`}
                  to="/inicio"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-house me-2" />
                  {!collapsed && "Inicio"}
                </Link>
              </li>

              {!collapsed && (
                <p className="fw-bold text-uppercase small mb-2 mt-3">
                  TICKETS
                </p>
              )}
              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/tickets/nuevo" ? "active-green" : ""
                  }`}
                  to="/tickets/nuevo"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-plus me-2" />
                  {!collapsed && "Crear Nuevo Ticket"}
                </Link>
              </li>

              {!collapsed && (
                <p className="fw-bold text-uppercase small mb-2 mt-3">
                  ASIGNADOS
                </p>
              )}
              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/tickets/asignados/usuario"
                      ? "active-green"
                      : ""
                  }`}
                  to="/tickets/asignados/usuario"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-user-check me-2" />
                  {!collapsed && "Mis Tickets Asignados"}
                </Link>
              </li>

              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/tickets/asignados-departamento"
                      ? "active-green"
                      : ""
                  }`}
                  to="/tickets/asignados-departamento"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-user-check me-2" />
                  {!collapsed && "Asignados Al Departamento"}
                </Link>
              </li>

              {!collapsed && (
                <p className="fw-bold text-uppercase small mb-2 mt-3">
                  CREADOS
                </p>
              )}
              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/tickets/creados"
                      ? "active-green"
                      : ""
                  }`}
                  to="/tickets/creados"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-file-circle-plus me-2" />
                  {!collapsed && "Mis Tickets Creados"}
                </Link>
              </li>
              <li className="nav-item mb-1">
                <Link
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/todos-creados-por-mi-departamento/"
                      ? "active-green"
                      : ""
                  }`}
                  to="/todos-creados-por-mi-departamento/"
                  onClick={closeMobileSidebar}
                >
                  <i className="fa-solid fa-gear me-2" />
                  {!collapsed && "Nuestros Creados"}
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
      {/* MAIN CONTENT */}
      <div className="flex-fill d-flex flex-column">
        {/* HEADER */}
        <nav
          className="navbar navbar-light bg-white border-bottom px-4"
          style={{ height: "70px" }}
        >
          <div className="d-flex justify-content-between align-items-center w-100">
            {/* Toggle Switch */}
            <div className="d-flex align-items-center">
              <div className="form-check form-switch me-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="darkModeSwitch"
                  checked={darkMode}
                  onChange={toggleTheme}
                  style={{
                    backgroundColor: darkMode ? "#10b981" : "#dee2e6",
                    borderColor: darkMode ? "#10b981" : "#dee2e6",
                  }}
                />
              </div>
              <Moon size={16} color="#6b7280" />
            </div>

            {/* User Dropdown with Bootstrap Collapse */}
            <div className="dropdown">
              <button
                className="btn btn-link text-decoration-none d-flex align-items-center p-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#userDropdown"
                aria-expanded="false"
                aria-controls="userDropdown"
              >
                <div className="text-end me-3">
                  <div className="fw-bold text-dark mb-0">
                    {loading ? "Cargando..." : usuario?.fullname || ""}
                  </div>
                  <div className="text-muted small">
                    {loading
                      ? "Cargando..."
                      : usuario?.department_id || usuario?.department_id || ""}
                  </div>
                </div>
                <UserCircleIcon
                  className="text-muted me-2"
                  style={{ width: "32px", height: "32px" }}
                />
                <span className="text-muted">▼</span>
              </button>

              {/* Bootstrap Collapse Dropdown */}
              <div
                className="collapse position-absolute end-0 mt-2"
                id="userDropdown"
                style={{ zIndex: 1050 }}
              >
                <div className="card shadow-sm" style={{ minWidth: "220px" }}>
                  <div className="card-body p-0">
                    {/* Solo mostrar Panel administración si el usuario es de Tecnología */}
                    {isTechUser && (
                      <li>
                    <Link className="dropdown-item" to="/admin/tickets">
                      <i className="fa-solid fa-shield-halved me-2" />
                      Panel administración
                    </Link>
                  </li>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn btn-link text-start w-100 text-decoration-none p-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="me-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div
          className="flex-fill overflow-auto"
          style={{ backgroundColor: "#eaf2f9" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
