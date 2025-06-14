"use client"

import { useState, useEffect } from "react"
import { TicketIcon, EllipsisVerticalIcon, TagIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline"



type Ticket = {
  _id: string
  title: string
  status: string
  createdAt: string
  created_user:{
    id: string,
    fullname: string,
    email: string,
    phone_ext: string,
  }[]
  departamento: {
    id:string,
    name: string
  }[]
}


export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    abiertos: 0,
    proceso: 0,
    revision: 0,
    espera: 0,
    completados: 0,
    cancelados: 0,
  })

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          console.log("Tickets cargados:", data) // Para depuración
          setTickets(data)

          // Calcular estadísticas
          const newStats = {
            abiertos: 0,
            proceso: 0,
            revision: 0,
            espera: 0,
            completados: 0,
            cancelados: 0,
          }

          data.forEach((ticket) => {
            const estado = ticket.estado || ticket.status
            switch (typeof estado === "string" ? estado : String(estado)) {
              case "Abierto":
              case "1":
                newStats.abiertos++
                break
              case "En Proceso":
              case "2":
                newStats.proceso++
                break
              case "En Revisión":
              case "3":
                newStats.revision++
                break
              case "En Espera":
              case "4":
                newStats.espera++
                break
              case "Completado":
              case "5":
                newStats.completados++
                break
              case "Cancelado":
              case "6":
                newStats.cancelados++
                break
              default:
                break
            }
          })

          setStats(newStats)
        }
      } catch (error) {
        console.error("Error al cargar tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const getStatusBadge = (status) => {
    // Convertir a string si no lo es
    const statusStr = typeof status === "string" ? status : String(status)

    const statusMap = {
      Completado: { class: "bg-success", text: "Completado" },
      5: { class: "bg-success", text: "Completado" },
      "En Proceso": { class: "bg-warning", text: "Proceso" },
      2: { class: "bg-warning", text: "Proceso" },
      "En Revisión": { class: "bg-info", text: "Revisión" },
      3: { class: "bg-info", text: "Revisión" },
      "En Espera": { class: "bg-secondary", text: "Espera" },
      4: { class: "bg-secondary", text: "Espera" },
      Cancelado: { class: "bg-danger", text: "Cancelado" },
      6: { class: "bg-danger", text: "Cancelado" },
      Abierto: { class: "bg-primary", text: "Abierto" },
      1: { class: "bg-primary", text: "Abierto" },
    }

    return statusMap[statusStr] || { class: "bg-secondary", text: "Sin estado" }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
    } catch {
      return "Fecha no disponible"
    }
  }

  // Función para extraer texto seguro de propiedades que podrían ser objetos
  const safeText = (value) => {
    if (value === null || value === undefined) return "No disponible"
    if (typeof value === "object") {
      // Si es un objeto, intentamos obtener una propiedad de nombre
      return value.name || value.nombre || JSON.stringify(value)
    }
    return String(value)
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <TicketIcon className="me-2" style={{ width: "24px", height: "24px" }} />
        <h2 className="mb-0">Tickets</h2>
      </div>

      <p className="text-muted mb-4">Listado de todos los tickets realizados por los usuarios.</p>

      {/* Estadísticas */}
      <div className="row mb-5">
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Abiertos</h4>
            <h2 className="fw-bold">{stats.abiertos}</h2>
          </div>
        </div>
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Proceso</h4>
            <h2 className="fw-bold">{stats.proceso}</h2>
          </div>
        </div>
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Revisión</h4>
            <h2 className="fw-bold">{stats.revision}</h2>
          </div>
        </div>
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Espera</h4>
            <h2 className="fw-bold">{stats.espera}</h2>
          </div>
        </div>
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Completados</h4>
            <h2 className="fw-bold">{stats.completados}</h2>
          </div>
        </div>
        <div className="col-md-2">
          <div className="text-center">
            <h4 className="text-muted mb-1">Cancelados</h4>
            <h2 className="fw-bold">{stats.cancelados}</h2>
          </div>
        </div>
      </div>

      {/* Actividad de tickets */}
      <div className="mb-4">
        <h4 className="mb-4">Actividad de tickets</h4>

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {tickets.slice(0, 60).map((ticket) => {
              const statusInfo = getStatusBadge(ticket.status || ticket.status)
              return (
                <div key={ticket._id || ticket._id} className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <h5 className="mb-0 fw-bold text-uppercase">{safeText(ticket.title || ticket.title)}</h5>
                          <span className={`badge ${statusInfo.class} rounded-pill`}>{statusInfo.text}</span>
                        </div>

                        <div className="text-muted small">
                          <span className="me-3">
                            <strong>Fecha creación:</strong> {formatDate(ticket.createdAt || ticket.createdAt)}
                          </span>
                          <span>
                            <strong>Creado por:</strong> {safeText(ticket.created_user || ticket.created_user)}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex flex-column align-items-end gap-1">
                          <div className="d-flex align-items-center text-muted small">
                            <TagIcon className="me-1" style={{ width: "14px", height: "14px" }} />
                            {safeText(ticket.category || ticket.category)}
                          </div>
                          <div className="d-flex align-items-center text-muted small">
                            <BuildingOfficeIcon className="me-1" style={{ width: "14px", height: "14px" }} />
                            {safeText(ticket.departamento || ticket.departamento)}
                          </div>
                        </div>

                        <div className="dropdown">
                          <button
                            className="btn btn-link text-muted p-1"
                            
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <EllipsisVerticalIcon style={{ width: "20px", height: "20px" }} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button className="dropdown-item">
                                Ver detalles
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" >
                                Editar
                              </button>
                            </li>
                            <li>
                              <button className="dropdown-item" >
                                Asignar
                              </button>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <button className="dropdown-item text-danger" >
                                Eliminar
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
