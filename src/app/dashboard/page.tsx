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
import { useTickets } from "../../hooks/useTickets"
import "./styles.css"
import Home from "../../img/Home.png"

const STATUS_LABELS = {
  0: "Asignados",
  1: "Proceso",
  2: "Espera",
  3: "Revisión",
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(true)
  const [usuario, setUsuario] = useState(null)
  const [colaboradores, setColaboradores] = useState([])
  const [loadingColaboradores, setLoadingColaboradores] = useState(true)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }

    fetchUsuario()
  }, [navigate])

  // Cargar colaboradores del departamento (solo activos)
  useEffect(() => {
    const fetchColaboradores = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8000/usuarios/departamento/colaboradores", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          localStorage.removeItem("token")
          return navigate("/login")
        }

        if (res.ok) {
          const data = await res.json()
          console.log("Colaboradores activos cargados:", data)

          // Filtro adicional en el frontend para asegurar que solo sean usuarios activos
          const colaboradoresActivos = data.filter((colaborador) => colaborador.status === true)
          setColaboradores(colaboradoresActivos)
        } else {
          console.error("Error al cargar colaboradores:", res.status)
        }
      } catch (error) {
        console.error("Error al cargar colaboradores:", error)
      } finally {
        setLoadingColaboradores(false)
      }
    }

    // Solo cargar colaboradores si ya tenemos el usuario
    if (usuario) {
      fetchColaboradores()
    }
  }, [usuario, navigate])

  const { stats, tickets, isLoading } = useTickets()

  return (
    <div className="container">
      <div className="">
        <div className="container-Title">
          <h3 className="text-Ticked text-xl font-semibold mb-1">Tickets</h3>
          <h3 className="mb-7 font-serif text-Estadistica">Estadísticas sobre los tickets asignados al usuario.</h3>
        </div>

        <div className="container-Estadistica">
          <div className="icono-tabs">
            <span>
              <ClipboardDocumentListIcon className="IconoLista" />
            </span>
            <span>
              <WrenchIcon className="IconoWrench" />
            </span>
            <span>
              <ClockIcon className="IconoClock" />
            </span>
            <span>
              <DocumentMagnifyingGlassIcon className="IconoDocument" />
            </span>
          </div>
          <div className="Container-Icono">
            {[0, 1, 2, 3].map((statusCode) => (
              <span className="bg-stone-50" key={statusCode}>
                <p className="Number">{isLoading ? "" : (stats.byStatus[statusCode] ?? 0)}</p>
                <p className="title-text">{STATUS_LABELS[statusCode]}</p>
              </span>
            ))}
          </div>
        </div>

        <div className="container-abajo">
          <img src={Home || "/placeholder.svg"} width={520} alt="Home" />
        </div>

        <div className="foorted">
          <h2>Colaboradores  del Departamento</h2>
          {loadingColaboradores ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando colaboradores...</span>
              </div>
            </div>
          ) : colaboradores.length > 0 ? (
            <div className="colaboradores">
              {colaboradores.map((colaborador) => (
                <div key={colaborador.id} className="colaborador">
                  <UserIcon width={36} />
                  <div>
                    <h3>{colaborador.fullname || "Sin nombre"}</h3>
                    <p>
                      {colaborador.email}
                      {colaborador.phone_ext && ` | #${colaborador.phone_ext}`}
                    </p>
              
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4">
              <p className="text-muted">
                No hay colaboradores activos en tu departamento o no perteneces a ningún departamento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
