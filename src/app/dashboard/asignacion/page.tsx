"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  CalendarDateRangeIcon,
  TagIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  UserCircleIcon,
  TicketIcon,
  CursorArrowRaysIcon,
  ChevronDownIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "../asignacion/style.css";

function deltaToHTML(deltaJson: any): string {
  const converter = new QuillDeltaToHtmlConverter(deltaJson.ops, {});
  return converter.convert();
}
interface StatusOption {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  isAvailable: boolean;
  isAssigned: boolean;
}

const statusOptions: StatusOption[] = [
  {
    key: "cancelado",
    label: "Cancelado",
    description: "Cancelado por el creador.",
    icon: XMarkIcon,
    color: "text-red-600",
  },
  {
    key: "abierto",
    label: "Abierto",
    description: "El ticket esta creado pero si empezar a trabajar.",
    icon: ClipboardDocumentListIcon,
    color: "text-blue-600",
    badge: "Ideal",
  },
  {
    key: "proceso",
    label: "Proceso",
    description: "El departamento asignado ya esta trabajando el ticket.",
    icon: WrenchScrewdriverIcon,
    color: "text-orange-600",
  },
  {
    key: "espera",
    label: "Espera",
    description: "Ticket en espera.",
    icon: ClockIcon,
    color: "text-yellow-600",
  },
  {
    key: "revision",
    label: "Revisión",
    description:
      "El creador del ticket procedera a revisar que se haya realizado.",
    icon: DocumentMagnifyingGlassIcon,
    color: "text-purple-600",
  },
  {
    key: "completado",
    label: "Completado",
    description: "Completado marcado por el creado.",
    icon: CheckCircleIcon,
    color: "text-green-600",
  },
];

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  requested_by: string;
  assigned_to?: string;
  departamento_id: string;
  created_user: {
    id: string;
    fullname: string;
    email: string;
    phone_ext: string;
    department: {
      id: string;
      name: string;
    };
  };
  category?: {
    id: string;
    name: string;
  };
  assigned_user: {
    id: string;
    fullname: string;
    email: string;
    phone_ext: string;
  };
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  createdAt: string;
}

interface Message {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    fullname: string;
  };
}
const statusMap: Record<string, { label: string; color: string }> = {
  abierto: { label: "Abierto", color: "bg-green-100 text-green-800" },
  "en progreso": { label: "En Proceso", color: "bg-blue-100 text-blue-800" },
  "en espera": { label: "En Espera", color: "bg-yellow-100 text-yellow-800" },
  resuelto: { label: "Resuelto", color: "bg-purple-100 text-purple-800" },
  completado: { label: "Completado", color: "bg-indigo-100 text-indigo-800" },
  cerrado: { label: "Cerrado", color: "bg-gray-100 text-gray-800" },
};

const priorityMap: Record<string, { label: string; color: string }> = {
  baja: { label: "Baja", color: "bg-green-100 text-green-800" },
  media: { label: "Media", color: "bg-yellow-100 text-yellow-800" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-800" },
  crítica: { label: "Crítica", color: "bg-red-100 text-red-800" },
};

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock users data
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Randy Alejandro Gomez Garcia",
      email: "asistentesistema@ssv.com.do",
      employeeId: "3901",
      isAvailable: true,
      isAssigned: selectedUsers.includes("1"),
    },
    {
      id: "2",
      name: "Jairo Perdomo",
      email: "jairoperdomo43@gmail.com",
      employeeId: "3902",
      isAvailable: true,
      isAssigned: selectedUsers.includes("2"),
    },
    {
      id: "3",
      name: "Hillarys Camilo",
      email: "hcamilo@ssv.com.do",
      employeeId: "3904",
      isAvailable: true,
      isAssigned: selectedUsers.includes("3"),
    },
    {
      id: "4",
      name: "Ignacio Martinez",
      email: "isantiago@ssv.com.do",
      employeeId: "3903",
      isAvailable: true,
      isAssigned: selectedUsers.includes("4"),
    },
  ];

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No hay token de autenticación");
          navigate("/login");
          return;
        }

        const response = await fetch(`http://localhost:8000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("No autorizado. Por favor, inicia sesión nuevamente.");
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          if (response.status === 404) {
            setError("Ticket no encontrado");
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setTicket(data);
      } catch (err) {
        console.error("Error al cargar el ticket:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id, navigate]);

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      // Asumiendo que hay un endpoint para obtener mensajes por ticket_id
      const response = await fetch(`http://localhost:8000/tickets/${id}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error("Error al obtener mensajes:", response.status);
      }
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  if (id) {
    fetchMessages();
  }
}, [id]);

