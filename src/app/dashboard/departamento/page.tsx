import { useEffect, useState } from "react";
import {
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/outline";


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

const statusMap: Record<string, string> = {
  "1": "Abierto",
  "2": "Proceso",
  "3": "Espera",
  "4": "Revisión",
  "5": "Completado",
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
    .join(", ");
}

export default function AssignedDepartment (){
   const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<string>("5");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/tickets/asignados-departamento/",
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
    <div className="card1">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="titulo">Listado de tickets asignados al departmento.</h1>

          {/* Status tabs */}
          <div className="buscador-tabs">
            <nav className="tabs" aria-label="Tabs">
              {Object.entries(statusMap).map(([key, label]) => {
                const isActive = activeTab === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={` ${isActive ? "" : ""}`}
                  >
                    {label}
                    <span className="statusCounts">
                      {statusCounts[key] || 0}
                    </span>
                    {statusCounts[key] > 0 && isActive && (
                      <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Search bar */}
            <div className="Input">
              {/*<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />*/}
              <input
                type="text"
                placeholder="Buscar ticket"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="raya">

        </div>
        {/* Tickets List */}
        <div className="card-2">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay tickets</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white border border-gray-0 rounded-lg p-0 hover:shadow-md transition-shadow duration-20"
              >
                <div className="container-card">
                  {/* Left section - Main info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="Titulo-card">
                          {ticket.title}
                          <span className="Boton-Statu">
                            {statusMap[ticket.status] || "Desconocido"}
                          </span>
                        </h3>

                        <div className="Container-Date-Create">
                          <span className="mx-8"></span>
                          <small className="fecha">
                            {" "}
                            Fecha:{" "}
                            {new Date(ticket.createdAt).toLocaleDateString(
                              "en-EN"
                            )}
                          </small>
                          .
                          <small className="Creado">
                            Creado por: {extractUserName(ticket.created_user)}{" "}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center section - Department and time */}
                  <div className="flex flex-col items-center text-center min-w-0 mx-8">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <BuildingOfficeIcon className="IconoOffice" />
                      <span className="font-medium">
                        {extractDepartmentName(ticket.assigned_department)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeDate(ticket.createdAt)}
                    </div>
                  </div>

                  {/* Right section - Assigned users */}
                  <div className="">
                    <div className="d-block text-muted mb-2">
                      <UsersIcon className="IcoUser" />
                      <span>{extractAssignedUsers(ticket.assigned_users)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <TagIcon className="IcoTag" />
                      <span>{ticket.category.name || "Otros"}</span>
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="ml-6">
                    <button className=" inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 Boton-Detalle">
                      <ClipboardDocumentListIcon className="IconoList" />
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}