"use client"

import { useState, useEffect } from "react"

type Departamento = {
  _id: string
  name: string
}

export default function AdminDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:8000/departments", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setDepartamentos(data)
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDepartamentos()
  }, [])

  const filteredDepartamentos = departamentos.filter((departamento) =>
    departamento.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-0">Departamentos</h2>
          <p className="text-muted">Listado de todos los departamentos.</p>
        </div>
        <button className="btn btn-success rounded-circle">
          <i className="bi bi-plus fs-5"></i>
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="bi bi-funnel"></i>
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
          {filteredDepartamentos.map((departamento) => (
            <div key={departamento._id} className="col-md-6 col-lg-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{departamento.name}</h5>
                </div>
                <div className="card-footer bg-white d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-danger">
                    <i className="bi bi-trash me-1"></i> Eliminar
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