const handleSendMessage = async () => {
  if (newMessage.trim() && id && ticket) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/messages/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newMessage,
          ticket_id: Number(id)
        }),
      });

      if (response.ok) {
        // Recargar el ticket para obtener los mensajes actualizados
        const ticketResponse = await fetch(`http://localhost:8000/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (ticketResponse.ok) {
          const updatedTicket = await ticketResponse.json();
          setTicket(updatedTicket);
        }

        // Limpiar el campo de entrada
        setNewMessage("");
      } else {
        console.error("Error al crear mensaje:", response.status);
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  }
};

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/tickets/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
    setShowStatusDropdown(false);
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAssignUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/tickets/${id}/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_ids: selectedUsers }),
        }
      );

      if (response.ok) {
        // Actualizar el ticket con los usuarios asignados
        console.log("Usuarios asignados correctamente");
      }
    } catch (err) {
      console.error("Error al asignar usuarios:", err);
    }
    setShowAssignModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del ticket...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="icoExclamacion" />
          <p className="text-red-500 mb-4">Error: {error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/dashboard/tickets")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Volver a la lista
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Ticket no encontrado</p>
          <Link
            to="/dashboard/asignado"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          to="/dashboard/asignado"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="icoExclamacion" />
          Volver a la lista
        </Link>

        {/* Header Card */}
        <div className="ticket-card">
          {/* Icono del ticket */}
          <div className="ticket-info">
            <div className="ticket-icon">
              <TicketIcon className="ticket-icon-inner" />
            </div>
            <div>
              <div className="ticket-meta">
                <span className="ticket-badge">
                  <TicketIcon className="ticket-badge-icon" />
                  Completado
                </span>
                <span className="ticket-id">{ticket.id}</span>
              </div>
              <h2 className="ticket-title">{ticket.title}</h2>
              <div className="ticket-category">
                <TagIcon className="ticket-category-icon" />
                {ticket.category?.name || "Sin categoría"}
              </div>
            </div>
          </div>

          {/* Estado + botón Asignar */}
          <div className="ticket-actions">
            <div className="status-dropdown-wrapper">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="status-toggle"
              >
                Estado
                <ChevronDownIcon className="dropdown-icon" />
              </button>
              {showStatusDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div>
                    <div className="dropdown-container">
                      {statusOptions.map((option) => {
                        const IconComponent = option.icon;
                        const isSelected = ticket.status === option.key;

                        return (
                          <button
                            key={option.key}
                            onClick={() => handleStatusChange(option.key)}
                            className={`dropdown-option ${
                              isSelected ? "selected" : ""
                            }`}
                          >
                            <div className={`icon-container ${option.color}`}>
                              <IconComponent className="icon" />
                            </div>
                            <div className="content-container">
                              <div className="label-badge">
                                <p className="option-label">{option.label}</p>
                                {option.badge && (
                                  <span className="badge">{option.badge}</span>
                                )}
                              </div>
                              <p className="option-description">
                                {option.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {showStatusDropdown && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setShowStatusDropdown(false)}
                  />
                  <div className="dropdown-menu">
                    {statusOptions.map((option) => {
                      const IconComponent = option.icon;
                      const isSelected = ticket.status === option.key;
                      return (
                        <button
                          key={option.key}
                          onClick={() => handleStatusChange(option.key)}
                          className={`dropdown-item ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          <div
                            className={`dropdown-icon-wrapper ${option.color}`}
                          >
                            <IconComponent className="dropdown-icon-inside" />
                          </div>
                          <div className="dropdown-content">
                            <p className="dropdown-title">{option.label}</p>
                            {option.description && (
                              <p className="dropdown-desc">
                                {option.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setShowAssignModal(true)} className="assign">
              <CursorArrowRaysIcon className="assign-icon" />
              Asignar
            </button>
          </div>
        </div>
        <div className="container-twoCard">
          {/* Creator Info */}
          <div className="modalCreate">
            <div className="contenerdor-departamento">
              <h3 className="Texto2">Creado por</h3>
              <span
                className={`btonDepar${statusMap[ticket.status]?.color || ""}`}
              >
                <BuildingOfficeIcon className="ticked"></BuildingOfficeIcon>
                {ticket.created_user.department.name || ""}
              </span>
            </div>

            <div className="linea"></div>
            <div className="space-y-3">
              <div className="flex items-center">
                <UserCircleIcon className="icoBuild" />
                <span className="text-sm text-gray-900">
                  {ticket.created_user?.fullname || "Usuario"}
                </span>
              </div>
              <div className="flex items-center">
                <EnvelopeOpenIcon className="icoBuild" />
                <span className="text-sm text-gray-600">
                  {ticket.created_user.email || ""}
                </span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="icoBuild" />
                <span className="text-sm text-gray-600">
                  {ticket.created_user.phone_ext || ""}
                </span>
              </div>
            </div>
            <div className="linea"></div>
            <button className="BotoCorreo">
              <EnvelopeIcon className="icoBuild" />
              Enviar correo
            </button>
          </div>

          <div className="container-descripcion">
            {/* Dates Section */}
            <div className="">
              <div className="titl-container">
                <CalendarDateRangeIcon className="icocaledar" />
                <h2 className="FechaText">Fechas</h2>
              </div>
              <div className="container-fecha">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Creación: {formatDate(ticket.createdAt)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Hace {calculateDaysAgo(ticket.createdAt)} días
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Modificación: {formatDate(ticket.updatedAt)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Hace {calculateDaysAgo(ticket.createdAt)} días
                  </p>
                </div>
              </div>

              {/* Department Section */}
              <div>
                <div className="Linea2"></div>
                <div className="">
                  <div className="Contenedor-flex">
                    <BuildingOfficeIcon className="icoBuild" />
                    <h2 className="Text-form">Departamento asignado</h2>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {ticket.departamento_id}
                  </span>
                </div>
                <div className="container-derpartment">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <UserIcon className="icoBuild" />
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.assigned_user?.fullname || "Jason"}
                      {ticket.assigned_user?.phone_ext || "Jason"}
                      {ticket.assigned_user?.email || "Jason"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <UserIcon className="icoBuild" />
                      {ticket.assigned_user?.fullname || "Hillarys Camilo"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.assigned_user?.fullname || "Jason"}
                      {ticket.assigned_user?.phone_ext || "Jason"}
                      {ticket.assigned_user?.email || "Jason"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="Linea2"></div>
              <div className="DescriptionSection">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Descripción
                </h2>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: deltaToHTML(JSON.parse(ticket.description)),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}

        {/* Messages Section */}
        <div className="Container-mensaje">
          <div className="pyText">
            <div className="flex items-center">
              <h2 className="text-mensaje">
                <ChatBubbleLeftRightIcon className="icoBuild" />
                Mensajes
              </h2>
            </div>
            <p className="text-s">Mensajes con el departamento asignado.</p>
          </div>

          <div className="linea3"></div>

      {/* Messages List */}
<div className="px-6 py-4 min-h-[200px] max-h-[400px] overflow-y-auto">
  {!ticket.messages || ticket.messages.length === 0 ? (
    <div className="text-center py-8">
      <ChatBubbleLeftRightIcon className="icoBuild" />
      <p className="text-gray-500">No hay mensajes aún</p>
    </div>
  ) : (
    <div className="space-y-4">
      {ticket.messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-3">
          <UserCircleIcon className="icoBuild" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {message.user.fullname}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(message.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              {message.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

          <div className="linea3"></div>
          {/* Message Input */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flexinput">
                <input
                  type="text"
                  placeholder="Escriba un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="InputMesaje"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="BotonMensaje"
                >
                  <PaperAirplaneIcon className="icoB" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Users Modal */}
      {showAssignModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAssignModal(false)}
        >
          <div className="modal-contet" onClick={(e) => e.stopPropagation()}>
            <div className="contenertext">
              <UserGroupIcon className="icouser"></UserGroupIcon>
              <h2 className="TextAsignacio">Asignar Usuarios</h2>
            </div>
            <div className="linea4"></div>
            <div className="user-list">
              {mockUsers.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <div key={user.id} className="user-item">
                    <div>
                      <strong>{user.name}</strong> - #{user.employeeId} -{" "}
                      {user.email}
                    </div>
                    <button
                      onClick={() => handleUserToggle(user.id)}
                      disabled={!user.isAvailable && !isSelected}
                      className={`user-toggle ${
                        isSelected
                          ? "selected"
                          : user.isAvailable
                          ? ""
                          : "disabled"
                      }`}
                    >
                      {isSelected ? "Quitar" : "Asignar"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="linea4"></div>
            <div className="modal-footer">
              <button
                className="botonCerrar"
                onClick={() => setShowAssignModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;
