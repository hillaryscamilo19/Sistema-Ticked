"use client"

import {
  PlusCircleIcon,
  BuildingOfficeIcon,
  TicketIcon,
  GlobeAmericasIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Moon } from "lucide-react"

import tyz from "../../img/tyz.png"

export function Sidebar() {
  const [darkMode, setDarkMode] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [departamento, setDepartamento] = useState(null)
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isTechUser, setIsTechUser] = useState(false)
  const navigate = useNavigate()

  const toggleTheme = () => setDarkMode(!darkMode)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("department_name")
    localStorage.removeItem("user_id")
    navigate("/login")
  }

  const handleAdminPanel = () => {
    navigate("/admin/tickets")
  }

  // Primero cargar usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8000/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          localStorage.removeItem("token")
          return navigate("/login")
        }

        const data = await res.json()
        setUsuario(data)
      } catch (error) {
        console.error("Error al cargar usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuario()
  }, [navigate])

  // Luego cargar departamentos cuando ya tenemos el usuario
  useEffect(() => {
    const fetchDepartamentos = async () => {
      if (!usuario?.departamento_id) return

      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/departments", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) {
          localStorage.removeItem("token")
          return navigate("/login")
        }

        const data = await response.json()
        setDepartamentos(data)

        // Buscar el departamento del usuario
        const userDepartamento = data.find((d) => d._id === usuario.departamento_id || d.id === usuario.departamento_id)

        setDepartamento(userDepartamento || null)

        // Verificar si el usuario pertenece al departamento de Tecnología
        if (
          userDepartamento &&
          (userDepartamento.name?.toLowerCase() === "tecnología" ||
            userDepartamento.name?.toLowerCase() === "tecnologia" ||
            userDepartamento.nombre?.toLowerCase() === "tecnología" ||
            userDepartamento.nombre?.toLowerCase() === "tecnologia")
        ) {
          setIsTechUser(true)
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
      }
    }

    fetchDepartamentos()
  }, [usuario, navigate])

  return (
    <div className="d-flex vh-100">
      {/* SIDEBAR */}
      <div className="bg-dark text-white p-3" style={{ width: "280px", overflowY: "auto" }}>
        <div className="text-center mb-4">
          <img
            src={tyz}
            alt="TYZ Logo"
            width={200}
            height={106}
            className="img-fluid"
          />
        </div>

        {/* INICIO */}
        <div className="mb-4">
          <h6
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            INICIO
          </h6>
          <Link
            to="/dashboard"
            className="nav-link text-light d-flex align-items-center p-2 rounded text-decoration-none"
          >
            <GlobeAmericasIcon className="me-2" style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Inicio</span>
          </Link>
        </div>

        {/* TICKETS */}
        <div className="mb-4">
          <h6
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            TICKETS
          </h6>
          <Link
            to="/dashboard/crear"
            className="nav-link text-light d-flex align-items-center p-2 rounded text-decoration-none"
          >
            <PlusCircleIcon className="me-2" style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Crear nuevo ticket</span>
          </Link>
        </div>

        {/* ASIGNADOS */}
        <div className="mb-4">
          <h6
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            ASIGNADOS
          </h6>
          <Link
            to="/dashboard/asignado"
            className="nav-link text-light d-flex align-items-center p-2 rounded text-decoration-none mb-1"
          >
            <TicketIcon className="me-2" style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Mis tickets asignados</span>
          </Link>
          <Link
            to="/dashboard/departamento"
            className="nav-link text-light d-flex align-items-center p-2 rounded text-decoration-none"
          >
            <BuildingOfficeIcon className="me-2" style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Asignados al departamento</span>
          </Link>
        </div>

        {/* CREADOS */}
        <div className="mb-4">
          <h6
            className="text-muted text-uppercase fw-bold mb-2"
            style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
          >
            CREADOS
          </h6>
          <Link
            to="/dashboard/ourcreate"
            className="nav-link text-light d-flex align-items-center p-2 rounded text-decoration-none"
          >
            <ClipboardDocumentListIcon className="me-2" style={{ width: "1.25rem", height: "1.25rem" }} />
            <span>Nuestros creados</span>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-fill d-flex flex-column">
        {/* HEADER */}
        <nav className="navbar navbar-light bg-white border-bottom px-4" style={{ height: "70px" }}>
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
                    {loading ? "Cargando..." : usuario?.fullname || "Hillarys Camilo"}
                  </div>
                  <div className="text-muted small">
                    {loading ? "Cargando..." : departamento?.name || departamento?.nombre || "Tecnología"}
                  </div>
                </div>
                <UserCircleIcon className="text-muted me-2" style={{ width: "32px", height: "32px" }} />
                <span className="text-muted">▼</span>
              </button>

              {/* Bootstrap Collapse Dropdown */}
              <div className="collapse position-absolute end-0 mt-2" id="userDropdown" style={{ zIndex: 1050 }}>
                <div className="card shadow-sm" style={{ minWidth: "220px" }}>
                  <div className="card-body p-0">
                    {/* Solo mostrar Panel administración si el usuario es de Tecnología */}
                    {isTechUser && (
                      <button
                        className="btn btn-link text-start w-100 text-decoration-none p-3 border-bottom"
                        onClick={handleAdminPanel}
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
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="3" y1="9" x2="21" y2="9"></line>
                          <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                        Panel administración
                      </button>
                    )}
                    <button onClick={handleLogout} className="btn btn-link text-start w-100 text-decoration-none p-3">
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
        <div className="flex-fill overflow-auto" style={{ backgroundColor: "#eaf2f9" }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
