"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import "../departamento/style.css"

interface TicketUser {
  id: number
  fullname?: string
  name?: string
}

interface TicketDepartment {
  id: number
  name: string
}

interface Ticket {
  id: number
  title: string
  status: string
  created_at: string
  created_user?: TicketUser | string
  assigned_department?: TicketDepartment | string
  assigned_users?: TicketUser[] | string[]
  category?: {
    name: string
  }
}

const statusMap: Record<string, { label: string; color: string; hasIndicator?: boolean }> = {
  "1": { label: "Abierto", color: "status-abierto", hasIndicator: false },
  "2": { label: "Proceso", color: "status-proceso", hasIndicator: false },
  "3": { label: "Espera", color: "status-espera", hasIndicator: true },
  "4": { label: "Revisión", color: "status-revision", hasIndicator: false },
  "5": { label: "Completado", color: "status-completado", hasIndicator: true },
}

function formatRelativeDate(createdAt: string): string {
  if (!createdAt) return "Fecha no disponible"
  const date = new Date(createdAt)
  if (isNaN(date.getTime())) return "Fecha inválida"

  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  return diffInHours < 24 ? `Hace ${diffInHours} horas` : `Hace ${Math.floor(diffInHours / 24)} días`
}

function getStatusCounts(tickets: Ticket[]): Record<string, number> {
  const counts: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  }
  tickets.forEach((ticket) => {
    if (counts[ticket.status] !== undefined) {
      counts[ticket.status]++
    }
  })
  return counts
}

function extractUserName(user: TicketUser | string | undefined): string {
  if (!user) return "Desconocido"
  if (typeof user === "string") return user
  return user.fullname || user.name || "Desconocido"
}

function extractDepartmentName(dept: TicketDepartment | string | undefined): string {
  if (!dept) return "Sin departamento"
  if (typeof dept === "string") return dept
  return dept.name || "Sin departamento"
}

function extractAssignedUsers(users: TicketUser[] | string[] | undefined): string {
  if (!users || !Array.isArray(users) || users.length === 0) {
    return "Sin asignar"
  }

  return users
    .map((user) => {
      if (typeof user === "string") return user
      return user.fullname || user.name || "Usuario"
    })
    .join(", ")
}

