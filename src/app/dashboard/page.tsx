"use client"
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  DocumentMagnifyingGlassIcon,
  WrenchIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTickets } from "../../hooks/useTickets" // Asegúrate de que useTickets maneje su propio isLoading/error
import "./styles.css"
import Home from "../../img/Home.png"

const STATUS_LABELS = {
  0: "Asignados",
  1: "Proceso",
  2: "Espera",
  3: "Revisión",
}
const STATUS_ICONS = [ClipboardDocumentListIcon, WrenchIcon, ClockIcon, DocumentMagnifyingGlassIcon]

export default function Dashboard() {
  const [, setDarkMode] = useState(true) // No se usa en el código actual, pero se mantiene
  const [usuario, setUsuario] = useState(null)
  const [colaboradores, setColaboradores] = useState([])
  const [loadingColaboradores, setLoadingColaboradores] = useState(true)
  const navigate = useNavigate()
  const [, setLoadingUsuario] = useState(true) // Renombrado para claridad
  const [, setTickets] = useState([]) // Estado para tickets
  const [, setErrorTickets] = useState(null) // Estado para errores de tickets
  const [, setIsLoadingTickets] = useState(true) // Estado para carga de tickets

  // Cargar usuario actual
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
        // Podrías añadir un estado de error para el usuario si lo necesitas
      } finally {
        setLoadingUsuario(false)
      }
    }
    fetchUsuario()
  }, [navigate])

  // Cargar tickets asignados a mi
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoadingTickets(true)
        setErrorTickets(null)
        const res = await fetch("http://localhost:8000/tickets/asignados-a-mi/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        setTickets(data)
      } catch (err) {
        console.error("Error al cargar los tickets:", err)
        setErrorTickets(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoadingTickets(false)
      }
    }
    fetchTickets()
  }, []) // Dependencias vacías si no depende de props o estados externos

  // Cargar colaboradores del departamento (solo activos)
  useEffect(() => {
    const fetchColaboradores = async () => {
      if (!usuario || !usuario.department) {
        setLoadingColaboradores(false)
        setColaboradores([]) // Asegurarse de que la lista esté vacía si no hay departamento
        return
      }
      try {
        setLoadingColaboradores(true)
        const token = localStorage.getItem("token")
        const departmentId = usuario.department // Obtener el department_id del usuario logueado

        const res = await fetch(`http://localhost:8000/usuarios/departamento/${departmentId}/colaboradores`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          localStorage.removeItem("token")
          return navigate("/login")
        }
        if (res.ok) {
          const data = await res.json()
          // Filtro adicional en el frontend para asegurar que solo sean usuarios activos
          const colaboradoresActivos = data.filter((colaborador) => colaborador.status === true)
          setColaboradores(colaboradoresActivos)
        } else {
          console.error("Error al cargar colaboradores:", res.status)
          setColaboradores([]) // Limpiar si hay error
        }
      } catch (error) {
        console.error("Error al cargar colaboradores:", error)
        setColaboradores([]) // Limpiar si hay error
      } finally {
        setLoadingColaboradores(false)
      }
    }
    // Solo cargar colaboradores si ya tenemos el usuario y su department_id
    if (usuario && usuario.department) {
      fetchColaboradores()
    }
  }, [usuario, navigate]) // Depende de 'usuario' para que se ejecute cuando 'usuario' se carga

  // useTickets hook (asegúrate de que este hook maneje su propio estado de carga y tickets)
  // Si useTickets ya tiene isLoading, puedes usarlo directamente.
  // Si no, el isLoadingTickets que definimos arriba es para los tickets asignados a mi.
  const { stats, tickets: hookTickets, isLoading: hookIsLoading } = useTickets() // Renombrado para evitar conflicto

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Header Section */}
        <div className="dashboard-header">
          <h3 className="dashboard-title">Tickets</h3>
          <p className="dashboard-subtitle">Estadísticas sobre los tickets asignados al usuario.</p>
        </div>
        {/* Stats Section */}
        <div className="stats-container">
          <div className="stats-grid">
            {[0, 1, 2, 3].map((statusCode) => {
              const IconComponent = STATUS_ICONS[statusCode]
              return (
                <div key={statusCode} className="stat-card">
                  <div className="stat-icon">
                    <IconComponent className={`icon-${statusCode}`} />
                  </div>
                  <div className="stat-content">
                    <p className="stat-number">{hookIsLoading ? "..." : (stats.byStatus[statusCode] ?? 0)}</p>
                    <p className="stat-label">{STATUS_LABELS[statusCode]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {/* Image Section */}
        <div className="image-container">
          <img src={Home || "/placeholder.svg"} width={520} alt="Home" />
        </div>
        {/* Colaboradores Section */}
        <div className="colaboradores-section">
          <h2 className="colaboradores-title">Colaboradores del Departamento</h2>
          {loadingColaboradores ? (
            <div className="loading-container">
              <div className="loading-spinner">
                <span>Cargando colaboradores...</span>
              </div>
            </div>
          ) : colaboradores.length > 0 ? (
            <div className="colaboradores-grid">
              {colaboradores.map((colaborador) => (
                <div key={colaborador.id} className="colaborador-card">
                  <div className="colaborador-avatar">
                    <UserIcon className="avatar-icon" />
                  </div>
                  <div className="colaborador-info">
                    <h3 className="colaborador-name">{colaborador.fullname || "Sin nombre"}</h3>
                    <p className="colaborador-details">
                      {colaborador.email}
                      {colaborador.phone_ext && ` | #${colaborador.phone_ext}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No hay colaboradores activos en tu departamento o no perteneces a ningún departamento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
