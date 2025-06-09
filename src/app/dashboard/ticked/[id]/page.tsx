import { useEffect, useState } from "react";
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import "../[id]/style.css";
import { Link } from "react-router-dom";

interface TicketUser {
  id: number;
  fullname?: string;
  name?: string;
}

interface TicketDepartment {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  created_user?: TicketUser | string;
  assigned_department?: TicketDepartment | string;
  assigned_users?: TicketUser[] | string[];
  category?: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  "1": { label: "Abierto", color: "border border-success text-success" },
  "2": { label: "Proceso", color: "bg-blue-100 text-blue-700" },
  "3": { label: "Espera", color: "border border-warning text-warning" },
  "4": { label: "Revisión", color: "bg-purple-100 text-purple-700" },
  "5": { label: "Completado", color: "border border-info text-info" },
};

function formatRelativeDate(createdAt: string): string {
  if (!createdAt) return "Fecha no disponible";
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "Fecha inválida";

  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );
  return diffInHours < 24
    ? `Hace ${diffInHours} horas`
    : `Hace ${Math.floor(diffInHours / 24)} días`;
}

function getStatusCounts(tickets: Ticket[]): Record<string, number> {
  const counts: Record<string, number> = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };
  tickets.forEach((ticket) => {
    if (counts[ticket.status] !== undefined) {
      counts[ticket.status]++;
    }
  });
  return counts;
}

function extractUserName(user: TicketUser | string | undefined): string {
  if (!user) return "Desconocido";
  if (typeof user === "string") return user;
  return user.fullname || user.name || "Desconocido";
}

function extractDepartmentName(
  dept: TicketDepartment | string | undefined
): string {
  if (!dept) return "Sin departamento";
  if (typeof dept === "string") return dept;
  return dept.name || "Sin departamento";
}

function extractAssignedUsers(
  users: TicketUser[] | string[] | undefined
): string {
  if (!users || !Array.isArray(users) || users.length === 0) {
    return "Sin asignar";
  }

  return users
    .map((user) => {
      if (typeof user === "string") return user;
      return user.fullname || user.name || "Usuario";
    })
    .join(",");
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<string>("5");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/tickets/asignados-a-mi/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        console.log("Tickets desde API:", data);
        setTickets(data);
      } catch (err) {
        console.error("Error al cargar los tickets:", err);
      }
    };
    fetchTickets();
  }, []);

  const statusCounts = getStatusCounts(tickets);
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = ticket.status === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      extractUserName(ticket.created_user)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <></>
      <div className="ticket-list-container">
        <div>
          <div className="ticket-list-content">
            {/* Header */}
            <div className="header-section">
              <h1 className="main-title">
                Listado de tickets asignados al usuario.
              </h1>

              {/* Status tabs and search */}
              <div className="tabs-search-container">
                {/* Status tabs */}
                <nav className="status-tabs" aria-label="Tabs">
                  {Object.entries(statusMap).map(([key, { label }]) => {
                    const isActive = activeTab === key;
                    const count = statusCounts[key] || 0;

                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`status-tab ${isActive ? "active" : ""}`}
                      >
                        <UsersIcon className="tab-icon" />
                        <span className="tab-label">{label}</span>
                        <span className="tab-count">{count}</span>
                        {isActive && count > 0 && (
                          <div className="active-indicator"></div>
                        )}
                      </button>
                    );
                  })}
                </nav>

                {/* Search bar */}
                    <div className="search-container">
                <div className="search-icon-container">
                  <MagnifyingGlassIcon className="search-icon" />
                </div>
                <input
                  placeholder="Buscar ticket"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider"></div>

            {/* Tickets List */}
            <div className="tickets-container">
              {filteredTickets.length === 0 ? (
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
                filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="ticket-row">
                    <div className="ticket-content">
                      {/* Left section - Title and metadata */}
                      <div className="ticket-main-info">
                        <div className="ticket-title-section">
                          <h3 className="ticket-title">{ticket.title}</h3>
                          <span
                            className={`status-badge ${
                              statusMap[ticket.status]?.color ||
                              "status-default"
                            }`}
                          >
                            {statusMap[ticket.status]?.label || ticket.status}
                          </span>
                        </div>
                        <div className="ticket-metadata">
                          <span>
                            Fecha:{" "}
                            {new Date(ticket.created_at).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                          <span className="metadata-separator">•</span>
                          <span>
                            Creado por: {extractUserName(ticket.created_user)}
                          </span>
                        </div>
                      </div>

                      {/* Center section - Department */}
                      <div className="ticket-department">
                        <div className="department-info">
                          <BuildingOfficeIcon className="department-icon" />
                          <span className="department-name">
                            {" "}
                            {extractDepartmentName(ticket.assigned_department)}
                          </span>
                        </div>
                        <div className="relative-date">
                          {formatRelativeDate(ticket.createdAt)}
                        </div>
                      </div>

                      {/* Right section - Assigned user and category */}
                      <div className="ticket-assignment">
                        <div className="assigned-user">
                          <UsersIcon className="user-icon" />
                          <span>
                            {extractAssignedUsers(ticket.assigned_users)}
                          </span>
                        </div>
                        <div className="ticket-category">
                          <TagIcon className="category-icon" />
                          <span className="category-name">
                            {ticket.category.name || "Otros"}
                          </span>
                        </div>
                      </div>

                      {/* Action button */}
                      <div className="ticket-actions">
                        <Link to={`/dashboard/tickets/${ticket.id}`}>
                          <button className="detail-button">
                            <ClipboardDocumentListIcon className="button-icon" />
                            Ver detalles
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredTickets.length > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  <span className="pagination-text">Mostrar</span>
                  <select className="pagination-select">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span className="pagination-text">elementos por página</span>
                </div>
                <div className="pagination-controls">
                  <button className="page-button active">1</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