export default function AssignedDepartment() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [activeTab, setActiveTab] = useState<string>("1") // Abierto por defecto
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch("http://10.0.0.15:8000/tickets/asignados-departamento/", {
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
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [])

  const statusCounts = getStatusCounts(tickets)
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = ticket.status === activeTab
    const matchesSearch =
      searchTerm === "" ||
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extractUserName(ticket.created_user).toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // Pagination logic
  const totalFilteredPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredTickets.slice(indexOfFirstItem, indexOfLastItem)

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value)
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5
    const totalPages = totalFilteredPages

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button key={i} onClick={() => paginate(i)} className={`page-button ${currentPage === i ? "active" : ""}`}>
            {i}
          </button>,
        )
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, currentPage + 2)

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button key={i} onClick={() => paginate(i)} className={`page-button ${currentPage === i ? "active" : ""}`}>
            {i}
          </button>,
        )
      }
    }

    return buttons
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Asignados al Departamento</h1>
          <div className="breadcrumb">
            <span className="breadcrumb-link">Inicio</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Asignados al Departamento</span>
          </div>
        </div>
        <div className="main-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Cargando tickets...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Asignados al Departamento</h1>
          <div className="breadcrumb">
            <span className="breadcrumb-link">Inicio</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Asignados al Departamento</span>
          </div>
        </div>
        <div className="main-container">
          <div className="error-content">
            <p className="error-text">Error al cargar los tickets: {error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header con breadcrumb */}
      <div className="page-header">
        <h1 className="page-title">Asignados al Departamento</h1>
        <div className="breadcrumb">
          <span className="breadcrumb-link">Inicio</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Asignados al Departamento</span>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="main-container">
        <div className="content-header">
          <h2 className="content-title">Listado de tickets asignados al departamento.</h2>
        </div>

        {/* Tabs y búsqueda */}
        <div className="tabs-search-section">
          <div className="status-tabs-container">
            {Object.entries(statusMap).map(([key, { label, hasIndicator }]) => {
              const isActive = activeTab === key
              const count = statusCounts[key] || 0

              return (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`status-tab ${isActive ? "active" : ""}`}
                  aria-pressed={isActive}
                >
                  <UsersIcon className="tab-icon" />
                  <span className="tab-label">{label}</span>
                  <span className="tab-count">{count}</span>
                  {hasIndicator && count > 0 && <div className="tab-indicator"></div>}
                </button>
              )
            })}
          </div>

          <div className="search-section">
            <div className="search-container">
              <MagnifyingGlassIcon className="search-icon" />
              <input
                type="text"
                placeholder="Buscar ticket"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                aria-label="Buscar tickets"
              />
            </div>
          </div>
        </div>


        {/* Lista de tickets */}
        <div className="tickets-section">
          {currentItems.length === 0 ? (
            <div className="empty-state">
              <ClipboardDocumentListIcon className="empty-icon" />
              <h3 className="empty-title">No hay tickets</h3>
              <p className="empty-description">
                {searchTerm
                  ? `No se encontraron tickets que coincidan con "${searchTerm}"`
                  : `No hay tickets con estado "${statusMap[activeTab]?.label}"`}
              </p>
            </div>
          ) : (
            currentItems.map((ticket) => (
              <article key={ticket.id} className="ticket-item">
                <div className="ticket-content">
                  <div className="ticket-main-info">
                    <div className="ticket-title-section">
                      <h3 className="ticket-title">{ticket.title}</h3>
                      <span className={`status-badge ${statusMap[ticket.status]?.color || "status-default"}`}>
                        {statusMap[ticket.status]?.label || ticket.status}
                      </span>
                    </div>
                    <div className="ticket-metadata">
                      <span>Fecha: {new Date(ticket.created_at).toLocaleDateString("es-ES")}</span>
                      <span className="metadata-separator">•</span>
                      <span>Creado por: {extractUserName(ticket.created_user)}</span>
                    </div>
                  </div>

                  <div className="ticket-department">
                    <div className="department-info">
                      <BuildingOfficeIcon className="department-icon" />
                      <span className="department-name">{extractDepartmentName(ticket.assigned_department)}</span>
                    </div>
                    <div className="relative-date">{formatRelativeDate(ticket.created_at)}</div>
                  </div>

                  <div className="ticket-assignment">
                    <div className="assigned-user">
                      <UsersIcon className="user-icon" />
                      <span className="user-name">{extractAssignedUsers(ticket.assigned_users)}</span>
                    </div>
                    <div className="ticket-category">
                      <TagIcon className="category-icon" />
                      <span className="category-name">{ticket.category?.name || "Otros"}</span>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <Link to={`/dashboard/tickets/${ticket.id}`} className="detail-button">
                      <ClipboardDocumentListIcon className="button-icon" />
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>





        {/* Paginación inferior */}
        {filteredTickets.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              <span className="pagination-text">Mostrar</span>
              <select
                className="pagination-select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                aria-label="Elementos por página"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="pagination-text">elementos por página</span>
            </div>

            <div className="pagination-controls">
              {/* Previous button */}
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className="page-button nav-button"
                  aria-label="Página anterior"
                >
                  ‹
                </button>
              )}

              {/* Page numbers */}
              {renderPaginationButtons()}

              {/* Next button */}
              {currentPage < totalFilteredPages && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className="page-button nav-button"
                  aria-label="Página siguiente"
                >
                  ›
                </button>
              )}
            </div>

            <div className="pagination-summary">
              <span className="pagination-text">
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredTickets.length)} de{" "}
                {filteredTickets.length} tickets
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
