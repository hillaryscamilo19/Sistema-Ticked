"use client"

import { useState, useEffect } from "react"
import { TicketIcon } from "@heroicons/react/24/outline"
import { data } from "react-router-dom"

type Ticket = {
  _id: string
  title: string
  status: string
  createdAt: string
  created_user:[
    id: string,
    fullname: string,
    email: string,
    phone_ext: string,
  ]
  departamento: [
    id:string,
    name: string
  ]
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
      console.log(data);
      try {
        
        
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/tickets/", {
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

          data.forEach((ticket: Ticket) => {
            switch (ticket.estado) {
              case "Abierto":
                newStats.abiertos++
                break
              case "En Proceso":
                newStats.proceso++
                break
              case "En Revisión":
                newStats.revision++
                break
              case "En Espera":
                newStats.espera++
                break
              case "Completado":
                newStats.completados++
                break
              case "Cancelado":
                newStats.cancelados++
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

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <TicketIcon className="me-2" style={{ width: "24px", height: "24px" }} />
        <h2 className="mb-0">Tickets</h2>
      </div>

      <p className="text-muted">Listado de todos los tickets realizados por los usuarios.</p>

      {/* Estadísticas */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-primary">{stats.abiertos}</h3>
              <p className="mb-0">Abiertos</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-warning">{stats.proceso}</h3>
              <p className="mb-0">Proceso</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-info">{stats.revision}</h3>
              <p className="mb-0">Revisión</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-secondary">{stats.espera}</h3>
              <p className="mb-0">Espera</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-success">{stats.completados}</h3>
              <p className="mb-0">Completados</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card h-100">
            <div className="card-body text-center">
              <h3 className="text-danger">{stats.cancelados}</h3>
              <p className="mb-0">Cancelados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de actividad de tickets */}
      <div className="card mt-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Actividad de tickets</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Fecha creación</th>
                    <th>Creado por</th>
                    <th>Departamento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.slice(0,3000).map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            ticket.status === "Completado" ? "bg-success" : ticket.status === "En Proceso" ? "bg-warning" : ticket.status === "Cancelado" ? "bg-danger": ticket.status === "Espera" ? "bg-danger": ticket.status === "Abiertos" ? "bg-warning" :""
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                      <td>{ticket.created_user.fullname}</td>
                      <td>{ticket.assigned_department.name}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2">Ver</button>
                        <button className="btn btn-sm btn-outline-secondary">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
