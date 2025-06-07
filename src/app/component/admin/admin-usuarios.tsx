"use client"

import { useState, useEffect } from "react"

type Usuario = {
  _id: string
  fullname?: string
  username: string
  email: string
  role?: string
  departamento?: string
  extension?: string
  activo: boolean
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setUsuarios(data)
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Usuarios</h2>
          <p className="text-muted">Listado de todos los usuarios del sistema.</p>
        </div>
        <button className="btn btn-success">
          <i className="bi bi-plus"></i> Nuevo Usuario
        </button>
      </div>

      <div className="row">
        <div className="col-12 mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredUsuarios.map((usuario) => (
            <div key={usuario._id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{usuario.fullname || usuario.username}</h5>
                  <div className="mb-2">
                    <small className="text-muted d-block">
                      <i className="bi bi-person me-1"></i> {usuario.username}
                    </small>
                    <small className="text-muted d-block">
                      <i className="bi bi-envelope me-1"></i> {usuario.email}
                    </small>
                    {usuario.extension && (
                      <small className="text-muted d-block">
                        <i className="bi bi-telephone me-1"></i> {usuario.extension}
                      </small>
                    )}
                    <small className="text-muted d-block">
                      <i className="bi bi-building me-1"></i> {usuario.departamento || "Sin departamento"}
                    </small>
                    <small className={`d-block ${usuario.activo ? "text-success" : "text-danger"}`}>
                      <i className={`bi ${usuario.activo ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </small>
                  </div>
                  <div className="text-center mt-3">
                    <span className="badge bg-primary rounded-pill">{usuario.role || "User"}</span>
                  </div>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-key me-1"></i> Restablecer contraseña
                  </button>
                  <button className="btn btn-sm btn-outline-primary">
                    <i className="bi bi-pencil me-1"></i> Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
