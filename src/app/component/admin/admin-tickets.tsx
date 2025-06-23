"use client"

import { useState, useEffect } from "react"
import { TicketIcon, EllipsisVerticalIcon, TagIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline"
import "../style/style.adminticked.css"

type Ticket = {
  _id: string
  title: string
  status: string
  createdAt: string
  created_user: {
    id: string
    fullname: string
    email: string
    phone_ext: string
  }[]
  departamento: {
    id: string
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
        const response = await fetch("http://10.0.0.15:8002/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
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
    const statusStr = typeof status === "string" ? status : String(status)

    const statusMap = {
      Completado: { class: "status-completado", text: "Completado" },
      5: { class: "status-completado", text: "Completado" },
      "En Proceso": { class: "status-proceso", text: "Proceso" },
      2: { class: "status-proceso", text: "Proceso" },
      "En Revisión": { class: "status-revision", text: "Revisión" },
      3: { class: "status-revision", text: "Revisión" },
      "En Espera": { class: "status-espera", text: "Espera" },
      4: { class: "status-espera", text: "Espera" },
      Cancelado: { class: "status-cancelado", text: "Cancelado" },
      6: { class: "status-cancelado", text: "Cancelado" },
      Abierto: { class: "status-abierto", text: "Abierto" },
      1: { class: "status-abierto", text: "Abierto" },
    }

    return statusMap[statusStr] || { class: "status-default", text: "Sin estado" }
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

  const safeText = (value) => {
    if (value === null || value === undefined) return "No disponible"
    if (typeof value === "object") {
      return value.name || value.nombre || JSON.stringify(value)
    }
    return String(value)
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="admin-header-content">
          <TicketIcon className="admin-header-icon" />
          <div>
            <h1 className="admin-page-title">Tickets</h1>
            <p className="admin-page-subtitle">Listado de todos los tickets realizados por los usuarios.</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="admin-stats-container">
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Abiertos</h3>
            <p className="admin-stat-number">{stats.abiertos}</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Proceso</h3>
            <p className="admin-stat-number">{stats.proceso}</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Revisión</h3>
            <p className="admin-stat-number">{stats.revision}</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Espera</h3>
            <p className="admin-stat-number">{stats.espera}</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Completados</h3>
            <p className="admin-stat-number">{stats.completados}</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Cancelados</h3>
            <p className="admin-stat-number">{stats.cancelados}</p>
          </div>
        </div>
      </div>

      {/* Actividad de tickets */}
      <div className="admin-content-section">
        <h2 className="admin-section-title">Actividad de tickets</h2>

        {loading ? (
          <div className="admin-loading-container">
            <div className="admin-spinner"></div>
            <p className="admin-loading-text">Cargando tickets...</p>
          </div>
        ) : (
          <div className="admin-tickets-list">
            {tickets.slice(0, 60).map((ticket) => {
              const statusInfo = getStatusBadge(ticket.status || ticket.status)
              return (
                <article key={ticket._id || ticket._id} className="admin-ticket-card">
                  <div className="admin-ticket-content">
                    <div className="admin-ticket-header">
                      <div className="admin-ticket-title-section">
                        <h3 className="admin-ticket-title">{safeText(ticket.title || ticket.title)}</h3>
                        <span className={`admin-status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
                      </div>
                      <div className="admin-ticket-menu">
                        <button className="admin-menu-button" aria-label="Opciones del ticket">
                          <EllipsisVerticalIcon className="admin-menu-icon" />
                        </button>
                        <div className="admin-dropdown-menu">
                          <button className="admin-dropdown-item">Ver detalles</button>
                          <button className="admin-dropdown-item">Editar</button>
                          <button className="admin-dropdown-item">Asignar</button>
                          <div className="admin-dropdown-divider"></div>
                          <button className="admin-dropdown-item danger">Eliminar</button>
                        </div>
                      </div>
                    </div>

                    <div className="admin-ticket-metadata">
                      <span className="admin-metadata-item">
                        <strong>Fecha creación:</strong> {formatDate(ticket.createdAt || ticket.createdAt)}
                      </span>
                      <span className="admin-metadata-separator">•</span>
                      <span className="admin-metadata-item">
                        <strong>Creado por:</strong> {safeText(ticket.created_user || ticket.created_user)}
                      </span>
                    </div>

                    <div className="admin-ticket-details">
                      <div className="admin-ticket-category">
                        <TagIcon className="admin-detail-icon" />
                        <span>{safeText(ticket.category || ticket.category)}</span>
                      </div>
                      <div className="admin-ticket-department">
                        <BuildingOfficeIcon className="admin-detail-icon" />
                        <span>{safeText(ticket.departamento || ticket.departamento)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
