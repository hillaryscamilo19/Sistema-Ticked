"use client"

import { useState, useEffect } from "react"
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom"
import { TicketIcon, UserIcon, BuildingOfficeIcon, ChartBarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"

export default function AdminPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSection, setActiveSection] = useState("tickets")

  // Determinar la sección activa basada en la URL
  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path) {
      setActiveSection(path)
    }
  }, [location])

  return (
    <div className="admin-panel">
      {/* Header del panel */}
      <div className="bg-white border-bottom p-3 d-flex align-items-center">
        <button onClick={() => navigate("/dashboard")} className="btn btn-sm btn-outline-secondary me-3">
          <ArrowLeftIcon style={{ width: "16px", height: "16px" }} className="me-1" />
          Volver al Dashboard
        </button>
        <h4 className="mb-0">Panel de Administración</h4>
      </div>

      {/* Layout principal */}
      <div className="d-flex">
        {/* Sidebar del admin */}
        <div className="bg-dark text-white" style={{ width: "250px", minHeight: "calc(100vh - 70px)" }}>
          <div className="p-3">
            <div className="text-center mb-4">
              <img src="/placeholder.svg?height=80&width=150" alt="TYZ Logo" className="img-fluid" />
            </div>

            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  to="/admin/tickets"
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    activeSection === "tickets" ? "active bg-primary text-white" : "text-light"
                  }`}
                  onClick={() => setActiveSection("tickets")}
                >
                  <TicketIcon className="me-2" style={{ width: "20px", height: "20px" }} />
                  Tickets
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/usuarios"
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    activeSection === "usuarios" ? "active bg-primary text-white" : "text-light"
                  }`}
                  onClick={() => setActiveSection("usuarios")}
                >
                  <UserIcon className="me-2" style={{ width: "20px", height: "20px" }} />
                  Usuarios
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/departamentos"
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    activeSection === "departamentos" ? "active bg-primary text-white" : "text-light"
                  }`}
                  onClick={() => setActiveSection("departamentos")}
                >
                  <BuildingOfficeIcon className="me-2" style={{ width: "20px", height: "20px" }} />
                  Departamentos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/admin/estadisticas"
                  className={`nav-link d-flex align-items-center py-2 px-3 rounded ${
                    activeSection === "estadisticas" ? "active bg-primary text-white" : "text-light"
                  }`}
                  onClick={() => setActiveSection("estadisticas")}
                >
                  <ChartBarIcon className="me-2" style={{ width: "20px", height: "20px" }} />
                  Estadísticas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow-1 bg-light">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
